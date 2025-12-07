import {
	FieldError,
	FieldValues,
	useForm,
	UseFormSetError,
} from 'react-hook-form'
import googleIcon from '../../../assets/images/google_icon.svg'
import { apiUrl } from '../../../configs/url.config'
import { IBaseButton, IFormInput } from '../../../shared/interfaces/models'
import BaseButton from '../buttons/BaseButton'
import TextInput from '../inputs/TextInput'

interface IFormBuilderProps<T extends FieldValues> {
	inputs: IFormInput<T>[]
	submitButton: IBaseButton
	extraButtons?: IBaseButton[]
	defaultValues: T
	errorMessage?: string | null
	onSubmit: (data: T, helpers?: { setError: UseFormSetError<T> }) => void

	showGoogleButton?: boolean
}

function FormBuilder<T extends FieldValues>({
	inputs,
	submitButton,
	extraButtons = [],
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
		setError,
	} = useForm<T>({
		values: defaultValues,
	})

	const googleLogin = () => {
		window.location.href = `${apiUrl}/auth/google`
	}

	return (
		<>
			<form
				className='flex flex-col items-center'
				noValidate
				autoComplete='off'
				onSubmit={handleSubmit(data => onSubmit(data, { setError }))}
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

				<BaseButton button={submitButton} />

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

			<div className='flex flex-col items-center gap-2'>
				{extraButtons.map((btn, idx) => (
					<BaseButton key={idx} button={btn} />
				))}
			</div>
		</>
	)
}

export default FormBuilder
