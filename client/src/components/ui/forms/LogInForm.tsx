// import React from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import googleIcon from '../../../assets/images/google_icon.svg'
import { useActions } from '../../../hooks/useActions'
import { useLazyGetGoogleAuthQuery } from '../../../services/AuthService'
import {
	ILogButton,
	ILogInData,
	ILogInFormProps,
} from '../../../shared/interfaces/models'
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

const LogInForm = ({ onSubmit }: ILogInFormProps) => {
	const { logIn } = useActions()
	const navigate = useNavigate()
	const { url } = useParams()
	const [trigger] = useLazyGetGoogleAuthQuery()

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
				<label>
					Email <br />
					<input type='email' {...register('email', { required: true })} />
				</label>
				{errors.email && <span>This field is required</span>}

				<label>
					<br /> Password <br />
					<input
						type='password'
						{...register('password', { required: true })}
					/>
				</label>
				{errors.password && <span>This field is required</span>}
				<br />
				<LogButton button={logInButtonProps} />
				<br />
				<button
					onClick={googleLogin}
					type='button'
					className='flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm hover:bg-gray-100 transition'
				>
					<img src={googleIcon} alt='Google' className='w-5 h-5' />
					<span className='text-sm text-gray-700'>Sign in with Google</span>
				</button>
				<br />
			</form>
			<LogButton button={signUpButtonProps} />
		</>
	)
}

export default LogInForm
