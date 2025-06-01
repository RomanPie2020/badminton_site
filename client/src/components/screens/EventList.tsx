import { useCallback, useEffect, useRef, useState } from 'react'
import { useActions } from '../../hooks/useActions'
import {
	useJoinEventMutation,
	useLazyGetFilteredEventsQuery,
	useLeaveEventMutation,
} from '../../services/EventService'
import { selectFilters } from '../../store/filtersSlice'
import { useAppSelector } from '../../store/store'
import CreateEventModal from '../ui/CreateEventModal'
import EventCard from '../ui/EventCard'
import FilterModal from '../ui/FilterModal'

const PAGE_SIZE = 10 // кількість івентів за раз (limit)

const EventList = () => {
	// 1) redux-фільтри
	const filters = useAppSelector(selectFilters)

	// 2) локальні стани для пошуку + сортування
	const [searchText, setSearchText] = useState('')
	const [searchField, setSearchField] = useState<
		'title' | 'location' | 'creator'
	>('title')
	const [sortBy, setSortBy] = useState<'eventDate' | 'title' | 'location'>(
		'eventDate'
	)
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

	// --- Локальні стани для інфініті-скролу ---
	const [items, setItems] = useState<any[]>([]) // масив завантажених івентів
	const [offset, setOffset] = useState(0) // скільки записів вже завантажено
	const [total, setTotal] = useState(0) // загальна кількість записів на сервері
	const [hasMore, setHasMore] = useState(true) // чи ще є що підвантажувати
	const [isFetchingNextPage, setIsFetchingNextPage] = useState(false)

	// --- RTK Query: lazy hook ---
	const [trigger, { data, isFetching: isFetchingFirstPage, isError, error }] =
		useLazyGetFilteredEventsQuery()

	// 3) Викликаємо hook із усіма параметрами
	// const {
	// 	data: events,
	// 	isLoading,
	// 	isError,
	// 	isFetching,
	// 	refetch,
	// } = useGetFilteredEventsQuery({
	// 	filters,
	// 	search: searchText,
	// 	searchField,
	// 	sortBy,
	// 	sortOrder,
	// })

	const [joinEvent] = useJoinEventMutation()
	const [leaveEvent] = useLeaveEventMutation()
	const currentUserId = Number(localStorage.getItem('user_id'))
	const { openFiltersModal } = useActions()

	const observerRef = useRef<IntersectionObserver | null>(null)
	const bottomRef = useRef<HTMLDivElement | null>(null)

	const fetchPage = useCallback(
		async (pageOffset: number) => {
			if (isFetchingNextPage || !hasMore) return

			if (pageOffset > 0) {
				setIsFetchingNextPage(true)
			}

			await trigger({
				filters,
				search: searchText,
				searchField,
				sortBy,
				sortOrder,
				limit: PAGE_SIZE,
				offset: pageOffset,
			})
		},
		[
			trigger,
			filters,
			searchText,
			searchField,
			sortBy,
			sortOrder,
			isFetchingNextPage,
			hasMore,
		]
	)

	// --- Коли змінилися фільтри / пошук / сортування, робимо повну перезагрузку ---
	useEffect(() => {
		setItems([])
		setOffset(0)
		setTotal(0)
		setHasMore(true)
		setIsFetchingNextPage(false)

		// Викликаємо перший запит
		fetchPage(0)
	}, [filters, searchText, searchField, sortBy, sortOrder])

	// --- Коли `data` оновилася (отримали відповіді) ---
	useEffect(() => {
		if (!data) return

		const {
			events: newRows,
			total: newTotal,
			offset: serverOffset,
		} = data as any

		// // Фільтруємо ті нові рядки, id яких уже є у items
		// setItems(prevItems => {
		// 	const existingIds = new Set(prevItems.map(e => e.id))
		// 	const filteredNew = newRows.filter(e => !existingIds.has(e.id))
		// 	return [...prevItems, ...filteredNew]
		// })

		// // *** Увага ***
		// //   newRows.length — це скільки записів повернув сервер, але частина з них
		// //   уже могла бути у items (якщо дублювання). Тому, щоб коректно збільшити offset
		// //   (кількість реально доданих унікальних записів), потрібно використовувати uniqueNew.length.
		// const uniqueCount = newRows.filter((e: any) => {
		// 	// повторюємо фільтрацію, щоб порахувати, скільки дійсно унікальних
		// 	// (можна оптимізувати, але для простоти тут так)
		// 	return !items.some(existing => existing.id === e.id)
		// }).length

		// // Оновлюємо offset і total так само
		// setOffset(prevOffset => prevOffset + uniqueCount)
		// setTotal(newTotal)

		// // Якщо вже завантажили >= total, більше не підвантажувати
		// if (offset + uniqueCount >= newTotal) {
		// 	setHasMore(false)
		// }

		// setIsFetchingNextPage(false)
		// Щоб не дублювати фільтрацію, вважаємо uniqueCount на основі filteredNew:
		setItems(prevItems => {
			// просто додаємо всі нові записи, яких раніше не було
			const existingIds = new Set(prevItems.map(e => e.id))
			const filteredNew = newRows.filter(e => !existingIds.has(e.id))
			return [...prevItems, ...filteredNew]
		})

		// Тепер беремо offset прямо з відповіді сервера (offset = той, що ми передали)
		// плюс кількість рядків, які прийшли в newRows
		const newOffset = serverOffset + newRows.length
		setOffset(newOffset)

		setTotal(newTotal)
		// Якщо дійшли до кінця — скидаємо hasMore
		if (newOffset >= newTotal) {
			setHasMore(false)
		}

		setIsFetchingNextPage(false)
	}, [data])

	// --- IntersectionObserver: коли на екрані з’явиться “дивактор” (край списка), підвантажуємо ---

	useEffect(() => {
		if (isFetchingNextPage) return
		if (!hasMore) return

		if (observerRef.current) {
			observerRef.current.disconnect()
		}

		observerRef.current = new IntersectionObserver(entries => {
			if (entries[0].isIntersecting) {
				fetchPage(offset)
			}
		})

		if (bottomRef.current) {
			observerRef.current.observe(bottomRef.current)
		}

		return () => {
			observerRef.current?.disconnect()
		}
	}, [offset, fetchPage, hasMore, isFetchingNextPage])

	if (isError)
		return (
			<p className='text-center py-10 text-red-600'>
				Помилка при завантаженні івентів
			</p>
		)

	return (
		<div className='p-6'>
			{/* Верхня панель з кнопками */}
			<div className='flex items-center justify-between mb-6 mt-32 px-4'>
				<CreateEventModal
					onCreated={() => {
						// скидаємо й перезавантажуємо
						setItems([])
						setOffset(0)
						setTotal(0)
						setHasMore(true)
						setIsFetchingNextPage(false)
						fetchPage(0)
					}}
				/>

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

				{/* --- Пошук --- */}
				<div className='flex items-center space-x-2'>
					<select
						value={searchField}
						onChange={e =>
							setSearchField(e.target.value as 'title' | 'location' | 'creator')
						}
						className='border-gray-300 rounded-md p-2'
					>
						<option value='title'>Шукати по назві</option>
						<option value='location'>Шукати по локації</option>
						<option value='creator'>Шукати по ніку організатора</option>
					</select>
					<input
						type='text'
						value={searchText}
						onChange={e => setSearchText(e.target.value)}
						placeholder='Введіть текст…'
						className='border-gray-300 rounded-md p-2'
					/>

					{/* <button
						onClick={() => refetch()}
						className='px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700'
					>
						Знайти
					</button> */}
				</div>

				{/* --- Сортування --- */}
				<div className='flex items-center space-x-2'>
					<label className='text-sm font-medium'>Сортувати за:</label>
					<select
						value={sortBy}
						onChange={e =>
							setSortBy(e.target.value as 'eventDate' | 'title' | 'location')
						}
						className='border-gray-300 rounded-md p-2'
					>
						<option value='eventDate'>Дата</option>
						<option value='title'>Назва</option>
						<option value='location'>Локація</option>
					</select>

					<select
						value={sortOrder}
						onChange={e => setSortOrder(e.target.value as 'asc' | 'desc')}
						className='border-gray-300 rounded-md p-2'
					>
						<option value='asc'>Зростанням</option>
						<option value='desc'>Спаданням</option>
					</select>
				</div>
			</div>

			{/* Сітка івент-карток */}

			<div className='max-w-7xl mx-auto py-8 px-4 grid gap-6 grid-cols-[repeat(auto-fit,_minmax(250px,_1fr))]'>
				{items.map(evt => (
					<EventCard
						key={evt.id}
						event={evt}
						onRefetch={() => {
							// за необхідності можна зробити перезавантаження
							setItems([])
							setOffset(0)
							setTotal(0)
							setHasMore(true)
							setIsFetchingNextPage(false)
							fetchPage(0)
						}}
						currentUserId={currentUserId}
						onJoin={id => {
							joinEvent(id).then(() => {
								// опціонально можна оновити стан
							})
						}}
						onLeave={id => {
							leaveEvent(id).then(() => {
								// опціонально можна оновити стан
							})
						}}
					/>
				))}
			</div>

			{/* Якщо ми тільки почали і items ще порожній, але дані fetch’яться, показуємо спінер */}
			{isFetchingFirstPage && items.length === 0 && (
				<div className='flex justify-center py-4'>
					<div className='animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full'></div>
				</div>
			)}

			{/* Якщо ми підвантажуємо ще одну “порцію” (offset → next page) і є, що підвантажувати (hasMore) */}
			{isFetchingNextPage && hasMore && (
				<div className='flex justify-center py-4'>
					<div className='animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full'></div>
				</div>
			)}

			{/* Якщо більше нічого не підвантажувати, і items порожній (тобто взагалі результатів не було) */}
			{!isFetchingFirstPage && items.length === 0 && (
				<div className='max-w-2xl mx-auto py-16 text-center'>
					<p className='text-lg font-medium text-gray-700 mb-2'>
						Жодних подій не знайдено
					</p>
					<p className='text-sm text-gray-500'>
						Спробуйте змінити фільтри або пошук
					</p>
				</div>
			)}

			{/* Маркер для IntersectionObserver: тільки якщо далі є що підвантажити */}
			{hasMore && <div ref={bottomRef} className='h-1 w-full'></div>}

			{/* Модалка фільтрів (вона читає/записує filters через Redux) */}
			<FilterModal />
		</div>
	)
}

export default EventList
