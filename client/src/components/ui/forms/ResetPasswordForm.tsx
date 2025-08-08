// import React from 'react'
import { useForm } from 'react-hook-form'
import {
	IBaseButton,
	IResetPasswordData,
	IResetPasswordFormProps,
} from '../../../shared/interfaces/models'
import BaseButton from '../BaseButton/BaseButton'
import TextInput from '../Inputs/FormInput'
// const submitButtonProps: IBaseButton = {
// 	title: 'LogIn',
// 	styles: 'log-button mt-5',
// 	to: '/',
// }

const logInButtonProps: IBaseButton = {
	title: 'Змінити пароль',
	styles: 'signup-button',
	to: '',
	type: 'button',
}

const ResetPasswordForm = ({ onSubmit }: IResetPasswordFormProps) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<IResetPasswordData>({
		values: {
			newPassword: '',
			confirmPassword: '',
		},
	})

	return (
		<>
			<form
				className='flex flex-col items-center'
				noValidate
				autoComplete='off'
				onSubmit={handleSubmit(onSubmit)}
			>
				<TextInput
					label='Пароль'
					name='newPassword'
					type='password'
					register={register}
					rules={{ required: "Обов'язкове поле" }}
					error={errors.password}
					placeholder='Введіть новий пароль'
				/>
				{errors.newPassword && <span>Обов'язкове поле</span>}

				<TextInput
					label='Підтвердження паролю'
					name='confirmPassword'
					type='password'
					register={register}
					rules={{ required: "Обов'язкове поле" }}
					error={errors.confirmPassword}
					placeholder='Підтвердіть пароль'
				/>
				{errors.confirmPassword && <span>Обов'язкове поле</span>}

				<BaseButton button={logInButtonProps} />
				<br />
			</form>
		</>
	)
}

export default ResetPasswordForm
