import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Loader from './Loader'

const PageLoader = () => {
	const [isLoading, setIsLoading] = useState(false)
	const location = useLocation()

	useEffect(() => {
		setIsLoading(true)

		const timer = setTimeout(() => {
			setIsLoading(false)
		}, 100)

		return () => clearTimeout(timer)
	}, [location.pathname])

	if (!isLoading) return null
	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center bg-white/90 backdrop-blur-sm'>
			<Loader />
		</div>
	)
}

export default PageLoader
