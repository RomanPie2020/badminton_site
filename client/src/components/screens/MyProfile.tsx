import { formStyles } from '../../configs/styles.config'
import { useMyProfileForm } from '../../hooks/useMyProfileForm'
import { BadmintonProfileFields } from '../ui/MyProfile/BadmintonProfileFields'
import { PersonalInfoFields } from '../ui/MyProfile/PersonalInfoField'

const LABEL_CLASS = 'block text-lg font-medium text-black-800 mb-1'

const ProfileForm = () => {
	const {
		profile,
		isLoading,
		isError,
		error,
		isUpdating,
		isEditing,
		successMessage,
		errorMessage,
		register,
		handleSubmit,
		onSubmit,
		handleEditClick,
		handleCancelClick,
	} = useMyProfileForm()

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
				<PersonalInfoFields
					register={register}
					isEditing={isEditing}
					profile={profile}
				/>

				<h3 className='text-xl font-semibold text-gray-800 mb-4 pt-6'>
					Профіль бадмінтоніста
				</h3>
				<BadmintonProfileFields register={register} isEditing={isEditing} />

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
