// import React from 'react'
import {
	IBaseButton,
	IFormInput,
	IResetPasswordData,
	IResetPasswordFormProps,
} from '../../../shared/interfaces/models'
import FormBuilder from './FormBuilder'

const logInButtonProps: IBaseButton = {
	title: 'Змінити пароль',
	styles: 'signup-button',
	to: '',
	type: 'button',
}

const ResetPasswordForm = ({ onSubmit }: IResetPasswordFormProps) => {
	const inputs: IFormInput<IResetPasswordData>[] = [
		{
			name: 'newPassword',
			label: 'Пароль',
			type: 'password',
			placeholder: 'Введіть новий пароль',
			rules: { required: "Обов'язкове поле" },
		},
		{
			name: 'confirmPassword',
			label: 'Підтвердження паролю',
			type: 'password',
			placeholder: 'Підтвердіть пароль',
			rules: { required: "Обов'язкове поле" },
			validateWith: 'newPassword', // ключ з IResetPasswordData
		},
	]

	return (
		<FormBuilder<IResetPasswordData>
			inputs={inputs}
			submitButton={logInButtonProps}
			defaultValues={{ newPassword: '', confirmPassword: '' }}
			onSubmit={onSubmit}
		/>
	)
}

export default ResetPasswordForm
