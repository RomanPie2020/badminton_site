import { SubmitHandler } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { formStyles } from '../../configs/styles.config'
import { useForgotPasswordMutation } from '../../services/AuthService'
import { IEnterEmailData } from '../../shared/interfaces/models'
import EnterEmailForm from '../ui/forms/EnterEmailForm'

const EnterEmail = () => {
	const navigate = useNavigate()
	const [forgotPassword] = useForgotPasswordMutation()

	const onSubmit: SubmitHandler<IEnterEmailData> = async req => {
		try {
			const data = await forgotPassword(req).unwrap()
			console.log(data)
			if (data) {
				navigate('/')
			}
		} catch (error) {
			console.log(error, 'Enter email was failed')
		}
	}

	return (
		<div>
			<div className={`${formStyles}`}>
				<h1 className='text-7xl mb-10 sm:text-4xl'>Enter email</h1>
				<EnterEmailForm onSubmit={onSubmit} />
			</div>
		</div>
	)
}

export default EnterEmail
