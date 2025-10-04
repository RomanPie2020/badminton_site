import { FieldValues, useForm } from 'react-hook-form'
import { IBaseButton, IFormInput } from '../../../shared/interfaces/models'
import { getFieldError } from '../../../utils/getFieldError'
import BaseButton from '../BaseButton/BaseButton'
import TextInput from '../Inputs/FormInput'

interface IFormBuilderProps<T extends FieldValues> {
	inputs: IFormInput<T>[]
	submitButton: IBaseButton
	extraButton?: IBaseButton
	defaultValues: T
	onSubmit: (data: T) => void
	showGoogleButton?: boolean
}

function FormBuilder<T extends FieldValues>({
	inputs,
	submitButton,
	extraButton,
	defaultValues,
	onSubmit,
	showGoogleButton = false,
}: IFormBuilderProps<T>) {
	const {
		register,
		handleSubmit,
		getValues,
		formState: { errors },
	} = useForm<T>({
		values: defaultValues,
	})

	const googleLogin = () => {
		window.location.href = 'http://localhost:3000/auth/google'
	}

	return (
		<>
			<form
				className='flex flex-col items-center'
				noValidate
				autoComplete='off'
				onSubmit={handleSubmit(onSubmit)}
			>
				{inputs.map(input => (
					<TextInput<T>
						key={String(input.name)}
						label={input.label}
						name={input.name}
						type={input.type}
						register={register}
						rules={{
							...input.rules,
							validate: (value: string) => {
								if (!input.validateWith) return true
								return (
									value === getValues(input.validateWith) ||
									'Values do not match'
								)
							},
						}}
						error={getFieldError(errors, input.name)}
						placeholder={input.placeholder}
					/>
				))}

				<BaseButton button={submitButton} />

				{showGoogleButton && (
					<button
						onClick={googleLogin}
						type='button'
						className='flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm hover:bg-gray-100 transition bg-blue-100 my-5'
					>
						<img
							src='/assets/images/google_icon.svg'
							alt='Google'
							className='w-5 h-5'
						/>
						<span className='text-sm text-gray-700'>Продовжити з Google</span>
					</button>
				)}
			</form>

			{extraButton && <BaseButton button={extraButton} />}
		</>
	)
}

export default FormBuilder
