import {
	Dialog,
	DialogTitle,
	Tab,
	TabGroup,
	TabList,
	TabPanels,
	Transition,
	TransitionChild,
} from '@headlessui/react'
import { Fragment } from 'react'
import { useActions } from '../../hooks/useActions'
import { selectFilters } from '../../store/filtersSlice'
import { useAppSelector } from '../../store/store'
const categories = [
	{ key: 'style', label: 'Style' },
	{ key: 'productType', label: 'Product Type' },
	{ key: 'size', label: 'Size' },
	{ key: 'colour', label: 'Colour' },
	{ key: 'range', label: 'Range' },
	{ key: 'brand', label: 'Brand' },
]

function FilterModal() {
	const { closeFiltersModal, setFilter, clearFilters } = useActions()

	const isOpen = useAppSelector(state => state.filters.modalOpen)
	const values = useAppSelector(selectFilters)

	const closeModal = () => closeFiltersModal()

	return (
		<Transition appear show={isOpen} as={Fragment}>
			<Dialog
				as='div'
				className='fixed inset-0 z-50 overflow-y-auto'
				onClose={closeModal}
			>
				<div className='min-h-screen px-4 text-center'>
					<TransitionChild
						as={Fragment}
						enter='ease-out duration-300'
						enterFrom='opacity-0'
						enterTo='opacity-100'
						leave='ease-in duration-200'
						leaveFrom='opacity-100'
						leaveTo='opacity-0'
					>
						<TransitionChild as={Fragment} enter='...' leave='...'>
							<div className='fixed inset-0 bg-black bg-opacity-40' />
						</TransitionChild>
					</TransitionChild>

					<span
						className='inline-block h-screen align-middle'
						aria-hidden='true'
					>
						&#8203;
					</span>
					<TransitionChild
						as={Fragment}
						enter='ease-out duration-300'
						enterFrom='opacity-0 scale-95'
						enterTo='opacity-100 scale-100'
						leave='ease-in duration-200'
						leaveFrom='opacity-100 scale-100'
						leaveTo='opacity-0 scale-95'
					>
						<div className='inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl'>
							<DialogTitle
								as='h3'
								className='text-lg font-medium leading-6 text-gray-900 mb-4'
							>
								Filters
							</DialogTitle>
							<TabGroup>
								<TabList className='flex space-x-4 border-b mb-4'>
									{categories.map(cat => (
										<Tab
											key={cat.key}
											className={({ selected }) =>
												`px-3 py-1.5 font-medium text-sm rounded ${
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
									{categories.map(cat => (
										<Tab.Panel key={cat.key} className='space-y-3'>
											{/* Render filter controls based on category */}
											{values[cat.key] && Array.isArray(values[cat.key]) ? (
												<div className='grid grid-cols-2 gap-2'>
													{['Option 1', 'Option 2', 'Option 3'].map(option => (
														<label
															key={option}
															className='flex items-center space-x-2'
														>
															<input
																type='checkbox'
																checked={values[cat.key].includes(option)}
																onChange={() =>
																	setFilter({
																		category: cat.key,
																		value: option,
																	})
																}
																className='h-4 w-4'
															/>
															<span className='text-sm text-gray-700'>
																{option}
															</span>
														</label>
													))}
												</div>
											) : cat.key === 'range' ? (
												<div className='flex space-x-4'>
													<input
														type='number'
														placeholder='Min'
														value={values.range.min || ''}
														onChange={e =>
															setFilter({
																category: 'range',
																value: {
																	min: +e.target.value,
																	max: values.range.max,
																},
															})
														}
														className='w-1/2 p-2 border rounded'
													/>
													<input
														type='number'
														placeholder='Max'
														value={values.range.max || ''}
														onChange={e =>
															setFilter({
																category: 'range',
																value: {
																	min: values.range.min,
																	max: +e.target.value,
																},
															})
														}
														className='w-1/2 p-2 border rounded'
													/>
												</div>
											) : (
												<p className='text-gray-500'>No options</p>
											)}
										</Tab.Panel>
									))}
								</TabPanels>
							</TabGroup>

							<div className='mt-6 flex justify-between'>
								<button
									type='button'
									className='text-sm text-red-500 hover:underline'
									onClick={() => clearFilters()}
								>
									Clear all
								</button>
								<div className='space-x-2'>
									<button
										type='button'
										className='px-4 py-2 bg-gray-200 rounded hover:bg-gray-300'
										onClick={closeModal}
									>
										Cancel
									</button>
									<button
										type='button'
										className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
										onClick={closeModal}
									>
										Apply
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
export default FilterModal
