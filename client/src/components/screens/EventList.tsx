import spinner from '../../assets/spinner.svg'
import { useActions } from '../../hooks/useActions'
import {
	useGetFilteredEventsQuery,
	useJoinEventMutation,
	useLeaveEventMutation,
} from '../../services/EventService'
import { selectFilters } from '../../store/filtersSlice'
import { useAppSelector } from '../../store/store'
import CreateEventModal from '../ui/CreateEventModal'
import EventCard from '../ui/EventCard'
import FilterModal from '../ui/FilterModal'

const EventList = () => {
	// 1. Беремо об’єкт filters з Redux (filtersSlice.values)
	const filters = useAppSelector(selectFilters)

	// 2. Викликаємо GET /events?… (якщо filters пустий → просто /events)
	const {
		data: events,
		isLoading,
		isError,
		isFetching,
		refetch,
	} = useGetFilteredEventsQuery({ filters })

	const [joinEvent] = useJoinEventMutation()
	const [leaveEvent] = useLeaveEventMutation()
	const currentUserId = Number(localStorage.getItem('user_id'))

	const { openFiltersModal } = useActions()

	// 3. При першому рендері, коли filters ще порожній (наприклад, { events: [], date: null, … }),
	//    RTK Query побудує URL = "/events" і поверне всі івенти.
	//    Коли пізніше користувач встановить хоч один фільтр, filters зміниться,
	//    hook useGetFilteredEventsQuery побачить новий аргумент і зробить запит з query-параметрами.

	if (isLoading)
		return <p className='text-center py-10'>Завантаження івентів…</p>
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
				<CreateEventModal onCreated={refetch} />

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
			</div>
			{/* Якщо зараз відбувається фетчинг нових фільтрованих даних, показуємо невеличкий спінер */}
			{isFetching && (
				<div className='flex justify-center py-4'>
					<img src={spinner} alt='Loading…' className='h-8 w-8' />
				</div>
			)}
			{/* Сітка івент-карток */}
			{events && events.length > 0 ? (
				<div className='max-w-7xl mx-auto py-8 px-4 grid gap-6 grid-cols-[repeat(auto-fit,_minmax(250px,_1fr))]'>
					{events.map(evt => (
						<EventCard
							key={evt.id}
							event={evt}
							onRefetch={refetch}
							currentUserId={currentUserId}
							onJoin={id => joinEvent(id)}
							onLeave={id => leaveEvent(id)}
						/>
					))}
				</div>
			) : (
				<div className='max-w-2xl mx-auto py-16 text-center'>
					<p className='text-lg font-medium text-gray-700 mb-2'>
						Жодних подій не знайдено
					</p>
					<p className='text-sm text-gray-500'>
						Спробуйте скинути фільтри, щоб знову побачити всі події
					</p>
				</div>
			)}

			{/* Модалка фільтрів (вона читає/записує filters через Redux) */}
			<FilterModal />
		</div>
	)
}

export default EventList
