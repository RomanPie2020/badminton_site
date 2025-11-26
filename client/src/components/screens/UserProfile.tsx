import { useNavigate, useParams } from 'react-router-dom'
import { useGetUserProfileByIdQuery } from '../../services/AuthService'
import ProfileForm from '../ui/forms/ProfileForm'
import Loader from '../ui/Loader'

const UserProfile: React.FC = () => {
	const { id } = useParams<{ id: string }>()
	const navigate = useNavigate()
	const userId = Number(id)
	const {
		data: profile,
		isLoading,
		isError,
		error,
	} = useGetUserProfileByIdQuery(userId)

	if (isLoading) return <Loader />
	if (isError || !profile) {
		return (
			<div className='text-center py-10 text-red-600 mt-40'>
				<p>Не вдалося завантажити профіль.</p>
				{typeof error === 'object' && 'status' in error && (
					<p>Помилка: {(error as any).status}</p>
				)}
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
