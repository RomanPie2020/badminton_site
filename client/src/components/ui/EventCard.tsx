// components/EventCard.tsx
import { format } from 'date-fns'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { EventWithRelations } from '../../shared/interfaces/models'

interface EventCardProps {
	event: EventWithRelations
	currentUserId: number
	onJoin: (id: number) => void
	onLeave: (id: number) => void
	onUpdate: (id: number, data: EventWithRelations) => void
	onDelete: (id: number) => void
	setShowDetails: (id: number) => void
	setEdit: (id: number) => void
	setDelete: (id: number) => void
}

const EventCard: React.FC<EventCardProps> = ({
	event,
	currentUserId,
	onJoin,
	onLeave,
	onUpdate,
	onDelete,
	setShowDetails,
	setEdit,
	setDelete,
}) => {
	// const [showDetails, setShowDetails] = useState(false)
	// const [isEditOpen, setIsEditOpen] = useState(false)
	// const [isDeleteConfirm, setIsDeleteConfirm] = useState(false)

	// const [updateEvent] = useUpdateEventMutation()
	// const [deleteEvent, { isLoading: isDeleting }] = useDeleteEventMutation()

	const joined = event.participants.some(u => u.id === currentUserId)
	const isCreator = event.creator.id === currentUserId
	const isFull =
		typeof event.maxParticipants === 'number' &&
		event.participants.length >= event.maxParticipants

	const navigate = useNavigate()

	// const handleEditSubmit = async (updatedData: any) => {
	// 	console.log('Submitting updated data:', updatedData)
	// 	console.log('Event ID:', { eventId: event.id, data: { ...updatedData } })

	// 	await updateEvent({ eventId: event.id, data: { ...updatedData } }).unwrap()
	// 	const updatedEvent = await getEventById(event.id).unwrap()
	// 	setItems(prev =>
	// 		prev.map(evt => (evt.id === event.id ? updatedEvent : evt))
	// 	)

	// 	setIsEditOpen(false)
	// }
	// const handleDelete = async () => {
	// 	try {
	// 		await deleteEvent(event.id).unwrap()

	// 		setItems(prev => prev.filter(evt => evt.id !== event.id))
	// 		setIsDeleteConfirm(false)
	// 	} catch (error) {
	// 		console.error('Помилка видалення події:', error)
	// 	}
	// }

	return (
		<>
			<div className='w-full max-w-md bg-white rounded-2xl shadow-md p-6 flex flex-col justify-self-center  hover:shadow-lg transition-shadow duration-200 text-justify hyphens-auto'>
				<h3 className='text-xl font-semibold mb-2 truncate'>{event.title}</h3>
				<p className='text-gray-600 mb-1'>
					📅 {format(new Date(event.eventDate), 'dd.MM.yyyy HH:mm')}
				</p>
				<p className='text-gray-600 mb-2 truncate'>📍 {event.location}</p>
				<p>
					🏷️ Тип події: <strong>{event.eventType}</strong>
				</p>
				<p>
					🎮 Формат гри: <strong>{event.gameType}</strong>
				</p>
				<p>
					⭐ Рівень гравців: <strong>{event.levelOfPlayers}</strong>
				</p>

				<p className='text-gray-500 text-md mb-4'>
					Створив:{' '}
					<button
						onClick={() => {
							navigate(`/users/${event.creatorId}/profile`)
						}}
						className='hover:underline font-medium'
					>
						{event.creator.profile?.nickname || event.creator.username}
					</button>
				</p>

				<div className='mt-auto flex flex-col justify-between space-x-2 gap-2'>
					<div className='flex gap-2 flex-wrap'>
						<button
							onClick={() => setShowDetails(event.id)}
							className='px-3 py-1 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300'
						>
							Деталі
						</button>
						{!joined && !isFull && (
							<button
								onClick={() => onJoin(event.id)}
								className='px-3 py-1 bg-blue-700 text-white rounded-lg hover:bg-blue-500'
							>
								Приєднатися
							</button>
						)}
						{joined && (
							<button
								onClick={() => onLeave(event.id)}
								className='px-3 py-1 text-black bg-red-700 rounded-lg hover:bg-red-600'
							>
								Залишити
							</button>
						)}
						{isFull && !joined && (
							<span className='px-2 py-1 bg-gray-300 text-gray-700 rounded-lg whitespace-nowrap'>
								Усі місця зайнято
							</span>
						)}
					</div>

					<div className='text-sm text-gray-700 font-medium whitespace-nowrap'>
						Учасників: {event.participants.length}
						{event.maxParticipants != null && <> / {event.maxParticipants}</>}
					</div>
					{/* Edit/Delete for creator */}
					{isCreator && (
						<div className='flex gap-2 mt-2'>
							<button
								onClick={() => setEdit(event.id)}
								className='px-3 py-1 bg-yellow-600 text-black rounded-lg hover:bg-yellow-500'
							>
								Редагувати
							</button>
							<button
								onClick={() => setDelete(event.id)}
								className='px-3 py-1 bg-red-700 text-black rounded-lg hover:bg-red-600'
							>
								Видалити
							</button>
						</div>
					)}
				</div>
			</div>
		</>
	)
}

export default EventCard

/* {showModal && (
				<div className='fixed inset-0 bg-black/40 flex items-center justify-center z-50 text-justify hyphens-auto'>
					<div className='bg-white rounded-xl shadow-xl w-full max-w-lg p-6 relative'>
						<button
							onClick={() => setShowModal(false)}
							className='absolute top-4 right-4 text-gray-500 hover:text-gray-700'
						>
							✕
						</button>
						<h2 className='text-2xl font-semibold mb-4 pt-5'>{event.title}</h2>
						<p className='text-gray-700 mb-4'>
							{event.description || '— немає опису —'}
						</p>

						<h3 className='text-xl font-medium mb-2'>
							Учасники ({event.participants.length}
							{event.maxParticipants != null && <> / {event.maxParticipants}</>}
							)
						</h3>
						{event.participants.length === 0 ? (
							<p className='text-gray-500'>Ще ніхто не приєднався.</p>
						) : (
							<ul className='list-disc list-inside space-y-1 max-h-64 overflow-auto'>
								{event.participants.map(user => (
									<li
										key={user.id}
										className='flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition'
									>
										{user.avatarUrl ? (
											<img
												src={user.avatarUrl}
												alt={user.nickname || user.username}
												className='w-8 h-8 rounded-full object-cover'
											/>
										) : (
											<div className='w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs text-gray-600'>
												{(user.nickname || user.username)[0]?.toUpperCase()}
											</div>
										)}
										<button
											onClick={() => {
												setShowModal(false)
												navigate(`/users/${user.id}/profile`)
											}}
											className='text-blue-600 hover:underline font-medium'
										>
											{user.nickname || user.username}
										</button>
									</li>
								))}
							</ul>
						)}
					</div>
				</div>
			)}  */
