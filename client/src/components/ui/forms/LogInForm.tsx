import {
	IBaseButton,
	ILogInData,
	ILogInFormProps,
} from '../../../shared/interfaces/models'
import FormBuilder from './FormBuilder'

const logInButtonProps: IBaseButton = {
	title: 'Увійти',
	styles: 'signup-button',
	to: '',
	type: 'button',
}

const signUpButtonProps: IBaseButton = {
	title: 'Зареєструватися зараз',
	styles: '',
	to: '/signup',
}

const forgotPasswordButtonProps: IBaseButton = {
	title: 'Забули пароль?',
	styles: '',
	to: '/enter-email',
}

const LogInForm = ({ onSubmit, errorMessage }: ILogInFormProps) => {
	return (
		<FormBuilder<ILogInData>
			inputs={[
				{
					name: 'email',
					label: 'Email',
					type: 'email',
					placeholder: 'you@example.com',
					rules: { required: 'Email is required' },
				},
				{
					name: 'password',
					label: 'Пароль',
					type: 'password',
					placeholder: '******',
					rules: { minLength: { value: 6, message: 'Min 6 characters' } },
				},
			]}
			submitButton={logInButtonProps}
			extraButton={signUpButtonProps}
			defaultValues={{
				email: '',
				password: '',
			}}
			onSubmit={onSubmit}
			showGoogleButton={true}
		/>
	)
}

export default LogInForm
