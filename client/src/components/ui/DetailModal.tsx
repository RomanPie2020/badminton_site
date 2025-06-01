import { format } from 'date-fns'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { EventWithRelations } from '../../shared/interfaces/models'

interface DetailModalProps {
	event: EventWithRelations
	currentUserId: number
	onClose: () => void
	onJoin: (id: number) => void
	onLeave: (id: number) => void
}

const DetailModal: React.FC<DetailModalProps> = ({
	event,
	currentUserId,
	onClose,
	onJoin,
	onLeave,
}) => {
	const navigate = useNavigate()
	const joined = event.participants.some(u => u.id === currentUserId)
	const isFull =
		typeof event.maxParticipants === 'number' &&
		event.participants.length >= event.maxParticipants

	console.log(event)
	return (
		<div className='fixed inset-0 bg-black/40 flex items-center justify-center z-50 text-justify hyphens-auto'>
			<div className='bg-white rounded-xl shadow-xl w-full max-w-lg p-6 relative'>
				<button
					onClick={onClose}
					className='absolute top-4 right-4 text-gray-500 hover:text-gray-700'
				>
					✕
				</button>
				<h2 className='text-2xl font-semibold mb-4 mt-4 break-words'>
					{event.title}
				</h2>
				<div className='mb-4 text-xl text-gray-600'>
					<p>📅 {format(new Date(event.eventDate), 'dd.MM.yyyy HH:mm')}</p>
					<p>📍 {event.location}</p>
					{/* {event.maxParticipants != null && (
						<p>
							Учасників: {event.participants.length} / {event.maxParticipants}
						</p>
					)} */}
				</div>
				<p className='text-gray-600 mb-2'>
					🏷️ <span className='font-medium'>Тип події:</span> {event.eventType}
				</p>
				<p className='text-gray-600 mb-2'>
					🎮 <span className='font-medium'>Формат гри:</span> {event.gameType}
				</p>
				<p className='text-gray-600 mb-4'>
					⭐ <span className='font-medium'>Рівень гравців:</span>{' '}
					{event.levelOfPlayers}
				</p>

				<p className='text-gray-700 mb-4 break-words'>
					{event.description || '— немає опису —'}
				</p>

				{/* s */}
				<div className='flex justify-end gap-3'>
					{!joined && !isFull && (
						<button
							onClick={() => onJoin(event.id)}
							className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700'
						>
							Приєднатися
						</button>
					)}
					{joined && (
						<button
							onClick={() => onLeave(event.id)}
							className='px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600'
						>
							Вийти
						</button>
					)}
					{isFull && !joined && (
						<span className='block text-center px-4 py-2 bg-gray-300 text-gray-700 rounded-lg'>
							Усі місця зайнято
						</span>
					)}
				</div>

				<h3 className='text-lg font-medium mt-6 mb-2'>
					Учасники ({event.participants.length}
					{event.maxParticipants != null && <> / {event.maxParticipants}</>})
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
										{(user.profile.nickname || user.username)[0]?.toUpperCase()}
									</div>
								)}

								<button
									onClick={() => {
										onClose()
										navigate(`/users/${user.id}/profile`)
									}}
									className='text-blue-600 hover:underline font-medium'
								>
									{user.profile.nickname || user.username}
								</button>
							</li>
						))}
					</ul>
				)}
			</div>
		</div>
	)
}

export default DetailModal
