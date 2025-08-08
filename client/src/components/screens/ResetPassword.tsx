import { useState } from 'react'
import { SubmitHandler } from 'react-hook-form'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { formStyles } from '../../configs/styles.config'
import { useResetPasswordMutation } from '../../services/AuthService'
import { IResetPasswordData } from '../../shared/interfaces/models'
import ResetPasswordForm from '../ui/forms/ResetPasswordForm'

const ResetPassword = () => {
	const navigate = useNavigate()
	const [resetPassword, { isLoading }] = useResetPasswordMutation()
	const [errorMessage, setErrorMessage] = useState('')
	const [successMessage, setSuccessMessage] = useState('')
	const [searchParams] = useSearchParams()
	const token = searchParams.get('token')

	const onSubmit: SubmitHandler<IResetPasswordData> = async req => {
		setErrorMessage('')
		setSuccessMessage('')

		// Перевірка на співпадіння паролів
		if (req.newPassword !== req.confirmPassword) {
			setErrorMessage('Паролі не співпадають')
			return
		}
		if (!token) {
			setErrorMessage('Недійсний або відсутній токен для зміни пароля.')
			return
		}
		try {
			const data = await await resetPassword({ token, body: req }).unwrap()
			if (data) {
				setSuccessMessage('Пароль успішно змінено!')
				setTimeout(() => navigate('/'), 2000)
			}
		} catch (error: any) {
			console.log(error, 'Reset password was failed')
			const message =
				error?.data?.message ||
				error?.error ||
				'Не вдалося оновити пароль. Спробуйте ще раз пізніше.'
			setErrorMessage(message)
		}
	}

	return (
		<div>
			<div className={`${formStyles}`}>
				<h1 className='text-6xl mb-10 sm:text-4xl'>Відновлення паролю</h1>

				<ResetPasswordForm onSubmit={onSubmit} />

				{errorMessage && (
					<p className='text-red-600 mt-4 text-lg'>{errorMessage}</p>
				)}

				{successMessage && (
					<p className='text-green-600 mt-4 text-lg'>{successMessage}</p>
				)}
			</div>
		</div>
	)
}

export default ResetPassword
