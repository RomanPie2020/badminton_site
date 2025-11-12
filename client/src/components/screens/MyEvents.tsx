// src/components/pages/MyEvents.tsx
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
import { useEffect, useState } from 'react'
import spinner from '../../assets/spinner.svg'
import {
	useDeleteEventMutation,
	useGetUserEventsQuery,
	useJoinEventMutation,
	useLeaveEventMutation,
	useUpdateEventMutation,
} from '../../services/EventService'
import { EventWithRelations } from '../../shared/interfaces/models'
import ConfirmModal from '../ui/ConfirmModal'
import DetailModal from '../ui/DetailModal'
import EventCard from '../ui/EventCard'
import EventFormModal from '../ui/EventFormModal'

const MyEvents = () => {
	const currentUserId = Number(localStorage.getItem('user_id'))

	const [editEventId, setEditEventId] = useState<number | null>(null)
	const [deleteEventId, setDeleteEventId] = useState<number | null>(null)
	const [showDetailsId, setShowDetailsId] = useState<number | null>(null)

	const {
		data: createdEvents,
		isLoading: isLoadingCreated,
		isFetching: isFetchingCreated,
		isError: isErrorCreated,
		refetch: refetchCreated,
	} = useGetUserEventsQuery({ userId: currentUserId, type: 'created' })

	const {
		data: attendingEvents,
		isLoading: isLoadingAttending,
		isFetching: isFetchingAttending,
		isError: isErrorAttending,
		refetch: refetchAttending,
	} = useGetUserEventsQuery({ userId: currentUserId, type: 'attending' })

	console.log(attendingEvents)

	useEffect(() => {
		refetchCreated()
		refetchAttending()
	}, [])

	const [joinEvent] = useJoinEventMutation()
	const [leaveEvent] = useLeaveEventMutation()
	const [updateEvent] = useUpdateEventMutation()
	const [deleteEvent] = useDeleteEventMutation()

	const handleJoin = async (eventId: number) => {
		try {
			if (!eventId) return
			await joinEvent({ eventId })
				.unwrap()
				.then(() => {
					refetchAttending()
					refetchCreated()
				})
		} catch (error) {
			console.error('Помилка приєднання до події:', error)
		}
	}

	const handleLeave = async (eventId: number) => {
		try {
			await leaveEvent(eventId).unwrap()
			await Promise.all([refetchAttending(), refetchCreated()])

			const wasAttending = attendingEvents?.some(e => e.id === eventId)
			const stillCreated = createdEvents?.some(e => e.id === eventId)

			if (wasAttending && !stillCreated) {
				setShowDetailsId(null)
			}
		} catch (error) {
			console.error('Помилка виходу з події:', error)
		}
	}

	const handleEdit = async (eventId: number, data: EventWithRelations) => {
		await updateEvent({ eventId, data }).unwrap()
		await Promise.all([refetchCreated(), refetchAttending()])
		setEditEventId(null)
	}

	const handleDelete = async (eventId: number) => {
		await deleteEvent(eventId).unwrap()
		await Promise.all([refetchCreated(), refetchAttending()])
		setDeleteEventId(null)
	}

	return (
		<div className='p-6 xs:!p-4 max-w-7xl mx-auto mt-24'>
			<h2 className='text-3xl font-semibold mb-6 text-center'>Мої події</h2>

			<TabGroup>
				<TabList className='flex space-x-4 border-b mb-4'>
					<Tab
						className={({ selected }) =>
							`px-4 py-2 text-sm font-medium rounded-t ${
								selected
									? 'bg-blue-600 text-white'
									: 'bg-gray-100 text-gray-700'
							}`
						}
					>
						Створені
					</Tab>
					<Tab
						className={({ selected }) =>
							`px-4 py-2 text-sm font-medium rounded-t ${
								selected
									? 'bg-blue-600 text-white'
									: 'bg-gray-100 text-gray-700'
							}`
						}
					>
						В яких я беру участь
					</Tab>
				</TabList>

				<TabPanels>
					{/* Вкладка 1: “Створені” */}
					<TabPanel className='pt-4'>
						{isFetchingCreated && (
							<div className='py-10 flex justify-center'>
								<img
									src={spinner}
									alt='Loading...'
									className='w-8 h-8 animate-spin'
								/>
							</div>
						)}

						{isErrorCreated && (
							<p className='text-center py-10 text-red-600'>
								Помилка при завантаженні створених івентів
							</p>
						)}
						{!isFetchingCreated &&
							!isErrorCreated &&
							createdEvents?.length === 0 && (
								<p className='text-center py-10'>
									У вас ще немає створених івентів
								</p>
							)}
						{!isFetchingCreated &&
							!isErrorCreated &&
							createdEvents &&
							createdEvents.length > 0 && (
								<div className='grid gap-6 grid-cols-[repeat(auto-fit,_minmax(280px,_1fr))]'>
									{createdEvents?.map(evt => (
										<EventCard
											key={evt.id}
											event={evt}
											currentUserId={currentUserId}
											onJoin={handleJoin}
											onLeave={handleLeave}
											onRefetch={refetchCreated}
											setEdit={() => setEditEventId(evt.id)}
											setDelete={() => setDeleteEventId(evt.id)}
											setShowDetails={() => setShowDetailsId(evt.id)}
										/>
									))}
								</div>
							)}
					</TabPanel>
					{/* Вкладка 2: “В яких я беру участь” */}
					<TabPanel className='pt-4'>
						{isFetchingAttending && (
							<div className='py-10 flex justify-center'>
								<img
									src={spinner}
									alt='Loading...'
									className='w-8 h-8 animate-spin'
								/>
							</div>
						)}

						{isErrorAttending && (
							<p className='text-center py-10 text-red-600'>
								Помилка при завантаженні івентів, в яких ви берете участь
							</p>
						)}
						{!isFetchingAttending &&
							!isErrorAttending &&
							attendingEvents?.length === 0 && (
								<p className='text-center py-10'>
									Ви ще не приєдналися до жодного івенту
								</p>
							)}
						{!isFetchingAttending &&
							!isErrorAttending &&
							attendingEvents &&
							attendingEvents.length > 0 && (
								<div className='grid gap-6 grid-cols-[repeat(auto-fit,_minmax(280px,_1fr))]'>
									{attendingEvents.map(evt => (
										<EventCard
											key={evt.id}
											event={evt}
											currentUserId={currentUserId}
											onJoin={handleJoin}
											onLeave={handleLeave}
											onRefetch={refetchAttending}
											setEdit={() => setEditEventId(evt.id)}
											setDelete={() => setDeleteEventId(evt.id)}
											setShowDetails={() => setShowDetailsId(evt.id)}
										/>
									))}
								</div>
							)}
					</TabPanel>
				</TabPanels>
			</TabGroup>

			{showDetailsId && (
				<DetailModal
					event={
						[...(createdEvents ?? []), ...(attendingEvents ?? [])].find(
							e => e.id === showDetailsId
						)!
					}
					currentUserId={currentUserId}
					onJoin={() => handleJoin(showDetailsId)}
					onLeave={() => handleLeave(showDetailsId)}
					onClose={() => setShowDetailsId(null)}
				/>
			)}

			{editEventId && (
				<EventFormModal
					event={
						[...(createdEvents ?? []), ...(attendingEvents ?? [])].find(
							e => e.id === editEventId
						)!
					}
					onClose={() => setEditEventId(null)}
					onSubmit={data => handleEdit(editEventId, data)}
				/>
			)}

			{deleteEventId && (
				<ConfirmModal
					event={
						[...(createdEvents ?? []), ...(attendingEvents ?? [])].find(
							e => e.id === deleteEventId
						)!
					}
					onClose={() => setDeleteEventId(null)}
					onConfirm={handleDelete}
				/>
			)}
		</div>
	)
}

export default MyEvents
