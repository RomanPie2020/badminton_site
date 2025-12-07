import { TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
import { useMyEvents } from '../../hooks/useMyEvents'
import EventTabContent from '../ui/events/EventTabContent'
import StyledTab from '../ui/events/StyledTab'
import ConfirmModal from '../ui/filterModals/ConfirmModal'
import DetailModal from '../ui/filterModals/DetailModal'
import EventFormModal from '../ui/filterModals/EventFormModal'

const MyEvents = () => {
	const currentUserId = Number(localStorage.getItem('user_id'))
	const {
		// Data
		createdEvents,
		attendingEvents,
		// States
		isFetchingCreated,
		isErrorCreated,
		isFetchingAttending,
		isErrorAttending,
		// Modal States
		editEventId,
		setEditEventId,
		deleteEventId,
		setDeleteEventId,
		showDetailsId,
		setShowDetailsId,
		// Handlers
		handleJoin,
		handleLeave,
		handleEdit,
		handleDelete,
		refetchCreated,
		refetchAttending,
		// Helpers
		// getEventById,
	} = useMyEvents(currentUserId)

	return (
		<div className='p-6 xs:!p-4 max-w-7xl mx-auto mt-24'>
			<h2 className='text-3xl font-semibold mb-6 text-center'>Мої події</h2>

			<TabGroup>
				<TabList className='flex space-x-4 border-b mb-4'>
					<StyledTab>Створені</StyledTab>
					<StyledTab>В яких я беру участь</StyledTab>
				</TabList>

				<TabPanels>
					<TabPanel className='pt-4'>
						<EventTabContent
							isLoading={isFetchingCreated}
							isError={isErrorCreated}
							events={createdEvents}
							currentUserId={currentUserId}
							errorMessage='Помилка при завантаженні створених івентів'
							emptyMessage='У вас ще немає створених івентів'
							// Handlers
							onJoin={handleJoin}
							onLeave={handleLeave}
							onRefetch={refetchCreated}
							onEdit={setEditEventId}
							onDelete={setDeleteEventId}
							onShowDetails={setShowDetailsId}
						/>
					</TabPanel>

					<TabPanel className='pt-4'>
						<EventTabContent
							isLoading={isFetchingAttending}
							isError={isErrorAttending}
							events={attendingEvents}
							currentUserId={currentUserId}
							errorMessage='Помилка при завантаженні івентів, в яких ви берете участь'
							emptyMessage='Ви ще не приєдналися до жодного івенту'
							// Handlers
							onJoin={handleJoin}
							onLeave={handleLeave}
							onRefetch={refetchAttending}
							onEdit={setEditEventId}
							onDelete={setDeleteEventId}
							onShowDetails={setShowDetailsId}
						/>
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
