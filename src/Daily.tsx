import React, { useMemo, useRef, useEffect, Suspense, lazy } from 'react';
import {
	isBefore,
	setHours,
	setMinutes,
	setSeconds,
	isToday as isTodayDate,
	isPast,
} from 'date-fns';

const ShowCalendarBlock = lazy(() => import('./ShowCalendarBlock'));

interface DailyViewProps {
	today: Date; // The current date for the calendar view
}

const DailyView: React.FC<DailyViewProps> = ({ today }) => {
	// Memoized array of time slots (12-hour format with AM/PM)
	const timeSlots = useMemo(() => {
		return Array.from({ length: 24 }, (_, index) => {
			const hour12 = index === 0 || index === 12 ? 12 : index % 12; // Convert to 12-hour format
			const period = index < 12 ? 'AM' : 'PM'; // Determine AM/PM
			return {
				display: `${hour12}:00 ${period}`,
				hour: index, // Keep the original hour for comparison
			};
		});
	}, []);

	// Reference for time slot elements for scrolling
	const timeSlotRefs = useRef<(HTMLDivElement | null)[]>(
		new Array(timeSlots.length).fill(null)
	);

	// Function to check if a time block is in the past
	const isPastBlock = (hour: number) => {
		const slotTime = setSeconds(setMinutes(setHours(today, hour), 0), 0); // Create a full date object for comparison
		const currentTime = new Date();
		// Check if the slot time is in the past, excluding the current hour for today
		return (
			isBefore(slotTime, currentTime) &&
			!(isTodayDate(today) && hour === currentTime.getHours())
		);
	};

	// Scroll to the first non-past time slot
	useEffect(() => {
		const firstAvailableIndex =
			timeSlots.findIndex(({ hour }) => !isPastBlock(hour)) + 2;
		if (
			firstAvailableIndex !== -1 &&
			timeSlotRefs.current[firstAvailableIndex]
		) {
			timeSlotRefs.current[firstAvailableIndex]?.scrollIntoView({
				behavior: 'smooth',
				block: 'center',
			});
		}
	}, [today, timeSlots]);

	return (
		<div className="w-full mx-auto">
			<div className="grid grid-cols-8">
				{/* Time Slots Column */}
				<div className="border-r">
					{timeSlots.map((slot, index) => (
						<div
							key={slot.display}
							ref={(el) => (timeSlotRefs.current[index] = el)} // Set the ref for scrolling
							className="border h-[80px] flex items-center justify-center cursor-pointer"
						>
							<p>{slot.display}</p> {/* Display time in 12-hour format */}
						</div>
					))}
				</div>

				{/* Posts Column (for each time slot) */}
				<div className="col-span-7">
					<Suspense fallback={<div>Loading...</div>}>
						{timeSlots.map((slot) => {
							const past = isPastBlock(slot.hour); // Check if the current time block is in the past
							return (
								<div
									key={slot.display}
									className={`border h-[80px] flex flex-col justify-center relative`}
								>
									<ShowCalendarBlock
										ClassNames=""
										isPast={past}
										date={today}
										time={slot.display}
									/>
								</div>
							);
						})}
					</Suspense>
				</div>
			</div>
		</div>
	);
};

export default DailyView;
