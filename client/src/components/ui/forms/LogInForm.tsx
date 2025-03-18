// import React from 'react'
import { useForm } from 'react-hook-form'
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
			</form>
			<LogButton button={signUpButtonProps} />
		</>
	)
}

export default LogInForm
