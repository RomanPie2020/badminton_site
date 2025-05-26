import { useState } from 'react'
import { SubmitHandler } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { formStyles } from '../../configs/styles.config'
import { useActions } from '../../hooks/useActions'
import { useRegisterMutation } from '../../services/AuthService'
import { ISignUpData } from '../../shared/interfaces/models'
import SignUpForm from '../ui/forms/SignUpForm'

const SignUp = () => {
	const { addUserId } = useActions()
	const navigate = useNavigate()

	const [signUp, { isLoading }] = useRegisterMutation()
	const [isSuccess, setIsSuccess] = useState(false)
	const [errorMessage, setErrorMessage] = useState('')

	const onSubmit: SubmitHandler<ISignUpData> = async (
		formData,
		event,
		setServerErrors
	) => {
		setErrorMessage('')
		try {
			const response = await signUp(formData).unwrap()
			await addUserId(response.id)
			setIsSuccess(true)

			// Якщо хочеш редірект одразу:
			// navigate('/')
		} catch (error: any) {
			console.error('Signup error', error)

			if (error?.data?.errors) {
				const fieldErrors = error.data.errors
				Object.entries(fieldErrors).forEach(([field, messages]) => {
					if (Array.isArray(messages)) {
						setServerErrors?.(field as keyof ISignUpData, {
							type: 'server',
							message: messages[0],
						})
					}
				})
				return
			}

			const message =
				error?.data?.message ||
				error?.error ||
				'Не вдалося зареєструватися. Спробуйте ще раз.'
			setErrorMessage(message)
		}
	}
	// console.log(errors)
	return (
		<div>
			<div className={`${formStyles}`}>
				<h1 className='text-7xl sm:text-4xl mb-10'>SignUp</h1>

				{isLoading ? (
					<div className='flex justify-center items-center'>
						<div className='w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin'></div>
					</div>
				) : isSuccess ? (
					<p className='text-green-600 text-xl'>
						✔️ Реєстрація успішна. Перевірте пошту для підтвердження.
					</p>
				) : (
					<div>
						<SignUpForm onSubmit={onSubmit} />
						{errorMessage && (
							<p className='text-red-600 mt-4 text-lg'>{errorMessage}</p>
						)}
					</div>
				)}
			</div>
		</div>
	)
}

export default SignUp
