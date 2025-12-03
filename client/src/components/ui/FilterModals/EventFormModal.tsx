import { useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { EventInput } from '../../../shared/validations/event.schema'

interface EventFormModalProps {
	event?: EventInput
	// initialData?: EventInput
	currentParticipants?: number
	onClose: () => void
	onSubmit: (data: EventInput) => void
}

const EVENT_TYPE_OPTIONS = [
	'Турнір',
	'Тренування',
	'Дружня гра',
	'Приватна гра',
	'Клубний захід',
]
const GAME_TYPE_OPTIONS = ['Одиночна', 'Парна', 'Змішана парна', 'Командна']
const LEVEL_OPTIONS = ['Новачок', 'Середній', 'Просунутий', 'Профі']

const EventFormModal: React.FC<EventFormModalProps> = ({
	event,
	// initialData,
	currentParticipants = 0,
	onClose,
	onSubmit,
}) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<EventInput>()

	useEffect(() => {
		if (event) {
			reset({
				title: event.title,
				location: event.location,
				eventDate: event.eventDate.slice(0, 16),
				description: event.description || '',
				eventType: event.eventType,
				gameType: event.gameType,
				levelOfPlayers: event.levelOfPlayers,
				maxParticipants: event.maxParticipants ?? undefined,
			})
		} else {
			reset({})
		}
	}, [event, reset])

	const submit: SubmitHandler<EventInput> = data => {
		onSubmit(data)
	}

	return (
		<div className='fixed inset-0 bg-black/40 flex items-center justify-center z-50'>
			<div className='bg-white rounded-xl shadow-xl w-full max-w-lg h-full max-h-[90%] overflow-y-auto scrollbar-hide p-6 relative'>
				<button
					onClick={onClose}
					className='absolute top-4 right-4 text-gray-500 hover:text-gray-700'
				>
					✕
				</button>
				<h2 className='text-2xl font-semibold mb-4'>
					{event ? 'Редагувати подію' : 'Нова подія'}
				</h2>

				<form noValidate onSubmit={handleSubmit(submit)} className='space-y-4'>
					<div>
						<label className='block text-sm font-medium text-gray-700'>
							Заголовок *
						</label>
						<input
							{...register('title', { required: 'Обовʼязково' })}
							className='mt-1 block w-full border-gray-300 rounded-md p-2'
						/>
						{errors.title && (
							<p className='text-red-600 text-sm'>{errors.title.message}</p>
						)}
					</div>

					<div>
						<label className='block text-sm font-medium text-gray-700'>
							Локація *
						</label>
						<input
							{...register('location', { required: 'Обовʼязково' })}
							className='mt-1 block w-full border-gray-300 rounded-md p-2'
						/>
						{errors.location && (
							<p className='text-red-600 text-sm'>{errors.location.message}</p>
						)}
					</div>

					<div>
						<label className='block text-sm font-medium text-gray-700'>
							Дата та час *
						</label>
						<input
							type='datetime-local'
							{...register('eventDate', { required: 'Обовʼязково' })}
							className='mt-1 block w-full border-gray-300 rounded-md p-2'
						/>
						{/* TODO узгоджена локальна дата */}
						{errors.eventDate && (
							<p className='text-red-600 text-sm'>{errors.eventDate.message}</p>
						)}
					</div>

					<div>
						<label className='block text-sm font-medium text-gray-700'>
							Тип події *
						</label>
						<select
							{...register('eventType', { required: 'Обовʼязково' })}
							className='mt-1 block w-full border-gray-300 rounded-md p-2'
						>
							<option value=''>--- Виберіть тип події ---</option>
							{EVENT_TYPE_OPTIONS.map(opt => (
								<option key={opt} value={opt}>
									{opt}
								</option>
							))}
						</select>
						{errors.eventType && (
							<p className='text-red-600 text-sm'>{errors.eventType.message}</p>
						)}
					</div>

					<div>
						<label className='block text-sm font-medium text-gray-700'>
							Тип гри *
						</label>
						<select
							{...register('gameType', { required: 'Обовʼязково' })}
							className='mt-1 block w-full border-gray-300 rounded-md p-2'
						>
							<option value=''>--- Виберіть тип гри ---</option>
							{GAME_TYPE_OPTIONS.map(opt => (
								<option key={opt} value={opt}>
									{opt}
								</option>
							))}
						</select>
						{errors.gameType && (
							<p className='text-red-600 text-sm'>{errors.gameType.message}</p>
						)}
					</div>

					<div>
						<label className='block text-sm font-medium text-gray-700'>
							Рівень гравців *
						</label>
						<select
							{...register('levelOfPlayers', { required: 'Обовʼязково' })}
							className='mt-1 block w-full border-gray-300 rounded-md p-2'
						>
							<option value=''>--- Виберіть рівень ---</option>
							{LEVEL_OPTIONS.map(opt => (
								<option key={opt} value={opt}>
									{opt}
								</option>
							))}
						</select>
						{errors.levelOfPlayers && (
							<p className='text-red-600 text-sm'>
								{errors.levelOfPlayers.message}
							</p>
						)}
					</div>

					<div>
						<label className='block text-sm font-medium text-gray-700'>
							Опис
						</label>
						<textarea
							{...register('description')}
							rows={3}
							className='mt-1 block w-full border-gray-300 rounded-md p-2'
						/>
					</div>

					<div>
						<label className='block text-sm font-medium text-gray-700'>
							Макс. учасників
						</label>
						<input
							type='number'
							min={currentParticipants || 1}
							{...register('maxParticipants', {
								valueAsNumber: true,
								min: {
									value: currentParticipants || 1,
									message: `Не менше ${currentParticipants} (вже приєдналися)`,
								},
							})}
							className='mt-1 block w-full border-gray-300 rounded-md p-2'
						/>
						{errors.maxParticipants && (
							<p className='text-red-600 text-sm'>
								{errors.maxParticipants.message}
							</p>
						)}
					</div>

					<div className='flex justify-end gap-2'>
						<button
							type='button'
							onClick={onClose}
							className='px-4 py-2 bg-gray-200 rounded hover:bg-gray-300'
						>
							Скасувати
						</button>
						<button
							type='submit'
							className='px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700'
						>
							Зберегти
						</button>
					</div>
				</form>
			</div>
		</div>
	)
}

export default EventFormModal
