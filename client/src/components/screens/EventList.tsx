import { useEffect, useState } from 'react'
import spinner from '../../assets/spinner.svg'
import { useActions } from '../../hooks/useActions'
import { useEvents } from '../../hooks/useEvents'
import { Filters } from '../../shared/interfaces/models'
import { EventInput } from '../../shared/validations/event.schema'
import { selectFilters } from '../../store/filtersSlice'
import { useAppSelector } from '../../store/store'
import ConfirmModal from '../ui/ConfirmModal'
import DetailModal from '../ui/DetailModal'
import EventCard from '../ui/EventCard'
import EventFormModal from '../ui/EventFormModal'
import FilterModal from '../ui/FilterModal'

const EventList = () => {
	const filters = useAppSelector(selectFilters)
	const [searchText, setSearchText] = useState('')
	const [searchField, setSearchField] = useState<
		'title' | 'location' | 'creator'
	>('title')
	const [sortBy, setSortBy] = useState<'eventDate' | 'title' | 'location'>(
		'eventDate'
	)
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
	const {
		items,
		isFetching,
		isError,
		hasMore,
		isLoadingMore,
		isInitialLoad,
		currentOffset,
		total,
		loadEvents,
		resetAndLoad,
		loadNextPage,
		bottomRef,
		handleCreate,
		handleJoin,
		handleLeave,
		handleEdit,
		handleDelete,
	} = useEvents(filters, searchText, searchField, sortBy, sortOrder)

	const currentUserId = Number(localStorage.getItem('user_id'))
	const { openFiltersModal } = useActions()

	const [showDetails, setShowDetails] = useState<number | null>(null)
	const [createEventForm, setCreateEventForm] = useState<Boolean>(false)
	const [editEventId, setEditEventId] = useState<number | null>(null)
	const [deleteEventId, setDeleteEventId] = useState<number | null>(null)

	const onConfirmCreate = async (data: EventInput) => {
		try {
			await handleCreate(data)
			setCreateEventForm(false)
		} catch (error) {
			console.error('Error creating event:', error)
		}
	}
	// #TODO Creating event server error and many refetching and observer works bad
	const onConfirmEdit = async (eventId: number, data: EventInput) => {
		await handleEdit(eventId, data)
		setEditEventId(null)
	}
	const onConfirmDelete = async (eventId: number) => {
		await handleDelete(eventId)
		setDeleteEventId(null)
	}

	const onConfirmJoin = async (eventId: number) => {
		await handleJoin(eventId)
		setShowDetails(null)
	}

	const onConfirmLeave = async (eventId: number) => {
		await handleLeave(eventId)
		setShowDetails(null)
	}

	useEffect(() => {
		if (createEventForm) {
			document.body.classList.add('overflow-hidden')
		} else {
			document.body.classList.remove('overflow-hidden')
		}

		return () => {
			document.body.classList.remove('overflow-hidden')
		}
	}, [createEventForm])

	if (isFetching) {
		return (
			<div className='mt-48 py-10 flex justify-center'>
				<img src={spinner} alt='Loading...' className='w-8 h-8 animate-spin' />
			</div>
		)
	}
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
			<div
				className='flex items-center justify-between mb-6 mt-32 px-4 flex-wrap gap-4
                sm:!flex-col sm:!items-stretch sm:!gap-3'
			>
				<button
					onClick={() => setCreateEventForm(true)}
					className='flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md text-white transition
               sm:!w-full sm:!justify-center'
				>
					Створити подію
				</button>
				{createEventForm && (
					<EventFormModal
						onClose={() => setCreateEventForm(false)}
						onSubmit={onConfirmCreate}
					/>
				)}

				<button
					onClick={() => openFiltersModal()}
					className='flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm font-medium
               sm:!w-full sm:!justify-center'
				>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						className='h-5 w-5 text-gray-600'
						fill='none'
						viewBox='0 0 24 24'
						stroke='currentColor'
					>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={2}
							d='M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L15 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 009 21v-7.586L3.293 6.707A1 1 0 013 6V4z'
						/>
					</svg>
					<span>Фільтри</span>
				</button>

				<div
					className='flex items-center space-x-2 flex-wrap
                  sm:!flex-col sm:!items-stretch sm:!space-x-0 sm:!gap-2 sm:!w-full'
				>
					<select
						value={searchField}
						onChange={e =>
							setSearchField(e.target.value as 'title' | 'location' | 'creator')
						}
						className='border border-gray-300 rounded-md p-2 text-sm sm:!w-full'
					>
						<option value='title'>По назві</option>
						<option value='location'>По локації</option>
						<option value='creator'>По організатору</option>
					</select>
					<input
						type='text'
						value={searchText}
						onChange={e => setSearchText(e.target.value)}
						placeholder='Введіть текст для пошуку...'
						className='border border-gray-300 rounded-md p-2 text-sm min-w-[200px] sm:!w-full'
					/>
				</div>

				<div
					className='flex items-center space-x-2 flex-wrap
                  sm:!flex-col sm:!items-stretch sm:!space-x-0 sm:!gap-2 sm:!w-full'
				>
					<label className='text-sm font-medium whitespace-nowrap sm:!w-full sm:!text-center'>
						Сортувати:
					</label>
					<select
						value={sortBy}
						onChange={e =>
							setSortBy(e.target.value as 'eventDate' | 'title' | 'location')
						}
						className='border border-gray-300 rounded-md p-2 text-sm sm:!w-full'
					>
						<option value='eventDate'>По даті</option>
						<option value='title'>По назві</option>
						<option value='location'>По локації</option>
					</select>

					<select
						value={sortOrder}
						onChange={e => setSortOrder(e.target.value as 'asc' | 'desc')}
						className='border border-gray-300 rounded-md p-2 text-sm sm:!w-full'
					>
						<option value='asc'>↑ Зростанням</option>
						<option value='desc'>↓ Спаданням</option>
					</select>
				</div>
			</div>

			<div className='max-w-7xl mx-auto py-8 xs:!px-0 px-4 grid gap-6 grid-cols-[repeat(auto-fit,_minmax(280px,_1fr))]'>
				{items.map(evt => (
					<EventCard
						key={evt.id}
						event={evt}
						currentUserId={currentUserId}
						onJoin={onConfirmJoin}
						onLeave={onConfirmLeave}
						onUpdate={onConfirmEdit}
						onDelete={onConfirmDelete}
						setShowDetails={() => setShowDetails(evt.id)}
						setEdit={() => setEditEventId(evt.id)}
						setDelete={() => setDeleteEventId(evt.id)}
					/>
				))}
			</div>

			{/* {isInitialLoad && (
				<div className='flex justify-center py-8'>
					<div className='animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full'></div>
				</div>
			)} */}

			{isLoadingMore && !isInitialLoad && (
				<div className='flex justify-center py-4'>
					<div className='animate-spin h-6 w-6 border-4 border-blue-500 border-t-transparent rounded-full'></div>
				</div>
			)}

			{!isInitialLoad && !isLoadingMore && items.length === 0 && (
				<div className='max-w-2xl mx-auto py-16 text-center'>
					<p className='text-lg font-medium text-gray-700 mb-2'>
						Жодних подій не знайдено
					</p>
					<p className='text-sm text-gray-500 mb-4'>
						Спробуйте змінити фільтри або умови пошуку
					</p>

					{(searchText ||
						(Object.keys(filters) as Array<keyof Filters>).some(key =>
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

			{!isInitialLoad && items.length > 0 && (
				<div className='text-center py-4 text-sm text-gray-500'>
					Показано {items.length} з {total} подій
					{!hasMore && items.length === total && (
						<span className='block mt-1'>Всі події завантажено</span>
					)}
				</div>
			)}

			{hasMore && !isInitialLoad && (
				<div ref={bottomRef} className='h-4 w-full' />
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
					onSubmit={onConfirmEdit}
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
