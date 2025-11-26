// заміни на свій хук
import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useActions } from '../../hooks/useActions'

const GoogleSuccess = () => {
	const [searchParams] = useSearchParams()
	const navigate = useNavigate()
	const { logIn } = useActions()

	useEffect(() => {
		const accessToken = searchParams.get('access_token')
		const refreshToken = searchParams.get('refresh_token')
		const userId = searchParams.get('user')

		if (accessToken && refreshToken && userId) {
			localStorage.setItem('access_token', accessToken)
			localStorage.setItem('refresh_token', refreshToken)
			localStorage.setItem('user_id', userId)
			localStorage.setItem('is_Auth', 'true')
			logIn()
			navigate('/')
		} else {
			console.error('Token not found in URL')
			navigate('/login')
		}
	}, [searchParams, logIn, navigate])

	return <div className='p-4 text-center'>Logging you in...</div>
}

export default GoogleSuccess
