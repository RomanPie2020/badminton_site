// import React from 'react'
import { UseFormSetError } from 'react-hook-form'
import {
	IBaseButton,
	IFormInput,
	ISignUpData,
	ISignUpFormProps,
} from '../../../shared/interfaces/models'
import FormBuilder from './FormBuilder'

const SubmitButtonProps: IBaseButton = {
	title: 'Зареєструватися',
	styles: 'signup-button',
	to: '',
	type: 'button',
}

const LogInButtonProps: IBaseButton = {
	title: 'Маєш аккаунт? Увійди зараз',
	styles: '',
	to: '/login',
}
const formInputStyles =
	'px-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'

const SignUpForm = ({ onSubmit }: ISignUpFormProps) => {
	const inputs: IFormInput<ISignUpData>[] = [
		{
			name: 'email',
			label: 'Email',
			type: 'email',
			placeholder: 'you@example.com',
			rules: { required: 'Email is required' },
		},
		{
			name: 'username',
			label: 'Імʼя користувача',
			type: 'text',
			placeholder: 'Введіть імʼя користувача',
			rules: { required: 'Username is required' },
		},
		{
			name: 'password',
			label: 'Пароль',
			type: 'password',
			placeholder: '******',
			rules: {
				minLength: { value: 6, message: 'Min 6 characters' },
			},
		},
		{
			name: 'passwordConfirmation',
			label: 'Підтвердження паролю',
			type: 'password',
			placeholder: '******',
			rules: {
				minLength: { value: 6, message: 'Min 6 characters' },
			},
			validateWith: 'password',
		},
	]

	const handleSubmit = (
		data: ISignUpData,
		helpers?: { setError: UseFormSetError<ISignUpData> }
	) => onSubmit(data, helpers)

	return (
		<FormBuilder<ISignUpData>
			inputs={inputs}
			submitButton={SubmitButtonProps}
			extraButtons={[]}
			defaultValues={{
				email: '',
				username: '',
				password: '',
				passwordConfirmation: '',
			}}
			onSubmit={handleSubmit}
			showGoogleButton={true}
		/>
	)
}

export default SignUpForm
