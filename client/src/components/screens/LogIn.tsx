import { SubmitHandler } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { formStyles } from '../../configs/styles.config'
import { useActions } from '../../hooks/useActions'
import { useLogInUserMutation } from '../../services/AuthService'
import { ILogInData } from '../../shared/interfaces/models'
import LogInForm from '../ui/forms/LogInForm'

const LogIn = () => {
	const { logIn } = useActions()
	const navigate = useNavigate()
	const [logInUser] = useLogInUserMutation()

	const onSubmit: SubmitHandler<ILogInData> = async req => {
		const data = await logInUser(req).unwrap()
		console.log(data)
		try {
			if (data) {
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
