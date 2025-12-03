import { memo } from 'react'
import { useActions } from '../../../hooks/useActions'
import {
	TSearchField,
	TSortBy,
	TSortOrder,
} from '../../../shared/interfaces/models'

interface EventControlsProps {
	searchText: string
	setSearchText: (val: string) => void
	searchField: TSearchField
	setSearchField: (val: string) => void
	sortBy: TSortBy
	setSortBy: (val: string) => void
	sortOrder: TSortOrder
	setSortOrder: (val: string) => void
	onCreateClick: () => void
}

const EventControls = memo(
	({
		searchText,
		setSearchText,
		searchField,
		setSearchField,
		sortBy,
		setSortBy,
		sortOrder,
		setSortOrder,
		onCreateClick,
	}: EventControlsProps) => {
		const { openFiltersModal } = useActions()

		return (
			<div className='flex items-center justify-between mb-6 mt-32 px-4 flex-wrap gap-4 sm:!flex-col sm:!items-stretch sm:!gap-3'>
				<button
					onClick={onCreateClick}
					className='flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md text-white transition sm:!w-full sm:!justify-center'
				>
					Створити подію
				</button>

				<button
					onClick={() => openFiltersModal()}
					className='flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm font-medium sm:!w-full sm:!justify-center'
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

				{/* Search Inputs */}
				<div className='flex items-center space-x-2 flex-wrap sm:!flex-col sm:!items-stretch sm:!space-x-0 sm:!gap-2 sm:!w-full'>
					<select
						value={searchField}
						onChange={e => setSearchField(e.target.value)}
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

				{/* Sort Inputs */}
				<div className='flex items-center space-x-2 flex-wrap sm:!flex-col sm:!items-stretch sm:!space-x-0 sm:!gap-2 sm:!w-full'>
					<label className='text-sm font-medium whitespace-nowrap sm:!w-full sm:!text-center'>
						Сортувати:
					</label>
					<select
						value={sortBy}
						onChange={e => setSortBy(e.target.value as any)}
						className='border border-gray-300 rounded-md p-2 text-sm sm:!w-full'
					>
						<option value='eventDate'>По даті</option>
						<option value='title'>По назві</option>
						<option value='location'>По локації</option>
					</select>

					<select
						value={sortOrder}
						onChange={e => setSortOrder(e.target.value as any)}
						className='border border-gray-300 rounded-md p-2 text-sm sm:!w-full'
					>
						<option value='asc'>↑ Зростанням</option>
						<option value='desc'>↓ Спаданням</option>
					</select>
				</div>
			</div>
		)
	}
)

export default EventControls
