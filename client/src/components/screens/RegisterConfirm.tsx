import { useLocation } from 'react-router-dom'
import { formStyles } from '../../configs/styles.config'
import { useConfirmRegistrationQuery } from '../../services/AuthService'
import { IBaseButton } from '../../shared/interfaces/models'
import BaseButton from '../ui/BaseButton/BaseButton'

const buttonProps: IBaseButton = {
	title: 'Log In',
	styles: 'signup-button',
	to: '/login',
}

export const RegisterConfirm = () => {
	const location = useLocation()
	const searchParams = new URLSearchParams(location.search)
	const token = searchParams.get('token')

	const { data, error, isLoading } = useConfirmRegistrationQuery(token ?? '')

	return (
		<div className={`${formStyles}`}>
			<div className='text-center flex flex-col items-center'>
				{isLoading && <h1 className='text-4xl mb-10'>Loading...</h1>}
				{error && (
					<h1 className='text-4xl text-red-500 mb-10'>Confirmation failed!</h1>
				)}
				{data && (
					<>
						<h1 className='text-6xl mb-10'>Registration was successful!</h1>
						<h1 className='text-4xl mb-10'>Log In and let's go!</h1>
						<BaseButton button={buttonProps} />
					</>
				)}
			</div>
		</div>
	)
}
