import { useNavigate, useParams } from 'react-router-dom'
import { useGetUserProfileByIdQuery } from '../../services/AuthService'
import ProfileForm from '../ui/forms/ProfileForm'

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

	if (isLoading) return <p>Loading…</p>
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

// import React from 'react'
// import { useNavigate, useParams } from 'react-router-dom'
// import { useGetUserProfileByIdQuery } from '../../services/AuthService'

// const UserProfile: React.FC = () => {
// 	const { id } = useParams<{ id: string }>()
// 	const navigate = useNavigate()
// 	const userId = Number(id)
// 	const {
// 		data: profile,
// 		isLoading,
// 		isError,
// 		error,
// 	} = useGetUserProfileByIdQuery(userId)

// 	if (isLoading) {
// 		return <p className='text-center py-10 mt-40'>Завантаження профілю…</p>
// 	}
// 	if (isError || !profile) {
// 		return (
// 			<div className='text-center py-10 text-red-600 mt-40'>
// 				<p>Не вдалося завантажити профіль.</p>
// 				{typeof error === 'object' && 'status' in error && (
// 					<p>Помилка: {(error as any).status}</p>
// 				)}
// 				<button
// 					onClick={() => navigate(-1)}
// 					className='mt-4 text-blue-600 hover:underline'
// 				>
// 					← Назад
// 				</button>
// 			</div>
// 		)
// 	}
// 	// ГАРАНТІЯ: profile тепер точно не undefined
// 	if (!profile) {
// 		return null
// 	}

// 	return (
// 		<div className='mt-40'>
// 			<div className='max-w-md mx-auto bg-white rounded-2xl shadow-2xl p-6 my-12'>
// 				<button
// 					onClick={() => navigate(-1)}
// 					className='text-gray-500 hover:text-gray-700 mb-4'
// 				>
// 					← Назад
// 				</button>
// 				<div className='flex flex-col items-center'>
// 					{profile.avatarUrl ? (
// 						<img
// 							src={profile.avatarUrl}
// 							alt='Avatar'
// 							className='w-24 h-24 rounded-full mb-4 object-cover'
// 						/>
// 					) : (
// 						<div className='w-24 h-24 rounded-full bg-gray-200 mb-4 flex items-center justify-center text-gray-500'>
// 							Немає
// 						</div>
// 					)}
// 					<h2 className='text-2xl font-semibold mb-2'>{profile.nickname}</h2>
// 					<p className='text-gray-600 mb-4'>@{profile.username}</p>
// 				</div>

// 				<div className='grid grid-cols-2 gap-4 mb-6'>
// 					<div>
// 						<p className='text-sm text-gray-500'>Місто</p>
// 						<p className='font-medium'>{profile.city || '—'}</p>
// 					</div>
// 					<div>
// 						<p className='text-sm text-gray-500'>Вік</p>
// 						<p className='font-medium'>{profile.age ?? '—'}</p>
// 					</div>
// 					<div>
// 						<p className='text-sm text-gray-500'>Стать</p>
// 						<p className='font-medium'>
// 							{profile.gender === 'male'
// 								? 'Чоловіча'
// 								: profile.gender === 'female'
// 								? 'Жіноча'
// 								: 'Інше'}
// 						</p>
// 					</div>
// 					<div>
// 						<p className='text-sm text-gray-500'>Рівень</p>
// 						<p className='font-medium'>{profile.level || '—'}</p>
// 					</div>
// 				</div>

// 				<hr className='my-6' />

// 				<div className='space-y-4'>
// 					<div>
// 						<p className='text-sm text-gray-500'>Досвід (місяців)</p>
// 						<p className='font-medium'>{profile.experienceMonths ?? '—'}</p>
// 					</div>
// 					<div>
// 						<p className='text-sm text-gray-500'>Формат гри</p>
// 						<p className='font-medium'>
// 							{profile.preferredFormat === 'singles'
// 								? 'Одиночка'
// 								: profile.preferredFormat === 'doubles'
// 								? 'Пара'
// 								: profile.preferredFormat === 'mixed'
// 								? 'Мікст'
// 								: '—'}
// 						</p>
// 					</div>
// 					<div>
// 						<p className='text-sm text-gray-500'>Інтенсивність</p>
// 						<p className='font-medium'>{profile.playFrequency || '—'}</p>
// 					</div>
// 					<div>
// 						<p className='text-sm text-gray-500'>Місця гри</p>
// 						<p className='font-medium'>
// 							{profile.commonPlaces?.join(', ') || '—'}
// 						</p>
// 					</div>
// 					<div>
// 						<p className='text-sm text-gray-500'>Час гри</p>
// 						<p className='font-medium'>{profile.playTime || '—'}</p>
// 					</div>
// 				</div>

// 				<hr className='my-6' />

// 				<div className='space-y-2'>
// 					<p className='text-sm text-gray-500'>Про себе</p>
// 					<p className='font-medium'>{profile.bio || '—'}</p>
// 				</div>

// 				<div className='space-y-2 mt-4'>
// 					<p className='text-sm text-gray-500'>Контакт</p>
// 					<p className='font-medium'>{profile.contact || '—'}</p>
// 				</div>
// 			</div>
// 		</div>
// 	)
// }

// export default UserProfile
