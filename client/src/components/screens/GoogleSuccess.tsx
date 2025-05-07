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

		if (accessToken) {
			localStorage.setItem('access_token', accessToken) // або sessionStorage
			logIn() // оновлення Redux стану
			navigate('/') // редірект на головну
		} else {
			console.error('Token not found in URL')
			navigate('/login') // або інша fallback сторінка
		}
	}, [searchParams, logIn, navigate])

	return <div className='p-4 text-center'>Logging you in...</div>
}

export default GoogleSuccess
