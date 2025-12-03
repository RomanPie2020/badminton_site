import {
	Dialog,
	DialogTitle,
	Tab,
	TabGroup,
	TabList,
	TabPanel,
	TabPanels,
	Transition,
	TransitionChild,
} from '@headlessui/react'
import { Fragment } from 'react'
import { FILTER_CATEGORIES } from '../../../configs/filterOptions'
import { useActions } from '../../../hooks/useActions'
import { selectFilters } from '../../../store/filtersSlice'
import { useAppSelector } from '../../../store/store'
import { DateFilter } from './DateFilter'
import { EventsFilter } from './EventsFilter'
import { GameTypeFilter } from './GameTypeFilter'
import { LevelFilter } from './LevelFilter'

export default function FilterModal() {
	const { closeFiltersModal, setFilter, clearFilters } = useActions()
	const isOpen = useAppSelector(state => state.filters.modalOpen)
	const values = useAppSelector(selectFilters)

	const closeModal = () => {
		closeFiltersModal()
	}

	const renderTabContent = (categoryKey: string) => {
		switch (categoryKey) {
			case 'events':
				return (
					<EventsFilter values={values.events} onFilterChange={setFilter} />
				)
			case 'date':
				// onFilterChange type fix
				return <DateFilter values={values.date} onFilterChange={setFilter} />
			case 'typeOfGame':
				return (
					<GameTypeFilter
						values={values.typeOfGame}
						onFilterChange={setFilter}
					/>
				)
			case 'levelOfPlayers':
				return (
					<LevelFilter
						values={values.levelOfPlayers}
						onFilterChange={setFilter}
					/>
				)
			default:
				return null
		}
	}

	return (
		<Transition appear show={isOpen} as={Fragment}>
			<Dialog
				as='div'
				className='fixed inset-0 z-50 overflow-y-auto'
				onClose={closeModal}
			>
				<div className='min-h-screen px-4 flex items-center justify-center'>
					<TransitionChild
						as='div'
						enter='ease-out duration-300'
						enterFrom='opacity-0'
						enterTo='opacity-100'
						leave='ease-in duration-200'
						leaveFrom='opacity-100'
						leaveTo='opacity-0'
					>
						<div className='fixed inset-0 bg-black bg-opacity-40' />
					</TransitionChild>

					<TransitionChild
						as='div'
						enter='ease-out duration-300'
						enterFrom='opacity-0 scale-95'
						enterTo='opacity-100 scale-100'
						leave='ease-in duration-200'
						leaveFrom='opacity-100 scale-100'
						leaveTo='opacity-0 scale-95'
					>
						<div className='inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transform bg-white shadow-xl rounded-2xl'>
							<DialogTitle
								as='h3'
								className='text-lg font-medium leading-6 text-gray-900 mb-4'
							>
								Фільтри
							</DialogTitle>

							<TabGroup>
								<TabList className='flex space-x-4 border-b mb-4'>
									{FILTER_CATEGORIES.map(cat => (
										<Tab
											key={cat.key}
											className={({ selected }) =>
												`px-3 py-1.5 text-sm font-medium rounded ${
													selected
														? 'bg-blue-100 text-blue-700'
														: 'text-gray-600'
												}`
											}
										>
											{cat.label}
										</Tab>
									))}
								</TabList>

								<TabPanels>
									{FILTER_CATEGORIES.map(cat => (
										<TabPanel key={cat.key} className='space-y-6'>
											{renderTabContent(cat.key)}
										</TabPanel>
									))}
								</TabPanels>
							</TabGroup>

							<div className='mt-6 flex justify-between'>
								<button
									type='button'
									className='text-sm text-red-500 hover:underline'
									onClick={() => clearFilters()}
								>
									Очистити всі
								</button>
								<div className='space-x-2'>
									<button
										type='button'
										className='px-4 py-2 bg-red-700 text-white rounded hover:bg-red-600'
										onClick={closeModal}
									>
										Закрити
									</button>
								</div>
							</div>
						</div>
					</TransitionChild>
				</div>
			</Dialog>
		</Transition>
	)
}
