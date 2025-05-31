// src/components/ui/FilterModal.tsx
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
import { useActions } from '../../hooks/useActions'
import { selectFilters } from '../../store/filtersSlice'
import { useAppSelector } from '../../store/store'

const categories = [
	{ key: 'events', label: 'Події' },
	{ key: 'date', label: 'Дата і час' },
	{ key: 'typeOfGame', label: 'Тип гри' },
	{ key: 'levelOfPlayers', label: 'Рівень гравців' },
]

export default function FilterModal() {
	const { closeFiltersModal, setFilter, clearFilters } = useActions()

	const isOpen = useAppSelector(state => state.filters.modalOpen)
	const values = useAppSelector(selectFilters)

	const closeModal = () => {
		closeFiltersModal()
	}

	// Дані для чекбоксів у кожній категорії:
	const EVENT_OPTIONS = [
		'Турнір',
		'Тренування',
		'Дружня гра',
		'Приватна гра',
		'Клубний захід',
	]
	const GAME_TYPE_OPTIONS = ['Одиночна', 'Парна', 'Змішана парна', 'Командна']
	const LEVEL_OPTIONS = ['Новачок', 'Середній', 'Просунутий', 'Профі']

	return (
		<Transition appear show={isOpen} as={Fragment}>
			<Dialog
				as='div'
				className='fixed inset-0 z-50 overflow-y-auto'
				onClose={closeModal}
			>
				<div className='min-h-screen px-4 flex items-center justify-center'>
					{/* затемнювач позаду модалки */}
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

					{/* Основна панель модалки */}
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
									{categories.map(cat => (
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
									{categories.map(cat => (
										<TabPanel key={cat.key} className='space-y-6'>
											{/* #### 1) Категорія "Події" #### */}
											{cat.key === 'events' && (
												<div className='grid grid-cols-2 gap-3'>
													{EVENT_OPTIONS.map(opt => (
														<label
															key={opt}
															className='flex items-center space-x-2'
														>
															<input
																type='checkbox'
																checked={values.events.includes(opt)}
																onChange={() =>
																	setFilter({ category: 'events', value: opt })
																}
																className='h-4 w-4'
															/>
															<span className='text-sm text-gray-700'>
																{opt}
															</span>
														</label>
													))}
												</div>
											)}

											{/* #### 2) Категорія "Дата і час" #### */}
											{cat.key === 'date' && (
												<div className='space-y-4'>
													{/* Пресети */}
													<div className='flex space-x-2'>
														<button
															type='button'
															className={`px-3 py-1 rounded ${
																values.date.from ===
																	new Date().toISOString().slice(0, 10) &&
																values.date.to ===
																	new Date().toISOString().slice(0, 10)
																	? 'bg-blue-100 text-blue-700'
																	: 'bg-gray-100 text-gray-700'
															}`}
															onClick={() => {
																const today = new Date()
																	.toISOString()
																	.slice(0, 10)
																setFilter({
																	category: 'date',
																	value: { from: today, to: today },
																})
															}}
														>
															Сьогодні
														</button>
														<button
															type='button'
															className={`px-3 py-1 rounded ${
																values.date.from ===
																	new Date(
																		new Date().setDate(new Date().getDate() + 1)
																	)
																		.toISOString()
																		.slice(0, 10) &&
																values.date.to ===
																	new Date(
																		new Date().setDate(new Date().getDate() + 1)
																	)
																		.toISOString()
																		.slice(0, 10)
																	? 'bg-blue-100 text-blue-700'
																	: 'bg-gray-100 text-gray-700'
															}`}
															onClick={() => {
																const tomorrow = new Date(
																	new Date().setDate(new Date().getDate() + 1)
																)
																	.toISOString()
																	.slice(0, 10)
																setFilter({
																	category: 'date',
																	value: { from: tomorrow, to: tomorrow },
																})
															}}
														>
															Завтра
														</button>
														<button
															type='button'
															className={`px-3 py-1 rounded ${
																// перевірка: якщо обидві дати лежать у межах поточного тижня
																(() => {
																	const now = new Date()
																	const day = now.getDay() || 7 // 1 (пон) … 7 (нд)
																	const monday = new Date(now)
																	monday.setDate(now.getDate() - (day - 1))
																	const sunday = new Date(monday)
																	sunday.setDate(monday.getDate() + 6)
																	const from = monday.toISOString().slice(0, 10)
																	const to = sunday.toISOString().slice(0, 10)
																	return (
																		values.date.from === from &&
																		values.date.to === to
																	)
																})()
																	? 'bg-blue-100 text-blue-700'
																	: 'bg-gray-100 text-gray-700'
															}`}
															onClick={() => {
																const now = new Date()
																const day = now.getDay() || 7
																const monday = new Date(now)
																monday.setDate(now.getDate() - (day - 1))
																const sunday = new Date(monday)
																sunday.setDate(monday.getDate() + 6)
																setFilter({
																	category: 'date',
																	value: {
																		from: monday.toISOString().slice(0, 10),
																		to: sunday.toISOString().slice(0, 10),
																	},
																})
															}}
														>
															Цього тижня
														</button>
														<button
															type='button'
															className={`px-3 py-1 rounded ${
																(() => {
																	const now = new Date()
																	const next7 = new Date(now)
																	next7.setDate(now.getDate() + 6)
																	const from = now.toISOString().slice(0, 10)
																	const to = next7.toISOString().slice(0, 10)
																	return (
																		values.date.from === from &&
																		values.date.to === to
																	)
																})()
																	? 'bg-blue-100 text-blue-700'
																	: 'bg-gray-100 text-gray-700'
															}`}
															onClick={() => {
																const now = new Date()
																const next7 = new Date(now)
																next7.setDate(now.getDate() + 6)
																setFilter({
																	category: 'date',
																	value: {
																		from: now.toISOString().slice(0, 10),
																		to: next7.toISOString().slice(0, 10),
																	},
																})
															}}
														>
															Наступні 7 днів
														</button>
														<button
															type='button'
															className={`px-3 py-1 rounded ${
																(() => {
																	const now = new Date()
																	const startOfNextMonth = new Date(
																		now.getFullYear(),
																		now.getMonth() + 1,
																		1
																	)
																	const endOfNextMonth = new Date(
																		now.getFullYear(),
																		now.getMonth() + 2,
																		0
																	)
																	const from = startOfNextMonth
																		.toISOString()
																		.slice(0, 10)
																	const to = endOfNextMonth
																		.toISOString()
																		.slice(0, 10)
																	return (
																		values.date.from === from &&
																		values.date.to === to
																	)
																})()
																	? 'bg-blue-100 text-blue-700'
																	: 'bg-gray-100 text-gray-700'
															}`}
															onClick={() => {
																const now = new Date()
																const startOfNextMonth = new Date(
																	now.getFullYear(),
																	now.getMonth() + 1,
																	1
																)
																const endOfNextMonth = new Date(
																	now.getFullYear(),
																	now.getMonth() + 2,
																	0
																)
																setFilter({
																	category: 'date',
																	value: {
																		from: startOfNextMonth
																			.toISOString()
																			.slice(0, 10),
																		to: endOfNextMonth
																			.toISOString()
																			.slice(0, 10),
																	},
																})
															}}
														>
															Наступний місяць
														</button>
													</div>

													{/* Діапазон дати: два інпути type="date" */}
													<div className='flex space-x-4 mt-2'>
														<div className='flex flex-col'>
															<label className='text-sm text-gray-600'>
																Від:
															</label>
															<input
																type='date'
																value={values.date.from || ''}
																onChange={e =>
																	setFilter({
																		category: 'date',
																		value: {
																			from: e.target.value,
																			to: values.date.to,
																		},
																	})
																}
																className='p-2 border rounded'
															/>
														</div>
														<div className='flex flex-col'>
															<label className='text-sm text-gray-600'>
																До:
															</label>
															<input
																type='date'
																value={values.date.to || ''}
																onChange={e =>
																	setFilter({
																		category: 'date',
																		value: {
																			from: values.date.from,
																			to: e.target.value,
																		},
																	})
																}
																className='p-2 border rounded'
															/>
														</div>
													</div>
												</div>
											)}

											{/* #### 3) Категорія "Тип гри" #### */}
											{cat.key === 'typeOfGame' && (
												<div className='grid grid-cols-2 gap-3'>
													{GAME_TYPE_OPTIONS.map(opt => (
														<label
															key={opt}
															className='flex items-center space-x-2'
														>
															<input
																type='checkbox'
																checked={values.typeOfGame.includes(opt)}
																onChange={() =>
																	setFilter({
																		category: 'typeOfGame',
																		value: opt,
																	})
																}
																className='h-4 w-4'
															/>
															<span className='text-sm text-gray-700'>
																{opt}
															</span>
														</label>
													))}
												</div>
											)}

											{/* #### 4) Категорія "Рівень гравців" #### */}
											{cat.key === 'levelOfPlayers' && (
												<div className='grid grid-cols-2 gap-3'>
													{LEVEL_OPTIONS.map(opt => (
														<label
															key={opt}
															className='flex items-center space-x-2'
														>
															<input
																type='checkbox'
																checked={values.levelOfPlayers.includes(opt)}
																onChange={() =>
																	setFilter({
																		category: 'levelOfPlayers',
																		value: opt,
																	})
																}
																className='h-4 w-4'
															/>
															<span className='text-sm text-gray-700'>
																{opt}
															</span>
														</label>
													))}
												</div>
											)}
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
