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
				<p className='text-gray-700 mb-4 break-words'>
					{event.description || '— немає опису —'}
				</p>

				<div className='mb-4 text-xl text-gray-600'>
					<p>📅 {format(new Date(event.eventDate), 'dd.MM.yyyy HH:mm')}</p>
					<p>📍 {event.location}</p>
					{event.maxParticipants != null && (
						<p>
							Учасників: {event.participants.length} / {event.maxParticipants}
						</p>
					)}
				</div>

				{/* s */}

				<h3 className='text-xl font-medium mb-2'>Учасники</h3>
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
										onClose()
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
				<div className='flex justify-end gap-3'>
					{!joined && !isFull && (
						<button
							onClick={() => onJoin(event.id)}
							className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700'
						>
							Join
						</button>
					)}
					{joined && (
						<button
							onClick={() => onLeave(event.id)}
							className='px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600'
						>
							Leave
						</button>
					)}
					<button
						onClick={onClose}
						className='px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300'
					>
						Закрити
					</button>
				</div>
			</div>
		</div>
	)
}

export default DetailModal
