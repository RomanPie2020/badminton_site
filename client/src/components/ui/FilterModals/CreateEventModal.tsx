import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import {
	EVENT_OPTIONS,
	GAME_TYPE_OPTIONS,
	LEVEL_OPTIONS,
} from '../../../configs/eventValues'
import { useCreateEventMutation } from '../../../services/EventService'
import { TEventInput } from '../../../shared/validations/event.schema'

interface ICreateEventModalProps {
	onCreated: () => void
}

const CreateEventModal = ({ onCreated }: ICreateEventModalProps) => {
	const [isOpen, setIsOpen] = useState(false)
	const [createEvent, { isLoading }] = useCreateEventMutation()

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<TEventInput>()

	const onSubmit: SubmitHandler<TEventInput> = async data => {
		try {
			await createEvent(data).unwrap()
			reset()
			setIsOpen(false)
			onCreated()
		} catch (e) {
			console.error(e)
		}
	}

	return (
		<>
			<button
				onClick={() => setIsOpen(true)}
				className='px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition'
			>
				Створити подію
			</button>

			{isOpen && (
				<div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
					<div className='bg-white rounded-xl shadow-xl w-full max-w-lg p-6 relative'>
						<button
							onClick={() => setIsOpen(false)}
							className='absolute top-4 right-4 text-gray-500 hover:text-gray-700'
						>
							✕
						</button>

						<h2 className='text-2xl font-semibold mb-4'>Нова подія</h2>
						<form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
							<div>
								<label className='block text-sm font-medium text-gray-700'>
									Заголовок *
								</label>
								<input
									{...register('title', {
										required: 'Обовʼязково вкажіть заголовок',
									})}
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
									{...register('location', { required: 'Вкажіть локацію' })}
									className='mt-1 block w-full border-gray-300 rounded-md p-2'
								/>
								{errors.location && (
									<p className='text-red-600 text-sm'>
										{errors.location.message}
									</p>
								)}
							</div>

							<div>
								<label className='block text-sm font-medium text-gray-700'>
									Дата та час *
								</label>
								<input
									type='datetime-local'
									{...register('eventDate', {
										required: 'Вкажіть дату і час',
									})}
									className='mt-1 block w-full border-gray-300 rounded-md p-2'
								/>
								{errors.eventDate && (
									<p className='text-red-600 text-sm'>
										{errors.eventDate.message}
									</p>
								)}
							</div>

							<div>
								<label className='block text-sm font-medium text-gray-700'>
									Тип події *
								</label>
								<select
									{...register('eventType', {
										required: 'Виберіть тип події',
									})}
									defaultValue=''
									className='mt-1 block w-full border-gray-300 rounded-md p-2'
								>
									<option value='' disabled>
										--Оберіть тип--
									</option>
									{EVENT_OPTIONS.map(opt => (
										<option key={opt} value={opt}>
											{opt}
										</option>
									))}
								</select>
								{errors.eventType && (
									<p className='text-red-600 text-sm'>
										{errors.eventType.message}
									</p>
								)}
							</div>

							<div>
								<label className='block text-sm font-medium text-gray-700'>
									Формат гри *
								</label>
								<select
									{...register('gameType', {
										required: 'Виберіть формат гри',
									})}
									defaultValue=''
									className='mt-1 block w-full border-gray-300 rounded-md p-2'
								>
									<option value='' disabled>
										--Оберіть формат--
									</option>
									{GAME_TYPE_OPTIONS.map(opt => (
										<option key={opt} value={opt}>
											{opt}
										</option>
									))}
								</select>
								{errors.gameType && (
									<p className='text-red-600 text-sm'>
										{errors.gameType.message}
									</p>
								)}
							</div>

							<div>
								<label className='block text-sm font-medium text-gray-700'>
									Рівень гравців *
								</label>
								<select
									{...register('levelOfPlayers', {
										required: 'Виберіть рівень гравців',
									})}
									defaultValue=''
									className='mt-1 block w-full border-gray-300 rounded-md p-2'
								>
									<option value='' disabled>
										--Оберіть рівень--
									</option>
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
									{...register('maxParticipants', {
										valueAsNumber: true,
										// min: { value: 1, message: 'Має бути принаймні 1' }
										required: 'Вкажіть число учасників',
									})}
									className='my-1 block w-full border-gray-300 rounded-md p-2'
								/>
								{errors.maxParticipants && (
									<p className='text-red-600 text-sm'>
										{errors.maxParticipants.message}
									</p>
								)}
							</div>

							<div className='flex justify-end space-x-2'>
								<button
									type='button'
									onClick={() => setIsOpen(false)}
									className='px-4 py-2 bg-gray-200 rounded hover:bg-gray-300'
								>
									Скасувати
								</button>
								<button
									type='submit'
									disabled={isLoading}
									className='px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50'
								>
									{isLoading ? 'Зберігаємо...' : 'Створити'}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</>
	)
}

export default CreateEventModal
