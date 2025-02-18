import { useState } from 'react'
import { SubmitHandler } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { formStyles } from '../../configs/styles.config'
import {
	useCodeVerificationMutation,
	useSendCodeAgainMutation,
} from '../../services/AuthService'
import { ICodeVerifyData } from '../../shared/interfaces/models'
import CodeVerificationForm from '../ui/forms/CodeVerificationForm'

const CodeVerificationPage = () => {
	// const { auth } = useSelector(state => state)
	// console.log(auth)
	// const [id] = useAppSelector(state => state.code)
	const navigate = useNavigate()
	const [codeVerification] = useCodeVerificationMutation()
	const id = localStorage.getItem('userId')
	// console.log(typeof id)

	const [errorMessage, setErrorMessage] = useState<string | null>(null)
	const onSubmit: SubmitHandler<ICodeVerifyData> = async req => {
		console.log(req)

		// console.log(id)
		req.user_id = id
		console.log(req)

		const { data } = await codeVerification(req)
		console.log(data)

		try {
			if (data.message === 'Account is verified.') {
				navigate('/login')
			}
		} catch (error) {
			console.log(error, 'code isnt right')
			setErrorMessage(
				'Incorrect or expired code. Please try again or click send code again.'
			)
		}
	}

	const [sendCodeAgain] = useSendCodeAgainMutation()
	const sendCodeAgainFunc = async (): Promise<void> => {
		const userId = { user_id: id }

		try {
			const { data } = await sendCodeAgain(userId)
			if (data) {
				return
			}
		} catch (error) {
			console.log(error, 'code wasnt sent again')
			setErrorMessage('Failed to send code again. Please try later.')
		}
	}

	return (
		<div>
			<div className={`${formStyles}`}>
				<h1 className='text-7xl mb-10 sm:text-4xl'>Code verification</h1>
				<CodeVerificationForm
					onSendCodeAgain={sendCodeAgainFunc}
					onSubmit={onSubmit}
					errorMessage={errorMessage}
				/>
			</div>
		</div>
	)
}
export default CodeVerificationPage
