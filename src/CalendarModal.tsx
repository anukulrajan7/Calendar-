import { useState, useEffect } from 'react';
import {
	format,
	getDate,
	getDaysInMonth,
	startOfMonth,
	addMonths,
	subMonths,
	startOfWeek,
	addDays,
	subDays,
	addWeeks,
	subWeeks,
	getDay,
} from 'date-fns';
import { FaChevronRight, FaChevronLeft } from 'react-icons/fa6';

// Generate calendar days based on the month, correctly aligning with the first day of the week
const generateCalendarDays = (
	currentMonth: Date,
	startOfWeekDay: number = 0 // Default start of the week is Sunday (0), can set to 1 for Monday
): (number | string)[] => {
	const daysInMonth = getDaysInMonth(currentMonth);
	const startOfTheMonth = startOfMonth(currentMonth);
	const firstDayOfTheMonth = getDay(startOfTheMonth);

	// Adjust to start the week from the user's preferred day (Sunday or Monday)
	const startDayOffset = (firstDayOfTheMonth - startOfWeekDay + 7) % 7;

	// Generate an array of days in the current month
	const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

	// Add leading empty days to align the first day of the month
	const leadingEmptyDays = Array.from({ length: startDayOffset }, () => '');

	return [...leadingEmptyDays, ...daysArray];
};

// Define props types
interface CalendarProps {
	selectedDate: Date; // Today's date passed from parent
	onDateChange: (date: Date) => void; // Callback to update today's date in parent
	showCalendar: () => void;
	view: 'day' | 'weekly' | 'monthly';
	startOfWeekDay?: number; // Optional prop to specify the start of the week (0 for Sunday, 1 for Monday)
}

// Calendar component
const Calendar: React.FC<CalendarProps> = ({
	selectedDate,
	onDateChange,
	showCalendar,
	view,
	startOfWeekDay = 0, // Default start of the week is Sunday, but user can change to Monday (1)
}) => {
	const [currentMonth, setCurrentMonth] = useState<Date>(selectedDate);
	const [days, setDays] = useState<(number | string)[]>([]);

	// Update days array when currentMonth changes
	useEffect(() => {
		const daysArray = generateCalendarDays(currentMonth, startOfWeekDay);
		setDays(daysArray);
	}, [currentMonth, startOfWeekDay]);

	// Handle previous and next navigation based on view
	const prev = () => {
		let newDate;

		newDate = subMonths(currentMonth, 1);

		setCurrentMonth(newDate);
		onDateChange(newDate); // Update parent with new date
	};

	const next = () => {
		let newDate;
		newDate = addMonths(currentMonth, 1);
		setCurrentMonth(newDate);
		onDateChange(newDate); // Update parent with new date
	};

	// Check if the day is today
	const isToday = (day: number): boolean => {
		return (
			day === getDate(selectedDate) &&
			format(currentMonth, 'MM-yyyy') === format(selectedDate, 'MM-yyyy')
		);
	};

	// Handle day selection
	const handleDayClick = (day: number) => {
		const selectedDate = new Date(
			currentMonth.getFullYear(),
			currentMonth.getMonth(),
			day
		);
		onDateChange(selectedDate); // Notify parent of the selected date
		showCalendar();
	};

	// Render the calendar component
	return (
		<div className="max-w-md mx-auto py-4 flex flex-col items-center gap-3 px-4 select-none">
			{/* Month or Day/Week navigation */}
			<div className="flex gap-4 items-center bg-gray-100 rounded-md">
				<button
					onClick={prev}
					className="border-[#E6E6E6] bg-white border-[1px] h-[24px] w-[24px] flex justify-center items-center rounded-md shadow-sm"
				>
					<FaChevronLeft className="text-[#4B4652] text-sm" />
				</button>
				<p className="text-[#1A1626] font-[500] text-[14px]">
					{format(currentMonth, 'dd MMM yyyy')}
				</p>
				<button
					onClick={next}
					className="border-[#E6E6E6] bg-white border-[1px] h-[24px] w-[24px] flex justify-center items-center rounded-md shadow-sm"
				>
					<FaChevronRight className="text-[#4B4652] text-sm" />
				</button>
			</div>

			{/* Separator */}
			<div className="bg-gray-100 w-full h-[1px] my-1"></div>

			{/* Calendar Grid */}
			<div className="grid grid-cols-7 gap-4 text-center w-full">
				{/* Weekday Headers */}
				{['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day, index) => (
					<div key={index} className="font-sans text-[#726E7A] text-sm">
						{day}
					</div>
				))}

				{/* Calendar Days */}
				{days.map((day, index) => (
					<div
						key={index}
						className={`px-2 py-2 rounded-md cursor-pointer hover:bg-[#F2F2F2] ${
							typeof day === 'number' && isToday(day)
								? 'bg-[#5E17EB] text-white'
								: 'text-[#1A1626]'
						} text-[12px]`}
						onClick={() => {
							if (typeof day === 'number') {
								handleDayClick(day); // Call handleDayClick when day is clicked
							}
						}}
					>
						{day}
					</div>
				))}
			</div>
		</div>
	);
};

export default Calendar;
