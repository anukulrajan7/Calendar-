import { useMemo, lazy, Suspense } from 'react';
import {
	format,
	isToday,
	startOfMonth,
	endOfMonth,
	eachDayOfInterval,
	getDay,
	addDays,
	isBefore,
} from 'date-fns';
const ShowCalendarBlock = lazy(() => import('./ShowCalendarBlock'));

const MonthlyView = ({ startDate }: { startDate: Date }) => {
	// Memoize the start and end dates of the current month
	const startOfCurrentMonth = useMemo(
		() => startOfMonth(startDate),
		[startDate]
	);
	const endOfCurrentMonth = useMemo(() => endOfMonth(startDate), [startDate]);

	// Memoize the days of the current month
	const days = useMemo(
		() =>
			eachDayOfInterval({
				start: startOfCurrentMonth,
				end: endOfCurrentMonth,
			}),
		[startOfCurrentMonth, endOfCurrentMonth]
	);

	const startDay = useMemo(
		() => getDay(startOfCurrentMonth),
		[startOfCurrentMonth]
	);

	const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

	const completeDays = useMemo(() => {
		const daysArray = [];

		// Add previous month's days
		for (let i = 0; i < startDay; i++) {
			const dateToDisplay = addDays(startOfCurrentMonth, -(startDay - i));
			daysArray.push(
				<div
					key={`prev-${i}`}
					className="border h-[100px] relative flex items-center justify-center cursor-default"
				>
					<p
						className={`absolute text-md font-normal top-2 left-2 rounded-[2.5rem] ${'text-grey-30'}`}
					>
						{format(dateToDisplay, 'd')}
					</p>
					<Suspense fallback={<div></div>}>
						<ShowCalendarBlock
							date={dateToDisplay}
							ClassNames="pt-7"
							isPast={
								isBefore(dateToDisplay, new Date()) && !isToday(dateToDisplay)
							}
						/>
					</Suspense>
				</div>
			);
		}

		// Add actual days of the current month
		days.forEach((date) => {
			daysArray.push(
				<div
					key={format(date, 'yyyy-MM-dd')}
					className="border h-[100px] relative flex items-center justify-center cursor-pointer"
				>
					<p
						className={`absolute text-md font-normal top-2 left-2 rounded-[2.5rem] ${
							isToday(date)
								? 'bg-[#3292FB] p-[.125rem] px-2 text-white'
								: 'text-black'
						}`}
					>
						{format(date, 'd')}
					</p>
					<Suspense>
						<ShowCalendarBlock
							date={date}
							ClassNames="pt-7"
							isPast={isBefore(date, new Date()) && !isToday(date)}
						/>
					</Suspense>
				</div>
			);
		});

		return daysArray;
	}, [startDay, startOfCurrentMonth, days]);

	return (
		<div className="w-full mx-auto">
			<div className="grid grid-cols-7">
				{dayNames.map((dayName) => (
					<div
						key={dayName}
						className="border py-2 flex items-center justify-center font-400 text-grey-70 text-[1rem]"
					>
						{dayName}
					</div>
				))}
			</div>

			<div className="grid grid-cols-7">{completeDays}</div>
		</div>
	);
};

export default MonthlyView;
