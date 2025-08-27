// components/ui/TextInput.tsx
import React from 'react'
import {
	FieldError,
	FieldValues,
	Path,
	RegisterOptions,
	UseFormRegister,
} from 'react-hook-form'

interface TextInputProps<
	T extends FieldValues,
	TName extends Path<T> = Path<T>
> {
	label?: string
	name: Path<T>
	register: UseFormRegister<T>
	rules?: RegisterOptions<T, TName>
	error?: FieldError
	className?: string
	inputClassName?: string
	type?: React.HTMLInputTypeAttribute
	placeholder?: string
	disabled?: boolean
	// [x: string]: any
}

const TextInput = <T extends FieldValues>({
	label,
	name,
	register,
	rules,
	error,
	className = '',
	inputClassName = '',
	type = 'text',
	placeholder,
	disabled = false,
}: TextInputProps<T>) => {
	return (
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
				disabled={disabled}
				aria-invalid={!!error}
				aria-describedby={error ? `${name}-error` : undefined}
				className={`
					block w-full border border-gray-300 rounded-lg px-3 py-2
					focus:border-blue-500 focus:ring-1 focus:ring-blue-200
					disabled:bg-gray-100 disabled:cursor-not-allowed
					${inputClassName}
				`}
				{...register(name, rules)}
			/>
			{error && (
				<p id={`${name}-error`} className='mt-1 text-sm text-red-500'>
					{error.message}
				</p>
			)}
		</div>
	)
}

export default TextInput
