// import { useSocialInfoStore } from '@/features/social-media/hooks/socialInfo';
import React, {
	useState,
	useEffect,
	useRef,
	useMemo,
	useCallback,
	lazy,
	Suspense,
} from 'react';

// import { useNavigate } from 'react-router-dom';

// import CustomDialog from '../generic/Modal';
// const PostModalLazy = lazy(
// 	() => import('@/features/social-media/components/Modal/SchdeulePostModal')
// );
interface CalendarBlock {
	date: Date;
	isPast: boolean;
	ClassNames: string;
	time?: string; // Expecting time in HH:mm format
}

/**
 * Interface for LinkedIn Post data structure.
 */
export interface LinkedInPost {
	status: 'POSTED' | 'SCHEDULED';
	id: string;
	caption: string;
	media: any[]; // Simplified for brevity
	shareFeatures: any[]; // Simplified for brevity
	createdTime: number; // Timestamp in milliseconds
	type: string; // Type of the post, e.g., 'image', 'video', etc.
	visitUrl: string; // URL to view the post
}

/**
 * Component to display calendar block and associated LinkedIn posts.
 * @param {CalendarBlock} props - The properties for the calendar block.
 */
function ShowCalendarBlock({ date, time, isPast, ClassNames }: CalendarBlock) {
	const [posts, setPosts] = useState<LinkedInPost[] | null>(null);
	const [countScheduled, setCountScheduled] = useState(0);
	// const { socialCalendarLinkedin } = useSocialInfoStore();
	// const refModal = useRef<DialogHandle>(null);
	const [hoverState, setHoverState] = useState(false);
	const [selectedPost, setSelectedPost] = useState<LinkedInPost[] | null>(null);
	// const navigate = useNavigate();

	/**
	 * Function to determine if a post's time matches the target time.
	 * @param {string} postDateString - The date string of the post.
	 * @param {string} targetTime - The target time to match against.
	 * @returns {boolean} - True if the post matches the target time; false otherwise.
	 */
	const isPostCreatedAtTime = useCallback(
		(postDateString: string, targetTime: string) => {
			const [postDateTime, period] = postDateString.split(' ');
			const [postHour] = postDateTime.split(':');

			// Check if hour and period match
			return targetTime.includes(postHour) && targetTime.includes(period);
		},
		[]
	);

	// // Memoize filtered posts to improve performance
	// const filteredPosts = useMemo(() => {
	// 	if (!socialCalendarLinkedin) return null;

	// 	return socialCalendarLinkedin.data.posts.filter((post) => {
	// 		const postDate = new Date(post.createdTime);
	// 		const isSameDay =
	// 			postDate.getDate() === date.getDate() &&
	// 			postDate.getMonth() === date.getMonth() &&
	// 			postDate.getFullYear() === date.getFullYear();

	// 		const matchesTime = time
	// 			? isPostCreatedAtTime(
	// 					postDate.toLocaleTimeString('en-US', {
	// 						hour: 'numeric',
	// 						minute: 'numeric',
	// 						hour12: true,
	// 					}),
	// 					time
	// 			  )
	// 			: true;

	// 		return isSameDay && matchesTime;
	// 	});
	// }, [socialCalendarLinkedin, date, time, isPostCreatedAtTime]);

	// Update posts and countScheduled state when filteredPosts changes
	// useEffect(() => {
	// 	if (filteredPosts) {
	// 		setCountScheduled(
	// 			filteredPosts.length
	// 				? filteredPosts?.filter((post) => post.status === 'SCHEDULED')?.length
	// 				: 0
	// 		);
	// 		setPosts(filteredPosts);
	// 	}
	// }, [filteredPosts]);

	const handleMouseEnter = () => {
		if (!isPast && posts?.length === 0) {
			setHoverState(true);
		}
	};

	const handleMouseLeave = () => {
		setHoverState(false);
	};

	return (
		<div
			className={`w-full h-full ${
				isPast
					? 'bg-grey-5'
					: hoverState && posts?.length === 0
					? 'bg-[#EFF0FF] flex justify-center items-center'
					: 'bg-white'
			} transition-colors duration-300`}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
		>
			{!isPast && hoverState && !posts?.length && (
				<div
					className="border border-primary-30 w-6 h-6 rounded-md"
					onClick={() => {
						// navigate(
						// 	'/social-media/create-post' +
						// 		`?date=${date.toDateString()}&time=${time || ''}`
						// );
					}}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="21"
						height="21"
						viewBox="0 0 21 21"
						fill="none"
					>
						<path
							fillRule="evenodd"
							clipRule="evenodd"
							d="M10.2856 2.67773C10.4514 2.67773 10.6104 2.74358 10.7276 2.86079C10.8448 2.978 10.9106 3.13697 10.9106 3.30273V9.55273H17.1606C17.3264 9.55273 17.4854 9.61858 17.6026 9.73579C17.7198 9.853 17.7856 10.012 17.7856 10.1777C17.7856 10.3435 17.7198 10.5025 17.6026 10.6197C17.4854 10.7369 17.3264 10.8027 17.1606 10.8027H10.9106V17.0527C10.9106 17.2185 10.8448 17.3775 10.7276 17.4947C10.6104 17.6119 10.4514 17.6777 10.2856 17.6777C10.1199 17.6777 9.96091 17.6119 9.8437 17.4947C9.72649 17.3775 9.66064 17.2185 9.66064 17.0527V10.8027H3.41064C3.24488 10.8027 3.08591 10.7369 2.9687 10.6197C2.85149 10.5025 2.78564 10.3435 2.78564 10.1777C2.78564 10.012 2.85149 9.853 2.9687 9.73579C3.08591 9.61858 3.24488 9.55273 3.41064 9.55273H9.66064V3.30273C9.66064 3.13697 9.72649 2.978 9.8437 2.86079C9.96091 2.74358 10.1199 2.67773 10.2856 2.67773Z"
							fill="#B4B0F5"
						/>
					</svg>
				</div>
			)}

			{posts && posts?.length > 0 && !isPast && (
				<div
					className={
						'w-full h-full bg-[#FDEDE9]  border-l-[4px] border-[#FF5448] p-1 ' +
						ClassNames
					}
				>
					<p className="text-xs text-grey-40 font-500 my-2">
						{countScheduled} Post Scheduled
					</p>
					<div className="w-[100%] flex flex-wrap items-center gap-2">
						<button
							onClick={() => {
								// navigate(
								// 	'/social-media/create-post' +
								// 		`?date=${date.toDateString()}&time=${time || ''}`
								// );
							}}
							className="border-[2px] border-grey-20 border-dashed rounded-full w-[1.3rem] h-[1.3rem] my-1 flex justify-center items-center"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="13"
								height="13"
								viewBox="0 0 13 13"
								fill="none"
								className="w-5 h-5"
							>
								<path
									fill-rule="evenodd"
									clip-rule="evenodd"
									d="M6.49991 2.12891C6.60012 2.12891 6.69623 2.16871 6.76709 2.23957C6.83794 2.31043 6.87775 2.40654 6.87775 2.50675V6.28516H10.6562C10.7564 6.28516 10.8525 6.32496 10.9233 6.39582C10.9942 6.46668 11.034 6.56279 11.034 6.663C11.034 6.76321 10.9942 6.85931 10.9233 6.93017C10.8525 7.00103 10.7564 7.04084 10.6562 7.04084H6.87775V10.8192C6.87775 10.9195 6.83794 11.0156 6.76709 11.0864C6.69623 11.1573 6.60012 11.1971 6.49991 11.1971C6.3997 11.1971 6.3036 11.1573 6.23274 11.0864C6.16188 11.0156 6.12207 10.9195 6.12207 10.8192V7.04084H2.34366C2.24345 7.04084 2.14735 7.00103 2.07649 6.93017C2.00563 6.85931 1.96582 6.76321 1.96582 6.663C1.96582 6.56279 2.00563 6.46668 2.07649 6.39582C2.14735 6.32496 2.24345 6.28516 2.34366 6.28516H6.12207V2.50675C6.12207 2.40654 6.16188 2.31043 6.23274 2.23957C6.3036 2.16871 6.3997 2.12891 6.49991 2.12891Z"
									fill="#B6B6B8"
								/>
							</svg>
						</button>
						<div
							className="relative "
							onClick={() => {
								// if (refModal.current) {
								// 	refModal.current.open();
								// }
								if (posts && posts?.length > 0) {
									setSelectedPost(posts);
								}
							}}
						>
							<p
								className="absolute -top-[5px] left-3
                             flex justify-center items-center bg-white text-[.5rem] w-[15px] h-[15px] rounded-full border border-grey-10"
							>
								{' '}
								<span>{posts?.length}</span>
							</p>
							<div className="bg-[#0A66C2] w-[1.3rem] h-[1.3rem] rounded-full flex justify-center items-center">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="14"
									height="13"
									viewBox="0 0 14 13"
									fill="none"
									className="w-[80%] h-full object-contain"
								>
									<rect
										x="1.02441"
										y="1.38867"
										width="11.5"
										height="10.3393"
										transform="rotate(-0.0893678 1.02441 1.38867)"
										fill="white"
									/>
									<path
										d="M11.4383 9.92884C11.4389 10.4457 11.0206 10.8653 10.5037 10.8661C9.98679 10.8669 9.56707 10.4485 9.56627 9.93154L9.5632 7.96513C9.56212 7.27302 9.54825 6.38208 8.58721 6.38358C7.61233 6.3851 7.46434 7.13942 7.46556 7.91801L7.4687 9.93472C7.46951 10.4516 7.05115 10.8713 6.53427 10.8721C6.01739 10.8729 5.59772 10.4545 5.59692 9.93764L5.59047 5.80346C5.58969 5.30725 5.99132 4.90437 6.48752 4.9036L6.97814 4.90284C7.20338 4.90248 7.38626 5.08479 7.38661 5.31003L7.38722 5.70185C7.38724 5.71069 7.39442 5.71785 7.40326 5.71784C7.40893 5.71783 7.41417 5.71482 7.41706 5.70995C7.59624 5.40878 7.85391 5.16078 8.16317 4.99198C8.47511 4.82171 8.82786 4.73841 9.18383 4.75093C11.081 4.74798 11.4327 5.98299 11.4352 7.59038L11.4383 9.92884ZM3.47581 4.09244C3.26098 4.09281 3.05085 4.0301 2.87202 3.91223C2.69319 3.79436 2.55368 3.62663 2.47113 3.43025C2.38857 3.23387 2.36668 3.01765 2.40823 2.80895C2.44977 2.60025 2.5529 2.40843 2.70454 2.25775C2.85619 2.10707 3.04956 2.0043 3.26019 1.96244C3.47083 1.92057 3.68926 1.94149 3.88788 2.02255C4.08651 2.10361 4.25639 2.24117 4.37605 2.41783C4.49571 2.59449 4.55978 2.80232 4.56015 3.01504C4.5604 3.15627 4.53254 3.29618 4.47818 3.42676C4.42382 3.55734 4.34403 3.67605 4.24334 3.77609C4.14265 3.87614 4.02303 3.95557 3.89134 4.00985C3.75965 4.06413 3.61845 4.09219 3.47581 4.09244ZM4.42082 9.9387C4.42162 10.4561 4.00283 10.8762 3.48542 10.877C2.968 10.8778 2.5479 10.459 2.54709 9.94162L2.5407 5.84662C2.5399 5.32921 2.95869 4.9091 3.47611 4.9083C3.99352 4.90749 4.41362 5.32628 4.41443 5.8437L4.42082 9.9387ZM12.356 0.206445L1.59137 0.223236C1.34703 0.220887 1.11174 0.314681 0.937211 0.484008C0.76268 0.653334 0.663191 0.88434 0.660586 1.12626L0.67728 11.8291C0.680537 12.0712 0.780689 12.302 0.955741 12.471C1.13079 12.6399 1.36643 12.7332 1.61087 12.7302L12.3755 12.7134C12.6205 12.7161 12.8565 12.6224 13.0317 12.4529C13.2069 12.2834 13.307 12.0519 13.31 11.8094L13.2933 1.10579C13.2895 0.863394 13.1886 0.632438 13.0128 0.463662C12.8371 0.294886 12.6008 0.202867 12.356 0.206445Z"
										fill="#0A66C2"
									/>
								</svg>
							</div>
						</div>
					</div>
				</div>
			)}

			{posts && posts?.length > 0 && isPast && (
				<div
					className={
						'w-full h-full bg-[#eaeaea]  border-l-[4px] border-[#FF5448] p-1 ' +
						ClassNames
					}
				>
					<p className="text-xs text-grey-40 font-500 my-2">
						{posts?.length} Post Posted
					</p>
					<div className="w-[100%] flex flex-wrap items-center gap-2">
						<div
							className="relative "
							onClick={() => {
								setSelectedPost(posts);
							}}
						>
							<p
								className="absolute -top-[5px] left-3
                             flex justify-center items-center bg-white text-[.5rem] w-[15px] h-[15px] rounded-full border border-grey-10"
							>
								{' '}
								<span>{posts?.length}</span>
							</p>
							<div className="bg-[#0A66C2] w-[1.3rem] h-[1.3rem] rounded-full flex justify-center items-center">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="14"
									height="13"
									viewBox="0 0 14 13"
									fill="none"
									className="w-[80%] h-full object-contain"
								>
									<rect
										x="1.02441"
										y="1.38867"
										width="11.5"
										height="10.3393"
										transform="rotate(-0.0893678 1.02441 1.38867)"
										fill="white"
									/>
									<path
										d="M11.4383 9.92884C11.4389 10.4457 11.0206 10.8653 10.5037 10.8661C9.98679 10.8669 9.56707 10.4485 9.56627 9.93154L9.5632 7.96513C9.56212 7.27302 9.54825 6.38208 8.58721 6.38358C7.61233 6.3851 7.46434 7.13942 7.46556 7.91801L7.4687 9.93472C7.46951 10.4516 7.05115 10.8713 6.53427 10.8721C6.01739 10.8729 5.59772 10.4545 5.59692 9.93764L5.59047 5.80346C5.58969 5.30725 5.99132 4.90437 6.48752 4.9036L6.97814 4.90284C7.20338 4.90248 7.38626 5.08479 7.38661 5.31003L7.38722 5.70185C7.38724 5.71069 7.39442 5.71785 7.40326 5.71784C7.40893 5.71783 7.41417 5.71482 7.41706 5.70995C7.59624 5.40878 7.85391 5.16078 8.16317 4.99198C8.47511 4.82171 8.82786 4.73841 9.18383 4.75093C11.081 4.74798 11.4327 5.98299 11.4352 7.59038L11.4383 9.92884ZM3.47581 4.09244C3.26098 4.09281 3.05085 4.0301 2.87202 3.91223C2.69319 3.79436 2.55368 3.62663 2.47113 3.43025C2.38857 3.23387 2.36668 3.01765 2.40823 2.80895C2.44977 2.60025 2.5529 2.40843 2.70454 2.25775C2.85619 2.10707 3.04956 2.0043 3.26019 1.96244C3.47083 1.92057 3.68926 1.94149 3.88788 2.02255C4.08651 2.10361 4.25639 2.24117 4.37605 2.41783C4.49571 2.59449 4.55978 2.80232 4.56015 3.01504C4.5604 3.15627 4.53254 3.29618 4.47818 3.42676C4.42382 3.55734 4.34403 3.67605 4.24334 3.77609C4.14265 3.87614 4.02303 3.95557 3.89134 4.00985C3.75965 4.06413 3.61845 4.09219 3.47581 4.09244ZM4.42082 9.9387C4.42162 10.4561 4.00283 10.8762 3.48542 10.877C2.968 10.8778 2.5479 10.459 2.54709 9.94162L2.5407 5.84662C2.5399 5.32921 2.95869 4.9091 3.47611 4.9083C3.99352 4.90749 4.41362 5.32628 4.41443 5.8437L4.42082 9.9387ZM12.356 0.206445L1.59137 0.223236C1.34703 0.220887 1.11174 0.314681 0.937211 0.484008C0.76268 0.653334 0.663191 0.88434 0.660586 1.12626L0.67728 11.8291C0.680537 12.0712 0.780689 12.302 0.955741 12.471C1.13079 12.6399 1.36643 12.7332 1.61087 12.7302L12.3755 12.7134C12.6205 12.7161 12.8565 12.6224 13.0317 12.4529C13.2069 12.2834 13.307 12.0519 13.31 11.8094L13.2933 1.10579C13.2895 0.863394 13.1886 0.632438 13.0128 0.463662C12.8371 0.294886 12.6008 0.202867 12.356 0.206445Z"
										fill="#0A66C2"
									/>
								</svg>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export default ShowCalendarBlock;
