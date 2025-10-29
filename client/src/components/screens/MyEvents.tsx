// src/components/pages/MyEvents.tsx
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
import { useCallback } from 'react'
import {
	useGetUserEventsQuery,
	useJoinEventMutation,
	useLeaveEventMutation,
} from '../../services/EventService'
import EventCard from '../ui/EventCard'

const MyEvents = () => {
	const currentUserId = Number(localStorage.getItem('user_id'))

	// Запити для обох вкладок
	const {
		data: createdEvents,
		isLoading: isLoadingCreated,
		isError: isErrorCreated,
		refetch: refetchCreated,
	} = useGetUserEventsQuery({ userId: currentUserId, type: 'created' })

	const {
		data: attendingEvents,
		isLoading: isLoadingAttending,
		isError: isErrorAttending,
		refetch: refetchAttending,
	} = useGetUserEventsQuery({ userId: currentUserId, type: 'attending' })

	console.log(attendingEvents)

	const [joinEvent] = useJoinEventMutation()
	const [leaveEvent] = useLeaveEventMutation()

	// Створимо обгортки, щоб передавати в EventCard:
	const handleJoin = useCallback(
		(eventId: number) => {
			joinEvent(eventId)
				.unwrap()
				.then(() => {
					refetchAttending()
				})
		},
		[joinEvent, refetchAttending]
	)

	const handleLeave = useCallback(
		(eventId: number) => {
			leaveEvent(eventId)
				.unwrap()
				.then(() => {
					refetchAttending()
				})
		},
		[leaveEvent, refetchAttending]
	)

	return (
		<div className='p-6 max-w-7xl mx-auto mt-24'>
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
						{isLoadingCreated && (
							<p className='text-center py-10'>Завантаження…</p>
						)}
						{isErrorCreated && (
							<p className='text-center py-10 text-red-600'>
								Помилка при завантаженні створених івентів
							</p>
						)}
						{!isLoadingCreated &&
							!isErrorCreated &&
							createdEvents?.length === 0 && (
								<p className='text-center py-10'>
									У вас ще немає створених івентів
								</p>
							)}
						{!isLoadingCreated &&
							!isErrorCreated &&
							createdEvents &&
							createdEvents.length > 0 && (
								<div className='grid gap-6 grid-cols-[repeat(auto-fit,_minmax(250px,_1fr))]'>
									{createdEvents.map(evt => (
										<EventCard
											key={evt.id}
											event={evt}
											currentUserId={currentUserId}
											onJoin={handleJoin}
											onLeave={handleLeave}
											onRefetch={refetchCreated}
										/>
									))}
								</div>
							)}
					</TabPanel>
					{/* Вкладка 2: “В яких я беру участь” */}
					<TabPanel className='pt-4'>
						{isLoadingAttending && (
							<p className='text-center py-10'>Завантаження…</p>
						)}
						{isErrorAttending && (
							<p className='text-center py-10 text-red-600'>
								Помилка при завантаженні івентів, в яких ви берете участь
							</p>
						)}
						{!isLoadingAttending &&
							!isErrorAttending &&
							attendingEvents?.length === 0 && (
								<p className='text-center py-10'>
									Ви ще не приєдналися до жодного івенту
								</p>
							)}
						{!isLoadingAttending &&
							!isErrorAttending &&
							attendingEvents &&
							attendingEvents.length > 0 && (
								<div className='grid gap-6 grid-cols-[repeat(auto-fit,_minmax(250px,_1fr))]'>
									{attendingEvents.map(evt => (
										<EventCard
											key={evt.id}
											event={evt}
											currentUserId={currentUserId}
											onRefetch={refetchAttending}
											onJoin={handleJoin}
											onLeave={handleLeave}
										/>
									))}
								</div>
							)}
					</TabPanel>
				</TabPanels>
			</TabGroup>
		</div>
	)
}

export default MyEvents
