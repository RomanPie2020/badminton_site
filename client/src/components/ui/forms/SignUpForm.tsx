// import React from 'react'
import { useForm } from 'react-hook-form'
import googleIcon from '../../../assets/images/google_icon.svg'
import {
	ILogButton,
	ISignUpData,
	ISignUpFormProps,
} from '../../../shared/interfaces/models'
import LogButton from '../LogButton/LogButton'
// #todo підключити reduxtoolkit

// type FormData = {
//   value: string
//   touched?: boolean
// }

// const submitButtonProps: ILogButton = {
// 	title: 'SignUp',
// 	styles: 'log-button mt-5',
// 	to: '/',
// }
const SubmitButtonProps: ILogButton = {
	title: 'Sign up',
	styles: 'signup-button',
	to: '',
	type: 'button',
}

const LogInButtonProps: ILogButton = {
	title: 'Have account? Log in',
	styles: '',
	to: '/login',
}

const SignUpForm = ({ onSubmit }: ISignUpFormProps) => {
	const googleLogin = async () => {
		window.location.href = 'http://localhost:3000/auth/google'
	}
	const {
		register,
		handleSubmit,
		setError,
		getValues,
		watch,
		formState: { errors },
	} = useForm<ISignUpData>({
		values: {
			email: '',
			username: '',
			password: '',
			passwordConfirmation: '',
		},
	})
	const handleInternalSubmit = (data: ISignUpData) =>
		onSubmit(data, undefined, setError)

	return (
		<>
			<form
				className='flex flex-col items-center'
				noValidate
				autoComplete='off'
				onSubmit={handleSubmit(handleInternalSubmit)}
			>
				<label>
					Email <br />
					<input
						type='email'
						{...register('email', {
							required: true,
							minLength: 1,
						})}
					/>
				</label>
				{errors.email && (
					<div>
						<span>{errors.email.message}</span>
					</div>
				)}
				<label>
					<br /> Username <br />
					<input
						type='text'
						{...register('username', {
							required: true,
							minLength: { value: 4, message: 'Min 4 characters' },
						})}
					/>
				</label>
				{errors.username && (
					<div>
						<span>{errors.username.message}</span>
					</div>
				)}
				<label>
					<br /> Password <br />
					<input
						type='password'
						{...register('password', {
							required: true,
							minLength: { value: 6, message: 'Min 6 characters' },
						})}
					/>
				</label>
				{errors.password && (
					<div>
						<span>{errors.password.message}</span>
					</div>
				)}
				<label>
					<br /> Confirm Password <br />
					<input
						type='password'
						{...register('passwordConfirmation', {
							required: true,
							minLength: { value: 6, message: 'Min 6 characters' },
							validate: value =>
								value === getValues('password') || 'Passwords do not match',
						})}
					/>
				</label>
				{errors.passwordConfirmation && (
					<div>
						<span>{errors.passwordConfirmation.message}</span>
					</div>
				)}
				<br />

				<LogButton button={SubmitButtonProps} />
				<br />
				<button
					onClick={googleLogin}
					type='button'
					className='flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm hover:bg-gray-100 transition mb-5 bg-blue-100'
				>
					<img src={googleIcon} alt='Google' className='w-5 h-5 ' />
					<span className='text-sm text-gray-700'>Continue with Google</span>
				</button>
			</form>

			<LogButton button={LogInButtonProps} />
		</>
	)
	// <f></f>
}

export default SignUpForm
// faа
