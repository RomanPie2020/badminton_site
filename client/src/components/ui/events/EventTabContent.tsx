import { EventInput } from '../../../shared/validations/event.schema'
import EventCard from '../EventCard'
import EventSkeleton from './EventSkeleton'

interface IEventTabContentProps {
	isLoading: boolean
	isError: boolean
	events: EventInput[] | undefined
	currentUserId: number

	// Custom messages
	errorMessage: string
	emptyMessage: string

	// Handlers
	onJoin: (id: number) => void
	onLeave: (id: number) => void
	onRefetch?: () => void
	onEdit: (id: number) => void
	onDelete: (id: number) => void
	onShowDetails: (id: number) => void
}

const EventTabContent = ({
	isLoading,
	isError,
	events,
	currentUserId,
	errorMessage,
	emptyMessage,
	onJoin,
	onLeave,
	onRefetch,
	onEdit,
	onDelete,
	onShowDetails,
}: IEventTabContentProps) => {
	if (isLoading) {
		return (
			<>
				<EventSkeleton />
				<EventSkeleton />
				<EventSkeleton />
			</>
		)
	}

	if (isError) {
		return <p className='text-center py-10 text-red-600'>{errorMessage}</p>
	}

	if (!events || events.length === 0) {
		return <p className='text-center py-10'>{emptyMessage}</p>
	}

	return (
		<div className='grid gap-6 grid-cols-[repeat(auto-fit,_minmax(280px,_1fr))]'>
			{events.map(evt => (
				<EventCard
					key={evt.id}
					event={evt}
					currentUserId={currentUserId}
					onJoin={onJoin}
					onLeave={onLeave}
					onRefetch={onRefetch}
					setEdit={() => onEdit(evt.id)}
					setDelete={() => onDelete(evt.id)}
					setShowDetails={() => onShowDetails(evt.id)}
				/>
			))}
		</div>
	)
}

export default EventTabContent
