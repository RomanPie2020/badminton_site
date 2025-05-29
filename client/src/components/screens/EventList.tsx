import {
	useGetEventsQuery,
	useJoinEventMutation,
	useLeaveEventMutation,
} from '../../services/EventService'
import EventCard from '../ui/EventCard' // ваш компонент EventCard

const EventList = () => {
	const { data: events, isLoading, isError } = useGetEventsQuery()
	const [joinEvent] = useJoinEventMutation()
	const [leaveEvent] = useLeaveEventMutation()
	const currentUserId = Number(localStorage.getItem('user_id'))
	console.log(currentUserId)

	if (isLoading)
		return <p className='text-center py-10'>Завантаження івентів…</p>
	if (isError)
		return (
			<p className='text-center py-10 text-red-600'>
				Помилка при завантаженні івентів
			</p>
		)

	return (
		<div className='max-w-7xl mx-auto mt-28 py-8 px-4 grid gap-6 grid-cols-[repeat(auto-fit,_minmax(250px,_1fr))]'>
			{events?.map(evt => (
				<EventCard
					key={evt.id}
					event={evt}
					currentUserId={currentUserId}
					onJoin={id => joinEvent(id)}
					onLeave={id => leaveEvent(id)}
				/>
			))}
		</div>
	)
}

export default EventList
