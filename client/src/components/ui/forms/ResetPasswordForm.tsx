// import React from 'react'
import { useForm } from 'react-hook-form'
import {
	ILogButton,
	IResetPasswordData,
	IResetPasswordFormProps,
} from '../../../shared/interfaces/models'
import LogButton from '../LogButton/LogButton'
// const submitButtonProps: ILogButton = {
// 	title: 'LogIn',
// 	styles: 'log-button mt-5',
// 	to: '/',
// }

const logInButtonProps: ILogButton = {
	title: 'Change password',
	styles: 'signup-button',
	to: '',
	type: 'button',
}

const ResetPasswordForm = ({ onSubmit }: IResetPasswordFormProps) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<IResetPasswordData>({
		values: {
			newPassword: '',
			confirmPassword: '',
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
					New password <br />
					<input
						type='password'
						{...register('newPassword', { required: true })}
					/>
				</label>
				{errors.newPassword && <span>This field is required</span>}

				<label>
					Confirm password <br />
					<input
						type='password'
						{...register('confirmPassword', { required: true })}
					/>
				</label>
				{errors.confirmPassword && <span>This field is required</span>}

				<LogButton button={logInButtonProps} />
				<br />
			</form>
		</>
	)
}

export default ResetPasswordForm
