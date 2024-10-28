import React, {
	useState,
	useEffect,
	useMemo,
	useCallback,
	useRef,
	lazy,
	Suspense,
} from 'react';
import {
	startOfWeek,
	endOfWeek,
	addDays,
	format,
	isBefore,
	isToday as isTodayDate,
	setHours,
	setMinutes,
	setSeconds,
} from 'date-fns';
const ShowCalendarBlock = lazy(() => import('./ShowCalendarBlock'));

// Interface for the props to the WeeklyCalendar component
interface WeeklyCalendarProps {
	today: Date;
}

const WeeklyCalendar: React.FC<WeeklyCalendarProps> = ({ today }) => {
	// State to track the current week (start and end dates)
	const [currentWeek, setCurrentWeek] = useState({
		start: startOfWeek(today),
		end: endOfWeek(today),
	});

	// Ref for scrolling
	const scrollRef = useRef<HTMLDivElement>(null);

	// Set the week start and end whenever `today` changes
	useEffect(() => {
		setCurrentWeek({
			start: startOfWeek(today),
			end: endOfWeek(today),
		});
	}, [today]);

	// Memoized array of day headers (dates)
	const dayHeaders = useMemo(() => {
		return Array.from({ length: 7 }, (_, index) => {
			const date = addDays(currentWeek.start, index);
			return (
				<div
					key={date.toISOString()}
					className={`border border-[#E6E6E6] p-2 px-3 font-sans text-start ${
						isTodayDate(date) ? 'bg-[#3292FB]' : 'bg-white'
					}`}
				>
					<p
						className={`font-[400] text-[1rem] ${
							isTodayDate(date) ? 'text-white' : 'text-[#000000]'
						}`}
					>
						{format(date, 'dd')}
					</p>
					<p
						className={`text-[.925rem] ${
							isTodayDate(date) ? 'text-white' : 'text-[#4B4652]'
						}`}
					>
						{format(date, 'EEE')}
					</p>
				</div>
			);
		});
	}, [currentWeek]);

	// Memoized array of time slots (hours)
	const timeSlots = useMemo(() => {
		return Array.from({ length: 24 }, (_, index) => index);
	}, []);

	// Helper function to generate time cells for each day
	const getDayCells = useCallback(
		(date: Date) => {
			return timeSlots.map((hour) => {
				const blockTime = setSeconds(setMinutes(setHours(date, hour), 0), 0);
				const isTodayDateHour = isTodayDate(date)
					? hour === new Date().getHours()
					: false;
				const isPast = isBefore(blockTime, new Date()) && !isTodayDateHour; // Fixing current hour issue
				const formattedTime = format(blockTime, 'hh a');

				return (
					<div
						key={`${format(date, 'yyyy-MM-dd')}-${hour}`}
						className={`border h-[90px] border-[#E6E6E6] flex items-center justify-center cursor-pointer`}
					>
						<Suspense fallback={<div></div>}>
							<ShowCalendarBlock
								date={blockTime}
								ClassNames="py-2 px-3"
								isPast={isPast}
								time={formattedTime}
							/>
						</Suspense>
					</div>
				);
			});
		},
		[timeSlots]
	);

	// Memoized cells for each day (7 days)
	const dayCells = useMemo(() => {
		return Array.from({ length: 7 }, (_, index) => {
			const date = addDays(currentWeek.start, index);
			return (
				<div key={date.toISOString()} className="grid grid-rows-24">
					{getDayCells(date)}
				</div>
			);
		});
	}, [currentWeek, getDayCells]);

	// Scroll to current date (if not in the past)

	return (
		<div className="max-w-6xl mx-auto w-full">
			{/* Top row with day names */}
			<div className="grid grid-cols-8 border border-gray-300">
				<div className="p-4 bg-white" /> {/* Empty space for time labels */}
				{dayHeaders}
			</div>

			{/* Grid with time slots and day cells */}
			<div className="grid grid-cols-8 items-start">
				{/* Time slot labels */}
				<div className="grid grid-rows-24">
					{timeSlots.map((hour) => {
						const formattedHour = format(setHours(new Date(), hour), 'hh a');
						return (
							<div
								key={hour}
								className="border p-2 h-[90px] border-[#E6E6E6] flex items-center justify-center text-gray-500"
							>
								{formattedHour}
							</div>
						);
					})}
				</div>

				{/* Calendar day cells */}
				<div
					ref={scrollRef}
					className="col-span-7 grid grid-cols-7 overflow-auto"
				>
					{dayCells}
				</div>
			</div>
		</div>
	);
};

export default WeeklyCalendar;
