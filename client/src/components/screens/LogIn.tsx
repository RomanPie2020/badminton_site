import { SubmitHandler } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { formStyles } from '../../configs/styles.config'
import { useActions } from '../../hooks/useActions'
import { useLoginUserMutation } from '../../services/AuthService'
import { ILogInData } from '../../shared/interfaces/models'
import LogInForm from '../ui/forms/LogInForm'

const LogIn = () => {
	const { logIn } = useActions()
	const navigate = useNavigate()
	const [logInUser] = useLoginUserMutation()

	const onSubmit: SubmitHandler<ILogInData> = async req => {
		try {
			const data = await logInUser(req).unwrap()
			console.log(data)
			if (data) {
				localStorage.setItem('access_token', data.accessToken)
				localStorage.setItem('refresh_token', data.refreshToken)
				localStorage.setItem('user_id', data.user.id)
				localStorage.setItem('is_Auth', 'true')
				logIn() // Оновлюємо стан авторизації
				navigate('/')
			}
		} catch (error) {
			console.log(error, 'login was failed')
		}
	}

	return (
		<div>
			<div className={`${formStyles}`}>
				<h1 className='text-7xl mb-10 sm:text-4xl'>LogIn</h1>
				<LogInForm onSubmit={onSubmit} />
			</div>
		</div>
	)
}

export default LogIn
