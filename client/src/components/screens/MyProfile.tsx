import { useMyProfileForm } from '../../hooks/useMyProfileForm'
import ProfileForm from '../ui/forms/ProfileForm'
import ProfileSkeleton from '../ui/profile/ProfileSkeleton'

const MyProfile = () => {
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

	if (isLoading) {
		return <ProfileSkeleton />
	}

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
		<ProfileForm
			profile={profile}
			isEditing={isEditing}
			isUpdating={isUpdating}
			successMessage={successMessage}
			errorMessage={errorMessage}
			register={register}
			handleSubmit={handleSubmit}
			onSubmit={onSubmit}
			handleEditClick={handleEditClick}
			handleCancelClick={handleCancelClick}
		/>
	)
}
export default MyProfile
