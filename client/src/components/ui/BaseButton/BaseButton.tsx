import { Link } from 'react-router-dom'
import { IBaseButton, ICodeSendAgain } from '../../../shared/interfaces/models'
import { cn } from '../../../utils/clsx'

interface ButtonProps {
	button: IBaseButton
	onButtonClick?: (codeData: ICodeSendAgain | any) => void
	// children?: ReactNode
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

const BaseButton = ({ button, onButtonClick }: ButtonProps) => {
	const baseClasses = 'block p-3 border-2 rounded-md text-center'
	const buttonClass = cn(baseClasses, styleVariants[button.styles ?? ''])

	// const buttonClass = clsx(
	// 	{
	// 		[`${baseClasses} text-white bg-gray border-white my-6 ml-5 `]:
	// 			button.styles === 'log-button',
	// 		[`${baseClasses} text-black bg-white border-black my-6 ml-5 `]:
	// 			button.styles === 'reg-button',
	// 		[`${baseClasses} text-black bg-white border-black w-44 mt-4`]:
	// 			button.styles === 'signup-button',
	// 		[`${baseClasses} text-black bg-yellow-400 border-black w-44 m-auto mt-8 mb-4`]:
	// 			button.styles === 'update-paste-button',
	// 		[`${baseClasses} text-black bg-red-400 border-black w-44 m-auto mb-4`]:
	// 			button.styles === 'delete-paste-button',
	// 		[`${baseClasses} text-black bg-red-400 border-black w-44 m-auto mt-14 mb-8`]:
	// 			button.styles === 'delete-account-button',
	// 	}
	// 'text-white bg-[#282828] border-white': button.styles === 'log-button',
	// 'text-black bg-white border-black': button.styles === 'reg-button',
	// )

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
