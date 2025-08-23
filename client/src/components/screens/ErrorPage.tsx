import { isRouteErrorResponse, useRouteError } from 'react-router-dom'
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
		<div className='text-center flex flex-col items-center'>
			<h1 className='text-6xl mb-10'>Oops!</h1>

			{isRouteErrorResponse(error) ? (
				<>
					<p>{error.statusText}</p>
					<p>{error.status}</p>
				</>
			) : error instanceof Error ? (
				<p>{error.message}</p>
			) : (
				<p>Unknown error</p>
			)}

			<BaseButton button={buttonProps} />
		</div>
	)
}
