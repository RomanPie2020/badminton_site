// import React from 'react'
import { useForm } from 'react-hook-form'
import {
	IBaseButton,
	IEnterEmailData,
	IEnterEmailFormProps,
} from '../../../shared/interfaces/models'
import BaseButton from '../BaseButton/BaseButton'
import TextInput from '../Inputs/FormInput'
// const submitButtonProps: IBaseButton = {
// 	title: 'LogIn',
// 	styles: 'log-button mt-5',
// 	to: '/',
// }

const logInButtonProps: IBaseButton = {
	title: 'Надіслати',
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
				<TextInput
					label='Email'
					name='email'
					type='email'
					register={register}
					rules={{ required: "email обов'язкове поле" }}
					error={errors.email}
					placeholder='you@example.com'
				/>
				{errors.email && <span>Обов'язкове поле</span>}

				<BaseButton button={logInButtonProps} />
				<br />
			</form>
		</>
	)
}

export default EnterEmailForm
