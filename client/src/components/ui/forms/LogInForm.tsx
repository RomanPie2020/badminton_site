// import React from 'react'
import { useForm } from 'react-hook-form'
import googleIcon from '../../../assets/images/google_icon.svg'
import {
	ILogButton,
	ILogInData,
	ILogInFormProps,
} from '../../../shared/interfaces/models'
import TextInput from '../Inputs/FormInput'
import LogButton from '../LogButton/LogButton'
// const submitButtonProps: ILogButton = {
// 	title: 'LogIn',
// 	styles: 'log-button mt-5',
// 	to: '/',
// }

const logInButtonProps: ILogButton = {
	title: 'Log In',
	styles: 'signup-button',
	to: '',
	type: 'button',
}

const signUpButtonProps: ILogButton = {
	title: 'Register now',
	styles: '',
	to: '/signup',
}

const forgotPasswordButtonProps: ILogButton = {
	title: 'Forgot password?',
	styles: '',
	to: '/enter-email',
}

const LogInForm = ({ onSubmit, errorMessage }: ILogInFormProps) => {
	const googleLogin = async () => {
		// try {
		window.location.href = 'http://localhost:3000/auth/google'
		// 	// console.log(result)
		// 	logIn() // Оновлюємо стан авторизації
		// 	navigate('/')
		// } catch (err) {
		// 	console.error(err, 'login was failed')
		// }
	}
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<ILogInData>({
		values: {
			email: '',
			password: '',
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
					label='Email'
					name='email'
					type='email'
					register={register}
					rules={{ required: 'Email is required' }}
					error={errors.email}
					placeholder='you@example.com'
				/>
				<TextInput
					label='Password'
					name='password'
					type='password'
					register={register}
					rules={{
						minLength: { value: 6, message: 'Min 6 characters' },
					}}
					error={errors.password}
					placeholder='******'
				/>
				<LogButton button={logInButtonProps} />
				<LogButton button={forgotPasswordButtonProps} />

				<button
					onClick={googleLogin}
					type='button'
					className='flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm hover:bg-gray-100 transition bg-blue-100 my-5'
				>
					<img src={googleIcon} alt='Google' className='w-5 h-5' />
					<span className='text-sm text-gray-700'>Continue with Google</span>
				</button>
			</form>
			<LogButton button={signUpButtonProps} />
		</>
	)
}

export default LogInForm
