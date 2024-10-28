import React, { useState, useRef, lazy, Suspense } from 'react';
import {
	addMonths,
	addWeeks,
	subDays,
	subMonths,
	subWeeks,
	startOfWeek,
	endOfWeek,
} from 'date-fns';
import { FaChevronRight, FaChevronLeft } from 'react-icons/fa6';
import { format, addDays } from 'date-fns';
// import CustomDialog, { DialogHandle } from '../Modal';

const DailyView = lazy(() => import('./Daily'));
const MonthlyView = lazy(() => import('./monthly'));
const WeeklyCalendar = lazy(() => import('./weekly'));
const Calendar = lazy(() => import('./CalendarModal'));

const DateRangeDisplay = ({
	view,
	currentDate,
}: {
	view: 'day' | 'weekly' | 'monthly'; // Define possible view types
	currentDate: Date;
}) => {
	// Helper function to format the month and year
	const formatDate = (date: Date) => format(date, 'MMM-yy'); // e.g. Sep-24

	// Helper function to get the date range for the week
	const getWeekRange = () => {
		const start = startOfWeek(currentDate); // Get start of the week
		const end = endOfWeek(currentDate); // Get end of the week
		return `${format(start, 'dd MMM')} - ${format(end, 'dd MMM yy')}`; // e.g. 01 Sep - 07 Sep 24
	};

	// Handle date display for daily, weekly, and monthly views
	const getDateRange = () => {
		switch (view) {
			case 'day':
				return `${format(currentDate, 'EEE, dd MMM yyyy')}`; // e.g. Friday, 01 Sep 2024
			case 'weekly':
				return getWeekRange();
			case 'monthly':
				return `${formatDate(currentDate)} ${format(currentDate, 'yyyy')}`; // e.g. Sep 2024
			default:
				return '';
		}
	};

	return (
		<div>
			{/* Display the selected date or range */}
			<h2 className="text-[#1A1626] font-[500] text-[14px]">
				{getDateRange()}
			</h2>
		</div>
	);
};

const CustomCalendar: React.FC = () => {
	const [view, setView] = useState<'monthly' | 'day' | 'weekly'>('monthly');
	const [currentDate, setCurrentDate] = useState<Date>(new Date());
	// const dialogRef = useRef<DialogHandle>(null);
	const postTypesArray: ('monthly' | 'day' | 'weekly')[] = [
		'monthly',
		'weekly',
		'day',
	];

	const prev = () => {
		let newDate;
		if (view === 'monthly') {
			newDate = subMonths(currentDate, 1);
		} else if (view === 'weekly') {
			newDate = subWeeks(currentDate, 1);
		} else {
			newDate = subDays(currentDate, 1);
		}
		setCurrentDate(newDate); // Update parent with new date
	};

	const next = () => {
		let newDate;
		if (view === 'monthly') {
			newDate = addMonths(currentDate, 1);
		} else if (view === 'weekly') {
			newDate = addWeeks(currentDate, 1);
		} else {
			newDate = addDays(currentDate, 1);
		}
		setCurrentDate(newDate);
	};

	return (
		<div className="p-6 bg-white rounded-md shadow-sm flex flex-col h-full select-none">
			<div className="flex items-center justify-between my-2 mb-3 ">
				<div className="flex gap-9 items-center justify-between">
					<div className="flex gap-4 items-center">
						<button
							onClick={prev}
							className="border-[#E6E6E6] border-[1px] h-[24px] w-[24px] flex justify-center items-center rounded-md shadow-sm"
						>
							<FaChevronLeft className="text-[#4B4652] text-sm" />
						</button>
						<div className="text-[#1A1626] font-[500] text-[14px]">
							<DateRangeDisplay view={view} currentDate={currentDate} />
						</div>
						<button
							onClick={next}
							className="border-[#E6E6E6] border-[1px] h-[24px] w-[24px]  flex justify-center items-center rounded-md shadow-sm"
						>
							<FaChevronRight className="text-[#4B4652] text-sm" />
						</button>
					</div>
					<button
						onClick={() => {
							setCurrentDate(new Date());
						}}
						className="border-[#E6E6E6] rounded-md p-1 px-3 text-[#1A1626] text-sm font-[500] border-[2px]"
					>
						Today
					</button>
				</div>
				<div className="flex justify-between mb-4">
					<div>
						<div
							role="tablist"
							className="tabs flex border-[1px] border-[#E6E6E6] rounded-md items-center gap-2 py-1"
						>
							{postTypesArray.map((type, index) => (
								<button
									role="tab"
									key={index}
									className={`${
										view === type
											? 'bg-[#EBF1FD] rounded-md py-[.4rem] text-sm text-[#4C6AF2] border-[1px] border-[#8CA8FD] capitalize'
											: 'mx-2 my-1 text-[#726E7A] capitalize text-sm'
									} px-5`}
									onClick={() => setView(type)}
								>
									{type}
								</button>
							))}
						</div>
					</div>
				</div>
			</div>

			{/* Keep all views in memory, only conditionally display them */}
			<div style={{ display: view === 'monthly' ? 'block' : 'none' }}>
				<Suspense fallback={<div></div>}>
					<MonthlyView startDate={currentDate} />
				</Suspense>
			</div>
			<div style={{ display: view === 'weekly' ? 'block' : 'none' }}>
				<Suspense fallback={<div></div>}>
					<WeeklyCalendar today={currentDate} />
				</Suspense>
			</div>
			<div style={{ display: view === 'day' ? 'block' : 'none' }}>
				<Suspense fallback={<div></div>}>
					<DailyView today={currentDate} />
				</Suspense>
			</div>

			{/* Calendar Modal */}
			{/* <CustomDialog ref={dialogRef}>
				<Suspense fallback={<div></div>}>
					<Calendar
						selectedDate={currentDate}
						showCalendar={() => {
							if (dialogRef.current) {
								dialogRef.current.close();
							}
						}}
						view={view}
						onDateChange={setCurrentDate}
					/>
				</Suspense>
			</CustomDialog> */}
		</div>
	);
};

export default CustomCalendar;
