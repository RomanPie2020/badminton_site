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
	const isFull =
		typeof event.maxParticipants === 'number' &&
		event.participants.length >= event.maxParticipants
	const navigate = useNavigate()

	return (
		<>
			<div className='w-full max-w-md bg-white rounded-2xl shadow-md p-6 flex flex-col justify-self-center  hover:shadow-lg transition-shadow duration-200 text-justify hyphens-auto'>
				<h3 className='text-xl font-semibold mb-2'>{event.title}</h3>
				<p className='text-gray-600 text-sm mb-1'>
					📅 {format(new Date(event.eventDate), 'dd.MM.yyyy HH:mm')}
				</p>
				<p className='text-gray-600 text-sm mb-2'>📍 {event.location}</p>
				<p className='text-gray-500 text-sm mb-4'>
					Створив:{' '}
					<span className='font-medium'>
						{event.creator.nickname || event.creator.username}
					</span>
				</p>

				<div className='mt-auto flex flex-col justify-between space-x-2 gap-2'>
					<div className='flex gap-2 flex-wrap'>
						<button
							onClick={() => setShowModal(true)}
							className='px-3 py-1 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300'
						>
							Деталі
						</button>
						{!joined && !isFull && (
							<button
								onClick={() => onJoin(event.id)}
								className='px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700'
							>
								Join
							</button>
						)}
						{joined && (
							<button
								onClick={() => onLeave(event.id)}
								className='px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600'
							>
								Leave
							</button>
						)}
						{isFull && !joined && (
							<span className='px-3 py-1 bg-gray-300 text-gray-700 rounded-lg'>
								Усі місця зайнято
							</span>
						)}
					</div>

					<div className='text-sm text-gray-700 font-medium whitespace-nowrap'>
						Учасників: {event.participants.length}
						{event.maxParticipants != null && <> / {event.maxParticipants}</>}
					</div>
				</div>
			</div>

			{/* Modal */}
			{showModal && (
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
			)}
		</>
	)
}

export default EventCard
