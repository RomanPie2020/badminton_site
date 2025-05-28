// components/EventCard.tsx
import { format } from 'date-fns'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { EventWithRelations } from '../../shared/interfaces/models'

interface EventCardProps {
	event: EventWithRelations
	currentUserId: number
	onJoin: (id: number) => void
	onLeave: (id: number) => void
}

const EventCard: React.FC<EventCardProps> = ({
	event,
	currentUserId,
	onJoin,
	onLeave,
}) => {
	const [showModal, setShowModal] = useState(false)
	const joined = event.participants.some(u => u.id === currentUserId)
	const navigate = useNavigate()

	return (
		<>
			<div className='bg-white rounded-2xl shadow-md p-6 flex flex-col'>
				<h3 className='text-xl font-semibold mb-2'>{event.title}</h3>
				<p className='text-gray-600 text-sm mb-1'>
					📅 {format(new Date(event.eventDate), 'dd.MM.yyyy HH:mm')}
				</p>
				<p className='text-gray-600 text-sm mb-2'>📍 {event.location}</p>
				<p className='text-gray-500 text-sm mb-4'>
					Створив: <span className='font-medium'>{event.creator.username}</span>
				</p>

				<div className='mt-auto flex flex-wrap gap-2'>
					<button
						onClick={() => setShowModal(true)}
						className='px-3 py-1 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300'
					>
						Деталі
					</button>
					{joined ? (
						<button
							onClick={() => onLeave(event.id)}
							className='px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600'
						>
							Leave
						</button>
					) : (
						<button
							onClick={() => onJoin(event.id)}
							className='px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700'
						>
							Join
						</button>
					)}
					<span className='ml-auto text-gray-700 text-sm'>
						Учасників: {event.participants.length}
					</span>
				</div>
			</div>

			{/* Modal */}
			{showModal && (
				<div className='fixed inset-0 bg-black/40 flex items-center justify-center z-50'>
					<div className='bg-white rounded-xl shadow-xl w-full max-w-lg p-6 relative'>
						<button
							onClick={() => setShowModal(false)}
							className='absolute top-4 right-4 text-gray-500 hover:text-gray-700'
						>
							✕
						</button>
						<h2 className='text-2xl font-semibold mb-4'>{event.title}</h2>
						<p className='text-gray-700 mb-4'>
							{event.description || '— немає опису —'}
						</p>

						<h3 className='text-xl font-medium mb-2'>Учасники</h3>
						{event.participants.length === 0 ? (
							<p className='text-gray-500'>Ще ніхто не приєднався.</p>
						) : (
							<ul className='list-disc list-inside space-y-1'>
								{event.participants.map(user => (
									<li
										key={user.id}
										className='flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition'
									>
										{/* аватар, якщо є */}
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
			)}
		</>
	)
}

export default EventCard
