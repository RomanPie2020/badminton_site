import { TEventInput } from '../../../shared/validations/event.schema'

interface IConfirmModalProps {
	title?: string
	message?: string
	confirmText?: string
	cancelText?: string
	isLoading?: boolean
	event: TEventInput
	onConfirm: (eventId: number) => void
	onClose: (eventId: number) => void
}

const ConfirmModal = ({
	title,
	message = 'Ви впевнені, що хочете видалити цю подію?',
	confirmText = 'Так',
	cancelText = 'Ні',
	isLoading = false,
	event,
	onConfirm,
	onClose,
}: IConfirmModalProps) => (
	<div className='fixed inset-0 bg-black/40 flex items-center justify-center z-50'>
		<div className='bg-white rounded-xl shadow-xl w-full max-w-sm p-6'>
			<h2 className='text-xl font-semibold mb-4'>{title}</h2>
			{message && <p className='text-gray-700 mb-6'>{message}</p>}
			<div className='flex justify-end gap-2'>
				<button
					onClick={() => onClose(event.id)}
					className='px-4 py-2 bg-gray-200 rounded hover:bg-gray-300'
					disabled={isLoading}
				>
					{cancelText}
				</button>
				<button
					onClick={() => onConfirm(event.id)}
					className='px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50'
					disabled={isLoading}
				>
					{isLoading ? 'Видалення...' : confirmText}
				</button>
			</div>
		</div>
	</div>
)

export default ConfirmModal
