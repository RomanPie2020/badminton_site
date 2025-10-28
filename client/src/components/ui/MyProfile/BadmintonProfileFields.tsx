import { UseFormRegister } from 'react-hook-form'
import { ProfileFormData } from '../../../hooks/useMyProfileForm'

const LABEL_CLASS = 'block text-lg font-medium text-black-800 mb-1'

interface Props {
	register: UseFormRegister<ProfileFormData>
	isEditing: boolean
}

export const BadmintonProfileFields = ({ register, isEditing }: Props) => (
	<div className='grid grid-cols-1 gap-4'>
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
	</div>
)
