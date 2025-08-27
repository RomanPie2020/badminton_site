import { FieldValues, RegisterOptions, useForm } from 'react-hook-form'
import { IBaseButton } from '../../../shared/interfaces/models'
import BaseButton from '../BaseButton/BaseButton'
import TextInput from '../Inputs/FormInput'

interface IFormInput<T extends FieldValues> {
	name: keyof T
	label: string
	type: string
	placeholder: string
	rules?: RegisterOptions
	validateWith?: keyof T // для підтвердження пароля чи інших співставлень
}

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
					<TextInput
						key={String(input.name)}
						label={input.label}
						name={String(input.name)}
						type={input.type}
						register={register}
						rules={{
							...input.rules,
							validate: input.validateWith
								? (value: string) =>
										value === getValues(input.validateWith as string) ||
										'Values do not match'
								: input.rules?.validate,
						}}
						error={errors[input.name]}
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
