// import React from 'react'
import { useForm } from 'react-hook-form'
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
	const {
		register,
		handleSubmit,
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
	// const watchAllFields = watch()
	// const { password, passwordConfirmation } = watch()
	// const all = watch()

	// const comparePasswords = () => {
	// const password = getValues('password')
	// const { password, passwordConfirmation } = watch()
	// console.log(watchAllFields)
	// const isPasswordEqual = password === passwordConfirmation
	// console.log(isPasswordEqual)
	// }
	// const { password, passwordConfirmation } = getValues()
	// const comparePasswords = () => {
	// 	useEffect(() => {
	// 		console.log('All Values:', password, passwordConfirmation)
	// 		const isPasswordEqual = password === passwordConfirmation
	// 		return !isPasswordEqual && <span>no equal passwords</span>
	// 	}, [password, passwordConfirmation])
	// }
	return (
		<>
			<form
				className='flex flex-col items-center'
				autoComplete='off'
				onSubmit={handleSubmit(onSubmit)}
			>
				<label>
					Email <br />
					<input type='email' {...register('email', { required: true })} />
				</label>
				{errors.email && (
					<div>
						<span>This field is required</span>
					</div>
				)}
				<label>
					<br /> Username <br />
					<input
						type='text'
						{...register('username', { required: true, minLength: 1 })}
					/>
				</label>
				{errors.username && (
					<div>
						<span>This field is required</span>
					</div>
				)}
				<label>
					<br /> Password <br />
					<input
						type='text'
						{...register('password', {
							required: true,
							minLength: 1,
						})}
					/>
				</label>
				{errors.password && (
					<div>
						<span>This field is required</span>
					</div>
				)}
				<label>
					<br /> Confirm Password <br />
					<input
						type='text'
						{...register('passwordConfirmation', {
							required: true,
							minLength: 1,
						})}
						// onChange={comparePasswords}
					/>
				</label>
				{errors.passwordConfirmation && (
					<div>
						<span>This field is required</span>
					</div>
				)}
				{/* {comparePasswords()} */}
				<br />
				<LogButton button={SubmitButtonProps} />
				<br />
			</form>
			<LogButton button={LogInButtonProps} />
		</>
	)
	// <f></f>
}

export default SignUpForm
// faа
