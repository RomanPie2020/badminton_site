// import React from 'react'
import { useForm } from 'react-hook-form'
import {
	IEnterEmailData,
	IEnterEmailFormProps,
	ILogButton,
} from '../../../shared/interfaces/models'
import LogButton from '../LogButton/LogButton'
// const submitButtonProps: ILogButton = {
// 	title: 'LogIn',
// 	styles: 'log-button mt-5',
// 	to: '/',
// }

const logInButtonProps: ILogButton = {
	title: 'Send',
	styles: 'signup-button',
	to: '',
	type: 'button',
}

const EnterEmailForm = ({ onSubmit }: IEnterEmailFormProps) => {
	// const EnterEmailFunc = async () => {
	// 	// try {
	// 	window.location.href = 'http://localhost:3000/auth/google'
	// 	// 	// console.log(result)
	// 	// 	logIn() // Оновлюємо стан авторизації
	// 	// 	navigate('/')
	// 	// } catch (err) {
	// 	// 	console.error(err, 'login was failed')
	// 	// }
	// }
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<IEnterEmailData>({
		values: {
			email: '',
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

				<LogButton button={logInButtonProps} />
				<br />
			</form>
		</>
	)
}

export default EnterEmailForm
