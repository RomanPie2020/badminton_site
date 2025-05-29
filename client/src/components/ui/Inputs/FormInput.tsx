// components/ui/TextInput.tsx
import React from 'react'
import { FieldError, UseFormRegister } from 'react-hook-form'

interface TextInputProps {
	label?: string
	name: string
	register: UseFormRegister<any>
	rules?: Record<string, any>
	error?: FieldError
	className?: string
	inputClassName?: string
	type?: React.HTMLInputTypeAttribute
	placeholder?: string
	[x: string]: any
}

const TextInput: React.FC<TextInputProps> = ({
	label,
	name,
	register,
	rules,
	error,
	className = '',
	inputClassName = '',
	type = 'text',
	placeholder,
	...rest
}) => (
	<div className={`flex flex-col mb-3 ${className} `}>
		{label && (
			<label htmlFor={name} className='mb-1 text-md font-medium'>
				{label}
			</label>
		)}
		<input
			id={name}
			type={type}
			placeholder={placeholder}
			className={`
        block w-full border border-gray-300 rounded-lg px-3 py-2
        focus:border-blue-500 focus:ring-1 focus:ring-blue-200
        disabled:bg-gray-100 disabled:cursor-not-allowed
        ${inputClassName}
      `}
			{...register(name, rules)}
			{...rest}
		/>
		{error && <p className='mt-1 text-sm'>{error.message}</p>}
	</div>
)

export default TextInput
