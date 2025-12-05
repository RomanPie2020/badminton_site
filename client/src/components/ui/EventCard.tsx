import { format } from 'date-fns'
import { useNavigate } from 'react-router-dom'
import { IParticipant } from '../../shared/interfaces/models'
import { TEventInput } from '../../shared/validations/event.schema'

interface IEventCardProps {
	event: TEventInput
	currentUserId: number
	onJoin: (id: number) => void
	onLeave: (id: number) => void
	onRefetch?: () => any
	setShowDetails: (id: number) => void
	setEdit: (id: number) => void
	setDelete: (id: number) => void
}

const EventCard = ({
	event,
	currentUserId,
	onJoin,
	onLeave,
	onRefetch,
	setShowDetails,
	setEdit,
	setDelete,
}: IEventCardProps) => {
	const joined = event.participants.some(
		(u: IParticipant) => u.id === currentUserId
	)
	const isCreator = event.creator.id === currentUserId
	const isFull =
		typeof event.maxParticipants === 'number' &&
		event.participants.length >= event.maxParticipants

	const navigate = useNavigate()

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
