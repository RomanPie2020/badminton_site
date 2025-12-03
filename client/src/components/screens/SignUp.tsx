import { useState } from 'react'
import { Link } from 'react-router-dom'
import { formStyles } from '../../configs/styles.config'
import { useActions } from '../../hooks/useActions'
import { useRegisterMutation } from '../../services/AuthService'
import {
	ISignUpData,
	TFormBuilderSubmitHandler,
} from '../../shared/interfaces/models'
import { getErrorMessage } from '../../utils/parseApiErrors'
import SignUpForm from '../ui/forms/SignUpForm'
import Loader from '../ui/loaders/Loader'

const SignUp = () => {
	const { addUserId } = useActions()
	const [signUp, { isLoading }] = useRegisterMutation()
	const [isSuccess, setIsSuccess] = useState(false)
	const [errorMessage, setErrorMessage] = useState('')

	const onSubmit: TFormBuilderSubmitHandler<ISignUpData> = async formData => {
		setErrorMessage('')
		try {
			const response = await signUp(formData).unwrap()
			await addUserId(response.id)
			setIsSuccess(true)
		} catch (error: unknown) {
			console.error('Signup error', error)
			const message = getErrorMessage(error, 'Failed to register. Try again.')
			setErrorMessage(message)
		}
	}

	return (
		<div>
			<div className={`${formStyles}`}>
				<h1 className='text-7xl sm:text-4xl mb-10'>Реєстрація</h1>

				{isLoading ? (
					<Loader />
				) : isSuccess ? (
					<p className='text-green-600 text-xl'>
						✔️ Реєстрація успішна. Перевірте пошту для підтвердження.
					</p>
				) : (
					<div>
						<SignUpForm onSubmit={onSubmit} />
						{errorMessage && (
							<p className='text-red-500 text-lg'>{errorMessage}</p>
						)}
						<Link className={''} to={'/login'}>
							Маєш аккаунт? Увійди зараз
						</Link>
					</div>
				)}
			</div>
		</div>
	)
}

export default SignUp
