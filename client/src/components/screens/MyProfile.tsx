import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { formStyles } from '../../configs/styles.config'
import {
	useGetProfileQuery,
	useUpdateProfileMutation,
} from '../../services/AuthService'

interface ProfileFormData {
	nickname?: string
	avatarUrl?: string | undefined
	city?: string
	age?: number
	gender?: string
	level?: string
	experienceMonths?: number
	dominantHand?: string
	preferredFormat?: string
	playFrequency?: string
	commonPlaces?: string[]
	playTime?: string
	bio?: string
	contact?: string
}

const LABEL_CLASS = 'block text-lg font-medium text-black-800 mb-1'

const ProfileForm = () => {
	const { data: profile, isLoading, isError, error } = useGetProfileQuery()
	const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation()

	const [isEditing, setIsEditing] = useState(false)
	const [successMessage, setSuccessMessage] = useState('')
	const [errorMessage, setErrorMessage] = useState('')

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<ProfileFormData>()

	useEffect(() => {
		if (profile) {
			reset(profile)
		}
	}, [profile, reset])

	const onSubmit = async (data: ProfileFormData) => {
		try {
			setSuccessMessage('')
			setErrorMessage('')
			const cleaned = Object.fromEntries(
				Object.entries(data).filter(([, v]) => v !== undefined && v !== null)
			)
			await updateProfile(cleaned).unwrap()
			setIsEditing(false)
			setSuccessMessage('Профіль успішно оновлено ✅')
		} catch (err: any) {
			const msg =
				err?.data?.message || err?.error || 'Не вдалося оновити профіль'
			setErrorMessage(msg)
		}
	}

	const handleEditClick = () => {
		setIsEditing(true)
		setSuccessMessage('')
		setErrorMessage('')
	}

	const handleCancelClick = () => {
		reset(profile)
		setIsEditing(false)
	}

	if (isLoading)
		return <p className='text-center py-10'>Завантаження профілю...</p>

	if (isError) {
		if (error && 'status' in error && error.status === 401) {
			window.location.href = '/login'
			return null
		}
		return (
			<div className='text-red-600 text-center py-10'>
				<p>Не вдалося завантажити профіль. Можливо, ваша сесія завершилась.</p>
				{error && 'status' in error && <p>Код помилки: {error.status}</p>}
			</div>
		)
	}

	return (
		<div
			className={`max-w-2xl mx-auto bg-white/80 backdrop-blur-md shadow-xl rounded-2xl p-8 my-12 ${formStyles}`}
		>
			<h2 className='text-4xl font-semibold mb-4'>Мій профіль</h2>
			<form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
				<h3 className='text-xl font-semibold text-gray-800 mb-4'>
					Особисті дані
				</h3>
				<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
					<div>
						{profile.avatarUrl ? (
							<img
								src={profile.avatarUrl}
								alt='Avatar'
								className='w-24 h-24 rounded-full mb-4 object-cover m-auto'
							/>
						) : (
							<div className='w-24 h-24 rounded-full bg-gray-200 mb-4 flex items-center justify-center text-gray-500 m-auto'>
								Немає
							</div>
						)}
					</div>
					<div>
						<label className={LABEL_CLASS}>Нікнейм</label>
						<input
							type='text'
							{...register('nickname', { required: true })}
							disabled={!isEditing}
							className='mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200 disabled:bg-gray-100'
						/>
					</div>
					{/* <div>
						<label className={LABEL_CLASS}>Посилання на аватар</label>
						<input
							type='url'
							{...register('avatarUrl')}
							disabled={!isEditing}
							className='mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200 disabled:bg-gray-100'
						/>
					</div> */}
					<div>
						<label className={LABEL_CLASS}>Місто</label>
						<input
							type='text'
							{...register('city')}
							disabled={!isEditing}
							className='mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200 disabled:bg-gray-100'
						/>
					</div>
					<div>
						<label className={LABEL_CLASS}>Вік</label>
						<input
							type='number'
							{...register('age', { valueAsNumber: true })}
							disabled={!isEditing}
							className='mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200 disabled:bg-gray-100'
						/>
					</div>
					<div>
						<label className={LABEL_CLASS}>Стать</label>
						<select
							{...register('gender')}
							disabled={!isEditing}
							className='mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200 disabled:bg-gray-100'
						>
							<option value=''>Не вказано</option>
							<option value='male'>Чоловіча</option>
							<option value='female'>Жіноча</option>
							<option value='other'>Інше</option>
						</select>
					</div>
				</div>

				<h3 className='text-xl font-semibold text-gray-800 mb-4 pt-6'>
					Профіль бадмінтоніста
				</h3>
				<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
					<div>
						<label className={LABEL_CLASS}>Рівень гри</label>
						<input
							type='text'
							{...register('level')}
							disabled={!isEditing}
							className='mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200 disabled:bg-gray-100'
						/>
					</div>
					<div>
						<label className={LABEL_CLASS}>Досвід (місяців)</label>
						<input
							type='number'
							{...register('experienceMonths', {
								valueAsNumber: true,
								setValueAs: v => (v === '' ? undefined : Number(v)),
							})}
							disabled={!isEditing}
							className='mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200 disabled:bg-gray-100'
						/>
					</div>
					<div>
						<label className={LABEL_CLASS}>Основна рука</label>
						<select
							{...register('dominantHand')}
							disabled={!isEditing}
							className='mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200 disabled:bg-gray-100'
						>
							<option value=''>Не вказано</option>
							<option value='left'>Ліва</option>
							<option value='right'>Права</option>
						</select>
					</div>
					<div>
						<label className={LABEL_CLASS}>Формат гри</label>
						<select
							{...register('preferredFormat')}
							disabled={!isEditing}
							className='mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200 disabled:bg-gray-100'
						>
							<option value=''>Не вказано</option>
							<option value='singles'>Одиночка</option>
							<option value='doubles'>Пара</option>
							<option value='mixed'>Мікст</option>
						</select>
					</div>
				</div>

				<div>
					<label className={LABEL_CLASS}>Інтенсивність гри</label>
					<input
						type='text'
						{...register('playFrequency')}
						disabled={!isEditing}
						className='mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200 disabled:bg-gray-100'
					/>
				</div>

				<div>
					<label className={LABEL_CLASS}>Місця гри (через кому)</label>
					<input
						type='text'
						{...register('commonPlaces', {
							setValueAs: v =>
								typeof v === 'string'
									? v
											.split(',')
											.map(s => s.trim())
											.filter(Boolean)
									: v,
						})}
						disabled={!isEditing}
						className='mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200 disabled:bg-gray-100'
					/>
				</div>

				<div>
					<label className={LABEL_CLASS}>Час гри</label>
					<input
						type='text'
						{...register('playTime')}
						disabled={!isEditing}
						className='mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200 disabled:bg-gray-100'
					/>
				</div>

				<div>
					<label className={LABEL_CLASS}>Про себе</label>
					<textarea
						{...register('bio')}
						disabled={!isEditing}
						rows={4}
						className='mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200 disabled:bg-gray-100'
					/>
				</div>

				<div>
					<label className={LABEL_CLASS}>Контакт</label>
					<input
						type='text'
						{...register('contact')}
						disabled={!isEditing}
						className='mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200 disabled:bg-gray-100'
					/>
				</div>

				{successMessage && <p className='text-green-600'>{successMessage}</p>}
				{errorMessage && <p className='text-red-600'>{errorMessage}</p>}

				<div className='flex justify-end space-x-3 pt-4'>
					{isEditing ? (
						<>
							<button
								type='button'
								onClick={handleCancelClick}
								className='px-4 py-2 bg-gray-200 rounded-lg text-gray-700 hover:bg-gray-300'
							>
								Скасувати
							</button>
							<button
								type='submit'
								disabled={isUpdating}
								className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50'
							>
								{isUpdating ? 'Збереження...' : 'Зберегти'}
							</button>
						</>
					) : (
						<button
							type='button'
							onClick={handleEditClick}
							className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700'
						>
							Редагувати
						</button>
					)}
				</div>
			</form>
		</div>
	)
}
export default ProfileForm
