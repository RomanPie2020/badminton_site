import { useActions } from '../../hooks/useActions'
import {
	useGetEventsQuery,
	useJoinEventMutation,
	useLeaveEventMutation,
} from '../../services/EventService'
import CreateEventModal from '../ui/CreateEventModal'
import EventCard from '../ui/EventCard' // ваш компонент EventCard
import FilterModal from '../ui/FilterModal'

const EventList = () => {
	const { data: events, isLoading, isError, refetch } = useGetEventsQuery()
	const [joinEvent] = useJoinEventMutation()
	const [leaveEvent] = useLeaveEventMutation()
	const currentUserId = Number(localStorage.getItem('user_id'))
	console.log(currentUserId)
	const { openFiltersModal } = useActions()

	if (isLoading)
		return <p className='text-center py-10'>Завантаження івентів…</p>
	if (isError)
		return (
			<p className='text-center py-10 text-red-600'>
				Помилка при завантаженні івентів
			</p>
		)

	return (
		<div className='p-6'>
			<div className='flex items-center justify-between mb-6 mt-32 px-4'>
				<CreateEventModal onCreated={refetch} />

				<button
					onClick={() => openFiltersModal()}
					className='flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm font-medium'
				>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						className='h-5 w-5 text-gray-600'
						fill='none'
						viewBox='0 0 24 24'
						stroke='currentColor'
					>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={2}
							d='M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L15 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 019 21v-7.586L3.293 6.707A1 1 0 013 6V4z'
						/>
					</svg>
					<span>Фільтри</span>
				</button>
			</div>
			<div className='max-w-7xl mx-auto py-8 px-4 grid gap-6 grid-cols-[repeat(auto-fit,_minmax(250px,_1fr))]'>
				{events?.map(evt => (
					<EventCard
						key={evt.id}
						event={evt}
						onRefetch={refetch}
						currentUserId={currentUserId}
						onJoin={id => joinEvent(id)}
						onLeave={id => leaveEvent(id)}
					/>
				))}
			</div>
			{/* Модалка фільтрів */}
			<FilterModal />
		</div>
	)
}

export default EventList
