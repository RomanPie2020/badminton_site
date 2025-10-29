import { UseFormRegister } from 'react-hook-form'

interface ProfileTextAreaProps {
	label: string
	name: string
	value?: string | null
	isEditing: boolean
	register?: UseFormRegister<any>
	LABEL_CLASS: string
}

const ProfileTextArea = ({
	label,
	name,
	value,
	isEditing,
	register,
	LABEL_CLASS,
}: ProfileTextAreaProps) => {
	return (
		<div>
			<label className={LABEL_CLASS}>{label}</label>

			{isEditing ? (
				<textarea
					{...(register ? register(name) : {})}
					defaultValue={value ?? ''}
					disabled={!isEditing}
					rows={4}
					className='mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200 disabled:bg-gray-100'
				/>
			) : (
				<p className='mt-1 block w-full px-3 py-2 rounded-lg bg-gray-50 text-gray-800 whitespace-pre-line'>
					{value ?? '—'}
				</p>
			)}
		</div>
	)
}

export default ProfileTextArea
