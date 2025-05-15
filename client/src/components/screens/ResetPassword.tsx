import { SubmitHandler } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { formStyles } from '../../configs/styles.config'
import { useResetPasswordMutation } from '../../services/AuthService'
import { IResetPasswordData } from '../../shared/interfaces/models'
import ResetPasswordForm from '../ui/forms/ResetPasswordForm'

const ResetPassword = () => {
	const navigate = useNavigate()
	const [resetPassword] = useResetPasswordMutation()

	const onSubmit: SubmitHandler<IResetPasswordData> = async req => {
		try {
			const data = await resetPassword(req).unwrap()
			console.log(data)
			if (data) {
				navigate('/')
			}
		} catch (error) {
			console.log(error, 'Reset password was failed')
		}
	}

	return (
		<div>
			<div className={`${formStyles}`}>
				<h1 className='text-7xl mb-10 sm:text-4xl'>Reset Password</h1>
				<ResetPasswordForm onSubmit={onSubmit} />
			</div>
		</div>
	)
}

export default ResetPassword
