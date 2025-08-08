// import React from 'react'
import { useForm } from 'react-hook-form'
import googleIcon from '../../../assets/images/google_icon.svg'
import {
	IBaseButton,
	ISignUpData,
	ISignUpFormProps,
} from '../../../shared/interfaces/models'
import BaseButton from '../BaseButton/BaseButton'
import TextInput from '../Inputs/FormInput'
// #todo підключити reduxtoolkit

// type FormData = {
//   value: string
//   touched?: boolean
// }

// const submitButtonProps: IBaseButton = {
// 	title: 'SignUp',
// 	styles: 'log-button mt-5',
// 	to: '/',
// }
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
					label='Імʼя користувача'
					name='username'
					type='text'
					register={register}
					rules={{ required: 'Username is required' }}
					error={errors.username}
					placeholder='Введіть імʼя користувача'
				/>

				<TextInput
					label='Пароль'
					name='password'
					type='password'
					register={register}
					rules={{
						minLength: { value: 6, message: 'Min 6 characters' },
					}}
					error={errors.password}
					placeholder='******'
				/>
				<TextInput
					label='Підтвердження паролю'
					name='passwordConfirmation'
					type='password'
					register={register}
					rules={{
						minLength: { value: 6, message: 'Min 6 characters' },
						validate: value =>
							value === getValues('password') || 'Passwords do not match',
					}}
					error={errors.passwordConfirmation}
					placeholder='******'
				/>
				{/* <label>
					<br /> Confirm Password <br />
					<input
						type='password'
						className={`${formInputStyles}`}
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
				<br /> */}

				<BaseButton button={SubmitButtonProps} />

				<button
					onClick={googleLogin}
					type='button'
					className='flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm hover:bg-gray-100 transition mb-5 mt-5 bg-blue-100'
				>
					<img src={googleIcon} alt='Google' className='w-5 h-5 ' />
					<span className='text-sm text-gray-700'>Продовжити з Google</span>
				</button>
			</form>

			<BaseButton button={LogInButtonProps} />
		</>
	)
	// <f></f>
}

export default SignUpForm
// faа
