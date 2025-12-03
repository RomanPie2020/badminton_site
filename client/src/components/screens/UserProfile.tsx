import { useNavigate, useParams } from 'react-router-dom'
import { useGetUserProfileByIdQuery } from '../../services/AuthService'
import { getErrorMessage } from '../../utils/parseApiErrors'
import ProfileForm from '../ui/forms/ProfileForm'
import ProfileSkeleton from '../ui/profile/ProfileSkeleton'

const UserProfile = () => {
	const { id } = useParams<{ id: string }>()
	const navigate = useNavigate()
	const userId = Number(id)
	const {
		data: profile,
		isLoading,
		isError,
		error,
	} = useGetUserProfileByIdQuery(userId)

	const errorMessage = isError
		? getErrorMessage(error, 'Не вдалося завантажити профіль.')
		: null

	if (isLoading) return <ProfileSkeleton />
	if (isError || !profile) {
		return (
			<div className='text-center py-10 text-red-600 mt-40'>
				<p>{errorMessage}</p>
				<button
					onClick={() => navigate(-1)}
					className='mt-4 text-blue-600 hover:underline'
				>
					← Назад
				</button>
			</div>
		)
	}

	return (
		<ProfileForm
			profile={profile}
			isEditing={false}
			showActions={false}
			whiteBackground={true}
		/>
	)
}
export default UserProfile
