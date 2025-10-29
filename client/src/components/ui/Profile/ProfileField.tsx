import { UseFormRegister } from 'react-hook-form'

interface ProfileFieldProps {
	label: string
	name: string
	type?: 'text' | 'number' | 'email' | 'tel' | 'password'
	required?: boolean
	value?: string | number | null
	isEditing: boolean
	register?: UseFormRegister<any>
	LABEL_CLASS: string
}

const ProfileField = ({
	label,
	name,
	type = 'text',
	required = false,
	value,
	isEditing,
	register,
	LABEL_CLASS,
}: ProfileFieldProps) => {
	const isNumber = type === 'number'

	return (
		<div>
			<label className={LABEL_CLASS}>{label}</label>

			{isEditing ? (
				<input
					type={type}
					{...(register
						? register(name, {
								required,
								...(isNumber && {
									valueAsNumber: true,
									setValueAs: v => (v === '' ? null : Number(v)),
								}),
						  })
						: {})}
					defaultValue={value ?? ''}
					disabled={!isEditing}
					className='mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 
                     focus:outline-none focus:ring focus:ring-blue-200 
                     disabled:bg-gray-100'
				/>
			) : (
				<p className='mt-1 block w-full px-3 py-2 rounded-lg bg-gray-50 text-gray-800'>
					{value ?? '—'}
				</p>
			)}
		</div>
	)
}

export default ProfileField
