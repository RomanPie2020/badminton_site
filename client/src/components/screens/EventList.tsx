import { useCallback, useEffect, useRef, useState } from 'react'
import { useActions } from '../../hooks/useActions'
import {
	useJoinEventMutation,
	useLazyGetFilteredEventsQuery,
	useLeaveEventMutation,
} from '../../services/EventService'
import { EventWithRelations, Filters } from '../../shared/interfaces/models'
import { selectFilters } from '../../store/filtersSlice'
import { useAppSelector } from '../../store/store'
import CreateEventModal from '../ui/CreateEventModal'
import EventCard from '../ui/EventCard'
import FilterModal from '../ui/FilterModal'

const PAGE_SIZE = 10

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

	const [items, setItems] = useState<EventWithRelations[]>([])
	const [currentOffset, setCurrentOffset] = useState(0)
	const [total, setTotal] = useState(0)
	const [hasMore, setHasMore] = useState(true)
	const [isLoadingMore, setIsLoadingMore] = useState(false)
	const [isInitialLoad, setIsInitialLoad] = useState(true)

	const [trigger, { isFetching, isError }] = useLazyGetFilteredEventsQuery()
	const [joinEvent] = useJoinEventMutation()
	const [leaveEvent] = useLeaveEventMutation()
	const currentUserId = Number(localStorage.getItem('user_id'))
	const { openFiltersModal } = useActions()

	const observerRef = useRef<IntersectionObserver | null>(null)
	const bottomRef = useRef<HTMLDivElement | null>(null)

	const loadEvents = useCallback(
		async (offset: number, isNewSearch: boolean = false) => {
			try {
				if (isNewSearch) {
					setIsInitialLoad(true)
				} else {
					setIsLoadingMore(true)
				}

				const result = await trigger({
					filters,
					search: searchText.trim(),
					searchField,
					sortBy,
					sortOrder,
					limit: PAGE_SIZE,
					offset,
				}).unwrap()

				const { events: newEvents, total: newTotal } = result

				if (isNewSearch) {
					// Новий пошук - замінюємо всі елементи
					setItems(newEvents || [])
					setCurrentOffset(newEvents?.length || 0)
				} else {
					// Додаємо до існуючих елементів
					setItems(prev => {
						const existingIds = new Set(prev.map(e => e.id))
						const uniqueEvents = (newEvents || []).filter(
							e => !existingIds.has(e.id)
						)
						return [...prev, ...uniqueEvents]
					})
					setCurrentOffset(prev => prev + (newEvents?.length || 0))
				}

				setTotal(newTotal || 0)
				setHasMore(
					(newEvents?.length || 0) === PAGE_SIZE &&
						offset + (newEvents?.length || 0) < (newTotal || 0)
				)
			} catch (error) {
				console.error('Помилка завантаження подій:', error)
			} finally {
				setIsInitialLoad(false)
				setIsLoadingMore(false)
			}
		},
		[trigger, filters, searchText, searchField, sortBy, sortOrder]
	)

	// Функція для скидання стану та завантаження нових даних
	const resetAndLoad = useCallback(() => {
		setItems([])
		setCurrentOffset(0)
		setTotal(0)
		setHasMore(true)
		loadEvents(0, true)
	}, [loadEvents])

	// Завантаження наступної сторінки
	const loadNextPage = useCallback(() => {
		if (!isLoadingMore && !isFetching && hasMore && currentOffset < total) {
			loadEvents(currentOffset, false)
		}
	}, [loadEvents, isLoadingMore, isFetching, hasMore, currentOffset, total])

	// Ефект для реагування на зміни фільтрів, пошуку, сортування
	useEffect(() => {
		// Відключаємо observer перед скиданням
		if (observerRef.current) {
			observerRef.current.disconnect()
		}

		resetAndLoad()
	}, [filters, searchText, searchField, sortBy, sortOrder])

	// Intersection Observer для автозавантаження
	useEffect(() => {
		if (!hasMore || isLoadingMore || isFetching || isInitialLoad) {
			return
		}

		if (observerRef.current) {
			observerRef.current.disconnect()
		}

		observerRef.current = new IntersectionObserver(
			entries => {
				if (entries[0].isIntersecting) {
					loadNextPage()
				}
			},
			{
				rootMargin: '100px', // Починаємо завантаження трохи раніше
			}
		)

		if (bottomRef.current) {
			observerRef.current.observe(bottomRef.current)
		}

		return () => {
			observerRef.current?.disconnect()
		}
	}, [loadNextPage, hasMore, isLoadingMore, isFetching, isInitialLoad])

	// Обробники подій
	const handleJoin = async (eventId: number) => {
		try {
			await joinEvent(eventId).unwrap()
			// Оновлюємо локальний стан
			setItems(prev =>
				prev.map(event =>
					event.id === eventId
						? {
								...event,
								participants: [
									...(event.participants || []),
									{ id: currentUserId },
								],
						  }
						: event
				)
			)
		} catch (error) {
			console.error('Помилка приєднання до події:', error)
		}
	}

	const handleLeave = async (eventId: number) => {
		try {
			await leaveEvent(eventId).unwrap()
			// Оновлюємо локальний стан
			setItems(prev =>
				prev.map(event =>
					event.id === eventId
						? {
								...event,
								participants: (event.participants || []).filter(
									p => p.id !== currentUserId
								),
						  }
						: event
				)
			)
		} catch (error) {
			console.error('Помилка виходу з події:', error)
		}
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
		<div className='p-6'>
			{/* Верхня панель з кнопками */}
			<div className='flex items-center justify-between mb-6 mt-32 px-4 flex-wrap gap-4'>
				<CreateEventModal onCreated={resetAndLoad} />

				<button
					onClick={() => openFiltersModal()}
					className='flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm font-medium'
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

				{/* Пошук */}
				<div className='flex items-center space-x-2 flex-wrap'>
					<select
						value={searchField}
						onChange={e =>
							setSearchField(e.target.value as 'title' | 'location' | 'creator')
						}
						className='border border-gray-300 rounded-md p-2 text-sm'
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
						className='border border-gray-300 rounded-md p-2 text-sm min-w-[200px]'
					/>
				</div>

				{/* Сортування */}
				<div className='flex items-center space-x-2 flex-wrap'>
					<label className='text-sm font-medium whitespace-nowrap'>
						Сортувати:
					</label>
					<select
						value={sortBy}
						onChange={e =>
							setSortBy(e.target.value as 'eventDate' | 'title' | 'location')
						}
						className='border border-gray-300 rounded-md p-2 text-sm'
					>
						<option value='eventDate'>По даті</option>
						<option value='title'>По назві</option>
						<option value='location'>По локації</option>
					</select>

					<select
						value={sortOrder}
						onChange={e => setSortOrder(e.target.value as 'asc' | 'desc')}
						className='border border-gray-300 rounded-md p-2 text-sm'
					>
						<option value='asc'>↑ Зростанням</option>
						<option value='desc'>↓ Спаданням</option>
					</select>
				</div>
			</div>

			{/* Сітка івент-карток */}
			<div className='max-w-7xl mx-auto py-8 px-4 grid gap-6 grid-cols-[repeat(auto-fit,_minmax(250px,_1fr))]'>
				{items.map(evt => (
					<EventCard
						key={evt.id}
						event={evt}
						onRefetch={resetAndLoad}
						currentUserId={currentUserId}
						onJoin={handleJoin}
						onLeave={handleLeave}
					/>
				))}
			</div>

			{/* Спінер для початкового завантаження */}
			{isInitialLoad && (
				<div className='flex justify-center py-8'>
					<div className='animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full'></div>
				</div>
			)}

			{/* Спінер для завантаження наступних сторінок */}
			{isLoadingMore && !isInitialLoad && (
				<div className='flex justify-center py-4'>
					<div className='animate-spin h-6 w-6 border-4 border-blue-500 border-t-transparent rounded-full'></div>
				</div>
			)}

			{/* Повідомлення про відсутність результатів */}
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
								// Скидаємо фільтри через actions, якщо потрібно
							}}
							className='px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm'
						>
							Очистити пошук
						</button>
					)}
				</div>
			)}

			{/* Інформація про кількість завантажених подій */}
			{!isInitialLoad && items.length > 0 && (
				<div className='text-center py-4 text-sm text-gray-500'>
					Показано {items.length} з {total} подій
					{!hasMore && items.length === total && (
						<span className='block mt-1'>Всі події завантажено</span>
					)}
				</div>
			)}

			{/* Маркер для IntersectionObserver */}
			{hasMore && !isInitialLoad && (
				<div ref={bottomRef} className='h-4 w-full' />
			)}

			{/* Модалка фільтрів */}
			<FilterModal />
		</div>
	)
}

export default EventList
