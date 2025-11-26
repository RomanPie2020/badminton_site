import { UseFormReturn } from 'react-hook-form'
import { formStyles } from '../../../configs/styles.config'
import Field from '../profile/ProfileField'
import Select from '../profile/ProfileSelect'
import TextArea from '../profile/ProfileTextArea'

// TODO take out this
const LABEL_CLASS = 'block text-lg font-medium text-black-800 mb-1'

interface ProfileFormProps {
	profile: any
	isEditing?: boolean
	isUpdating?: boolean
	showActions?: boolean
	whiteBackground?: boolean
	successMessage?: string
	errorMessage?: string
	register?: UseFormReturn['register']
	handleSubmit?: UseFormReturn['handleSubmit']
	onSubmit?: (data: any) => void
	handleEditClick?: () => void
	handleCancelClick?: () => void
}

const ProfileForm = ({
	profile,
	isEditing = false,
	isUpdating = false,
	showActions = true,
	whiteBackground = false,
	successMessage,
	errorMessage,
	register,
	handleSubmit,
	onSubmit,
	handleEditClick,
	handleCancelClick,
}: ProfileFormProps) => {
	const containerClass = whiteBackground
		? 'bg-white'
		: 'bg-white/80 backdrop-blur-md'

	return (
		<div
			className={`max-w-2xl mx-auto ${containerClass} shadow-xl rounded-2xl p-8 my-12 ${formStyles}`}
		>
			<h2 className='text-4xl font-semibold mb-4'>Профіль</h2>
			<form
				onSubmit={
					handleSubmit ? handleSubmit(onSubmit || (() => {})) : undefined
				}
				className='space-y-5'
			>
				<h3 className='text-xl font-semibold text-gray-800 mb-4'>
					Особисті дані
				</h3>
				<div className='grid grid-cols-1 gap-4'>
					<div>
						{profile?.avatarUrl ? (
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
					<Field
						label='Нікнейм'
						name='nickname'
						type='text'
						required
						value={profile?.nickname}
						isEditing={isEditing}
						register={register}
						LABEL_CLASS={LABEL_CLASS}
					/>

					<Field
						label='Місто'
						name='city'
						type='text'
						value={profile?.city}
						isEditing={isEditing}
						register={register}
						LABEL_CLASS={LABEL_CLASS}
					/>

					<Field
						label='Вік'
						name='age'
						type='number'
						value={profile?.age}
						isEditing={isEditing}
						register={register}
						LABEL_CLASS={LABEL_CLASS}
					/>

					<Select
						label='Стать'
						name='gender'
						value={profile?.gender}
						isEditing={isEditing}
						register={register}
						LABEL_CLASS={LABEL_CLASS}
						options={[
							{ value: '', label: 'Не вказано' },
							{ value: 'male', label: 'Чоловіча' },
							{ value: 'female', label: 'Жіноча' },
							{ value: 'other', label: 'Інше' },
						]}
					/>

					<Field
						label='Рівень гри'
						name='level'
						type='text'
						value={profile?.level}
						isEditing={isEditing}
						register={register}
						LABEL_CLASS={LABEL_CLASS}
					/>

					<Field
						label='Досвід (місяців)'
						name='experienceMonths'
						type='number'
						value={profile?.experienceMonths}
						isEditing={isEditing}
						register={register}
						LABEL_CLASS={LABEL_CLASS}
					/>

					<Select
						label='Основна рука'
						name='dominantHand'
						value={profile?.dominantHand}
						isEditing={isEditing}
						register={register}
						LABEL_CLASS={LABEL_CLASS}
						options={[
							{ value: '', label: 'Не вказано' },
							{ value: 'left', label: 'Ліва' },
							{ value: 'right', label: 'Права' },
						]}
					/>

					<Select
						label='Формат гри'
						name='preferredFormat'
						value={profile?.preferredFormat}
						isEditing={isEditing}
						register={register}
						LABEL_CLASS={LABEL_CLASS}
						options={[
							{ value: '', label: 'Не вказано' },
							{ value: 'singles', label: 'Одиночка' },
							{ value: 'doubles', label: 'Пара' },
							{ value: 'mixed', label: 'Мікст' },
						]}
					/>

					<Field
						label='Інтенсивність гри'
						name='playFrequency'
						type='text'
						value={profile?.playFrequency}
						isEditing={isEditing}
						register={register}
						LABEL_CLASS={LABEL_CLASS}
					/>

					<Field
						label='Місця гри (через кому)'
						name='commonPlaces'
						type='text'
						value={profile?.commonPlaces?.join(', ')}
						isEditing={isEditing}
						register={register}
						LABEL_CLASS={LABEL_CLASS}
					/>

					<Field
						label='Час гри'
						name='playTime'
						type='text'
						value={profile?.playTime}
						isEditing={isEditing}
						register={register}
						LABEL_CLASS={LABEL_CLASS}
					/>

					<TextArea
						label='Про себе'
						name='bio'
						value={profile?.bio}
						isEditing={isEditing}
						register={register}
						LABEL_CLASS={LABEL_CLASS}
					/>

					<Field
						label='Контакт'
						name='contact'
						type='text'
						value={profile?.contact}
						isEditing={isEditing}
						register={register}
						LABEL_CLASS={LABEL_CLASS}
					/>
				</div>

				{successMessage && <p className='text-green-600'>{successMessage}</p>}
				{errorMessage && <p className='text-red-600'>{errorMessage}</p>}

				{showActions && (
					<div className='flex justify-end space-x-3 pt-4'>
						{isEditing ? (
							<div className='flex space-x-3 sm:flex-col sm:space-x-0 sm:space-y-2'>
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
							</div>
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
				)}
			</form>
		</div>
	)
}
export default ProfileForm
