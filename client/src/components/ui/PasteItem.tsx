// interface IPasteItemProps {
// 	paste:
// }
import { useState } from 'react'
import { SubmitHandler } from 'react-hook-form'
import {
	useDeletePasteByIdMutation,
	useUpdatePasteByIdMutation,
} from '../../services/PasteService'
import { ILogButton, IRequestCreatePaste } from '../../shared/interfaces/models'
import PasteForm from './forms/PasteForm'
import LogButton from './LogButton/LogButton'
import Modal from './Modal'

const updatePasteButtonProps: ILogButton = {
	title: 'Update',
	styles: 'update-paste-button',
	to: '',
	type: 'button',
}

const deletePasteButtonProps: ILogButton = {
	title: 'Delete',
	styles: 'delete-paste-button',
	to: '',
	type: 'button',
}

const PasteItem = ({ paste, refetch }) => {
	// update paste
	const [isModalOpen, setIsModalOpen] = useState(false)

	const handleUpdate = () => {
		setIsModalOpen(true)
	}
	const handleCloseModal = () => {
		setIsModalOpen(false)
	}

	const [updatePaste] = useUpdatePasteByIdMutation()
	const updatePasteFunc: SubmitHandler<IRequestCreatePaste> = async req => {
		const updatedReq = { ...req }
		if (!updatedReq.syntax) {
			delete updatedReq.syntax
		}
		if (!updatedReq.password) {
			delete updatedReq.password
		}

		try {
			const data = await updatePaste({ id: paste.id, ...updatedReq }).unwrap()
			console.log('ok', data)
			refetch()
			handleCloseModal()
		} catch (error) {
			console.log('Failed to update paste:', error)
		}
	}

	// delete paste
	const [deletePaste] = useDeletePasteByIdMutation()
	const handleDelete = async () => {
		try {
			await deletePaste(paste).unwrap()
			console.log(`Paste with id ${paste.id} deleted`)
			refetch()
		} catch (error) {
			console.log('Failed to delete paste:', error)
		}
	}

	return (
		<>
			<li
				className={`p-8 my-5 m-auto text-center border-2 border-black w-4/5 rounded-xl bg-gradient_grey_blue flex flex-col items-center `}
			>
				<div className='text-3xl break-words w-full'>{paste.title}</div>
				<div className='text-xl break-words w-full'>{paste.text}</div>
				<div className='text-xl break-words w-full'>{`http://localhost:5173/paste/${paste.url}`}</div>
				<LogButton
					button={updatePasteButtonProps}
					onButtonClick={handleUpdate}
				/>

				<LogButton
					button={deletePasteButtonProps}
					onButtonClick={handleDelete}
				/>
			</li>
			<Modal isOpen={isModalOpen} onClose={handleCloseModal}>
				<PasteForm
					submitFunc={updatePasteFunc}
					submitButton={updatePasteButtonProps}
				/>
			</Modal>
		</>
	)
}

export default PasteItem
