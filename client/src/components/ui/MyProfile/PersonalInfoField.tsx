import { UseFormRegister } from 'react-hook-form'
import { ProfileFormData } from '../../../hooks/useMyProfileForm'

const LABEL_CLASS = 'block text-lg font-medium text-black-800 mb-1'

interface Props {
	register: UseFormRegister<ProfileFormData>
	isEditing: boolean
	profile: ProfileFormData | undefined
}

export const PersonalInfoFields = ({ register, isEditing, profile }: Props) => (
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
		<div>
			<label className={LABEL_CLASS}>Нікнейм</label>
			<input
				type='text'
				{...register('nickname', { required: true })}
				disabled={!isEditing}
				className='mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200 disabled:bg-gray-100'
			/>
		</div>
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
)
