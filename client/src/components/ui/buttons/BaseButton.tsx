import { Link } from 'react-router-dom'
import {
	IBaseButton,
	TBaseButtonClickHandler,
} from '../../../shared/interfaces/models'
import { cn } from '../../../utils/clsx'

interface IBaseButtonProps {
	button: IBaseButton
	onButtonClick?: TBaseButtonClickHandler
}

const styleVariants: Record<string, string> = {
	'log-button': 'text-white bg-gray border-white my-6 ml-5',
	'reg-button': 'text-black bg-white border-black my-6 ml-5',
	'signup-button': 'text-black bg-white border-black w-44 mt-4',
	'update-paste-button':
		'text-black bg-yellow-400 border-black w-44 m-auto mt-8 mb-4',
	'delete-paste-button': 'text-black bg-red-400 border-black w-44 m-auto mb-4',
	'delete-account-button':
		'text-black bg-red-400 border-black w-44 m-auto mt-14 mb-8',
}

const BaseButton = ({ button, onButtonClick }: IBaseButtonProps) => {
	const baseClasses = 'block p-3 border-2 rounded-md text-center'
	const buttonClass = cn(baseClasses, styleVariants[button.styles ?? ''])

	if (button.type === 'button' || !button.to) {
		return (
			<button
				// type={button.type}
				onClick={onButtonClick}
				className={buttonClass}
			>
				{button.title}
			</button>
		)
	} else {
		return (
			<Link onClick={onButtonClick} className={buttonClass} to={button.to}>
				{button.title}
			</Link>
		)
	}
}

export default BaseButton
