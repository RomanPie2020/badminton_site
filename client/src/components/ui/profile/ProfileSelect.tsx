import { UseFormRegister } from 'react-hook-form'

interface ProfileSelectProps {
	label: string
	name: string
	options: { value: string; label: string }[]
	value?: string | null
	isEditing: boolean
	register?: UseFormRegister<any>
	LABEL_CLASS: string
}

const ProfileSelect = ({
	label,
	name,
	options,
	value,
	isEditing,
	register,
	LABEL_CLASS,
}: ProfileSelectProps) => {
	return (
		<div>
			<label className={LABEL_CLASS}>{label}</label>
			{isEditing ? (
				<select
					{...(register ? register(name) : {})}
					defaultValue={value ?? ''}
					disabled={!isEditing}
					className='mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 
                     focus:outline-none focus:ring focus:ring-blue-200 
                     disabled:bg-gray-100'
				>
					{options.map(opt => (
						<option key={opt.value} value={opt.value}>
							{opt.label}
						</option>
					))}
				</select>
			) : (
				<p className='mt-1 block w-full px-3 py-2 rounded-lg bg-gray-50 text-gray-800'>
					{options.find(opt => opt.value === value)?.label || '—'}
				</p>
			)}
		</div>
	)
}

export default ProfileSelect
