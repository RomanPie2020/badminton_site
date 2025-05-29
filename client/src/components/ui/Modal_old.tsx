import { useEffect } from 'react'

const Modal = ({ isOpen, onClose, children }) => {
	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = 'hidden'
		} else {
			document.body.style.overflow = 'auto'
		}
		return () => {
			document.body.style.overflow = 'auto'
		}
	}, [isOpen])
	if (!isOpen) return null

	return (
		<div className='fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center'>
			<div className='bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative max-h-full overflow-auto'>
				<button
					className='absolute top-2 right-2 text-gray-700 hover:text-gray-900 bg-red-400 hover:bg-red-500  rounded p-4'
					onClick={onClose}
				>
					Close
				</button>
				<div className='flex flex-col items-center justify-center min-h-[calc(100vh-8rem)]'>
					{children}
				</div>
			</div>
		</div>
	)
}

export default Modal
