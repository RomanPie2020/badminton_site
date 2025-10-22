import { FieldError, FieldValues, useForm } from 'react-hook-form'
import googleIcon from '../../../assets/images/google_icon.svg'
import { IBaseButton, IFormInput } from '../../../shared/interfaces/models'
import BaseButton from '../BaseButton/BaseButton'
import TextInput from '../Inputs/FormInput'

interface IFormBuilderProps<T extends FieldValues> {
	inputs: IFormInput<T>[]
	submitButton: IBaseButton
	extraButtons?: IBaseButton[] // <-- тепер масив
	defaultValues: T
	errorMessage?: string | null
	onSubmit: (data: T) => void
	showGoogleButton?: boolean
}

function FormBuilder<T extends FieldValues>({
	inputs,
	submitButton,
	extraButtons = [], // за замовчуванням пустий масив
	defaultValues,
	errorMessage,
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
					<TextInput
						key={String(input.name)}
						label={input.label}
						name={input.name}
						type={input.type}
						register={register}
						rules={{
							...input.rules,
							validate: input.validateWith
								? (value: string) =>
										value === getValues(input.validateWith as any) ||
										'Values do not match'
								: input.rules?.validate,
						}}
						error={
							(errors[input.name] as FieldError | undefined) ||
							(errorMessage ? { message: errorMessage } : null)
						}
						placeholder={input.placeholder}
					/>
				))}

				{/* Основна кнопка відправки */}
				<BaseButton button={submitButton} />

				{/* Google button, якщо потрібен */}
				{showGoogleButton && (
					<button
						onClick={googleLogin}
						type='button'
						className='flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm hover:bg-gray-100 transition bg-blue-100 my-5'
					>
						<img src={googleIcon} alt='Google' className='w-5 h-5' />
						<span className='text-sm text-gray-700'>Продовжити з Google</span>
					</button>
				)}
			</form>

			{/* Рендеримо всі додаткові кнопки під формою */}
			<div className='flex flex-col items-center gap-2'>
				{extraButtons.map((btn, idx) => (
					<BaseButton key={idx} button={btn} />
				))}
			</div>
		</>
	)
}

export default FormBuilder
