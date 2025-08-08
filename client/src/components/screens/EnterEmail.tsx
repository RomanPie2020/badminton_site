import { useState } from 'react'
import { SubmitHandler } from 'react-hook-form'
import { formStyles } from '../../configs/styles.config'
import { useForgotPasswordMutation } from '../../services/AuthService'
import { IEnterEmailData } from '../../shared/interfaces/models'
import EnterEmailForm from '../ui/forms/EnterEmailForm'

const EnterEmail = () => {
	const [forgotPassword, { isLoading }] = useForgotPasswordMutation()
	const [isSuccess, setIsSuccess] = useState(false)
	const [errorMessage, setErrorMessage] = useState('')

	const onSubmit: SubmitHandler<IEnterEmailData> = async req => {
		setErrorMessage('') // reset before trying again
		try {
			const data = await forgotPassword(req).unwrap()
			if (data) {
				setIsSuccess(true)
			}
		} catch (error: any) {
			console.log(error, 'Enter email was failed')

			// If there is a message in error, we display it
			const message =
				error?.data?.message ||
				error?.error ||
				'Сталася помилка під час надсилання листа. Спробуйте пізніше.'
			setErrorMessage(message)
		}
	}

	return (
		<div>
			<div className={`${formStyles}`}>
				<h1 className='text-6xl mb-10 sm:text-4xl'>
					Введіть email на який прийде лист
				</h1>

				{isLoading ? (
					<div className='flex 	justify-center items-center'>
						<div className='w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin'></div>
					</div>
				) : isSuccess ? (
					<p className='text-green-600 text-xl'>
						✔️ Перевірте пошту — ми надіслали інструкції для відновлення паролю.
					</p>
				) : (
					<>
						<EnterEmailForm onSubmit={onSubmit} />

						{errorMessage && (
							<p className='text-red-600 mt-4 text-lg'>{errorMessage}</p>
						)}
					</>
				)}
			</div>
		</div>
	)
}

export default EnterEmail
