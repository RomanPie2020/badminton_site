import { useRouteError } from 'react-router-dom'
import { IBaseButton } from '../../shared/interfaces/models'
import BaseButton from '../ui/BaseButton/BaseButton'

const buttonProps: IBaseButton = {
	title: 'Home',
	styles: 'signup-button',
	to: '/',
}

export const ErrorPage = () => {
	const error = useRouteError()
	console.log(error)

	return (
		<>
			<div className='text-center flex flex-col items-center'>
				<h1 className='text-6xl mb-10'>Oops!</h1>
				<p>{error.statusText ?? error.message}</p>
				<p>{error.status}</p>
				<BaseButton button={buttonProps} />
			</div>
		</>
	)
}
