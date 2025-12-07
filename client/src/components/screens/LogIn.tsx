import { useState } from 'react'
import { SubmitHandler } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { formStyles } from '../../configs/styles.config'
import { useActions } from '../../hooks/useActions'
import { useLoginUserMutation } from '../../services/AuthService'
import { ILogInData } from '../../shared/interfaces/models'
import { getErrorMessage } from '../../utils/parseApiErrors'
import LogInForm from '../ui/forms/LogInForm'

const LogIn = () => {
	const { logIn } = useActions()
	const navigate = useNavigate()
	const [logInUser] = useLoginUserMutation()
	const [loginError, setLoginError] = useState<string | null>(null)

	const onSubmit: SubmitHandler<ILogInData> = async req => {
		try {
			const data = await logInUser(req).unwrap()
			console.log(data)
			if (data) {
				localStorage.setItem('access_token', data.accessToken)
				localStorage.setItem('refresh_token', data.refreshToken)
				localStorage.setItem('user_id', data.user.id.toString())
				localStorage.setItem('is_Auth', 'true')
				logIn()
				navigate('/')
			}
		} catch (error) {
			console.log(error, 'login was failed')
			const message = getErrorMessage(error, 'Incorrect email or password')
			setLoginError(message)
		}
	}

	return (
		<div>
			<div className={`${formStyles}`}>
				<h1 className='text-7xl mb-10 sm:text-4xl'>Увійти</h1>
				<LogInForm onSubmit={onSubmit} />
				{loginError && (
					<p className='text-red-600 mb-2 text-lg'>{loginError}</p>
				)}
				<Link className={'block mb-4'} to={'/signup'}>
					Зареєструватися зараз
				</Link>
				<Link className={'underline'} to={'/enter-email'}>
					Забули пароль?
				</Link>
			</div>
		</div>
	)
}

export default LogIn
