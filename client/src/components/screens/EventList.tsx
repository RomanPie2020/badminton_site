import { useCallback, useRef, useState } from 'react'
import { useDebounce } from '../../hooks/useDebounce'
import { useEvents } from '../../hooks/useEvents'
import {
	IFilters,
	TModalState,
	TSearchField,
	TSortBy,
	TSortOrder,
} from '../../shared/interfaces/models'
import { TEventInput } from '../../shared/validations/event.schema'
import { selectFilters } from '../../store/filtersSlice'
import { useAppSelector } from '../../store/store'
import EventCard from '../ui/EventCard'
import EventControls from '../ui/events/EventControls'
import EventSkeleton from '../ui/events/EventSkeleton'
import ConfirmModal from '../ui/FilterModals/ConfirmModal'
import DetailModal from '../ui/FilterModals/DetailModal'
import EventFormModal from '../ui/FilterModals/EventFormModal'
import FilterModal from '../ui/FilterModals/FilterModal'

const EventList = () => {
	const filters = useAppSelector(selectFilters)
	const currentUserId = Number(localStorage.getItem('user_id'))

	const [searchText, setSearchText] = useState('')
	const debouncedSearchText = useDebounce(searchText, 500)

	const [searchField, setSearchField] = useState<TSearchField>('title')
	const [sortBy, setSortBy] = useState<TSortBy>('eventDate')
	const [sortOrder, setSortOrder] = useState<TSortOrder>('asc')

	// Modals State
	const [showDetails, setShowDetails] = useState<TModalState>(null)
	const [createEventForm, setCreateEventForm] = useState<Boolean>(false)
	const [editEventId, setEditEventId] = useState<TModalState>(null)
	const [deleteEventId, setDeleteEventId] = useState<TModalState>(null)

	const bottomRef = useRef<HTMLDivElement | null>(null)

	const {
		items,
		total,
		hasMore,
		isMounting,
		isSearching,
		isLoadingMore,
		isError,
		resetAndLoad,
		handleCreate,
		handleJoin,
		handleLeave,
		handleEdit,
		handleDelete,
	} = useEvents(
		filters,
		debouncedSearchText,
		searchField,
		sortBy,
		sortOrder,
		bottomRef
	)

	// Callbacks for modals
	const onConfirmCreate = async (data: TEventInput) => {
		await handleCreate(data)
		setCreateEventForm(false)
	}
	const onConfirmEdit = async (eventId: number, data: TEventInput) => {
		await handleEdit(eventId, data)
		setEditEventId(null)
	}

	const onConfirmDelete = async (eventId: number) => {
		await handleDelete(eventId)
		setDeleteEventId(null)
	}

	// Memoized handlers for controls to prevent re-renders
	const handleSetCreateOpen = useCallback(() => setCreateEventForm(true), [])

	if (isError) {
		return (
			<div className='p-6'>
				<div className='text-center py-10'>
					<p className='text-red-600 text-lg font-medium mb-4'>
						Помилка при завантаженні подій
					</p>
					<button
						onClick={resetAndLoad}
						className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
					>
						Спробувати знову
					</button>
				</div>
			</div>
		)
	}

	return (
		<div className='p-6 xs:!px-4'>
			<EventControls
				searchText={searchText}
				setSearchText={setSearchText}
				searchField={searchField}
				setSearchField={setSearchField}
				sortBy={sortBy}
				setSortBy={setSortBy}
				sortOrder={sortOrder}
				setSortOrder={setSortOrder}
				onCreateClick={handleSetCreateOpen}
			/>

			{isMounting && <EventSkeleton />}
			{isSearching ? (
				<div className=''>
					<EventSkeleton />
				</div>
			) : (
				<div className='max-w-7xl mx-auto py-8 xs:!px-0 px-4 grid gap-6 grid-cols-[repeat(auto-fit,_minmax(280px,_1fr))]'>
					{items.map(evt => (
						<EventCard
							key={evt.id}
							event={evt}
							currentUserId={currentUserId}
							onJoin={handleJoin}
							onLeave={handleLeave}
							// onUpdate={onConfirmEdit}
							// onDelete={onConfirmDelete}
							setShowDetails={() => setShowDetails(evt.id)}
							setEdit={() => setEditEventId(evt.id)}
							setDelete={() => setDeleteEventId(evt.id)}
						/>
					))}
				</div>
			)}
			{isLoadingMore && (
				<div className=''>
					<EventSkeleton />
				</div>
			)}

			{/* Empty State */}
			{!isLoadingMore && items.length === 0 && (
				<div className='max-w-2xl mx-auto py-16 text-center'>
					<p className='text-lg font-medium text-gray-700 mb-2'>
						Жодних подій не знайдено
					</p>
					<p className='text-sm text-gray-500 mb-4'>
						Спробуйте змінити фільтри або умови пошуку
					</p>

					{(searchText ||
						(Object.keys(filters) as Array<keyof IFilters>).some(key =>
							Boolean(filters[key])
						)) && (
						<button
							onClick={() => {
								setSearchText('')
							}}
							className='px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm'
						>
							Очистити пошук
						</button>
					)}
				</div>
			)}

			{!isMounting && items.length > 0 && (
				<div className='text-center py-4 text-sm text-gray-500'>
					Показано {items.length} з {total} подій
					{!hasMore && items.length === total && (
						<span className='block mt-1'>Всі події завантажено</span>
					)}
				</div>
			)}

			{/* Observer Element */}
			<div ref={bottomRef} className='h-2 w-full ' />

			{/* Modals */}
			{createEventForm && (
				<EventFormModal
					onClose={() => setCreateEventForm(false)}
					onSubmit={onConfirmCreate}
				/>
			)}
			{showDetails && (
				<DetailModal
					event={items.find(e => e.id === showDetails)!}
					currentUserId={currentUserId}
					onClose={() => setShowDetails(null)}
					onJoin={() => handleJoin(showDetails)}
					onLeave={() => handleLeave(showDetails)}
				/>
			)}
			{editEventId && (
				<EventFormModal
					event={items.find(e => e.id === editEventId)!}
					currentParticipants={
						items.find(e => e.id === editEventId)?.participants.length
					}
					onClose={() => setEditEventId(null)}
					onSubmit={data => onConfirmEdit(editEventId, data)}
				/>
			)}
			{deleteEventId && (
				<ConfirmModal
					event={items.find(e => e.id === deleteEventId)!}
					onClose={() => setDeleteEventId(null)}
					onConfirm={id => onConfirmDelete(id)}
				/>
			)}
			<FilterModal />
		</div>
	)
}

export default EventList
