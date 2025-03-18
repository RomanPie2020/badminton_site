import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import { formStyles } from '../../configs/styles.config'
import {
	useGetPrivatePasteByUrlMutation,
	useGetPublicPasteByUrlQuery,
} from '../../services/PasteService'
import { ILogButton } from '../../shared/interfaces/models'
import LogButton from '../ui/LogButton/LogButton'

interface PasswordFormValues {
	password: string
}

const submitButtonProps: ILogButton = {
	title: 'Accept',
	to: '',
	styles: 'signup-button',
	type: 'button',
}

const Paste = () => {
	const { url } = useParams()
	const { data, error, isLoading } = useGetPublicPasteByUrlQuery(url)
	const [getPrivatePaste] = useGetPrivatePasteByUrlMutation()
	const [privateData, setPrivateData] = useState(null)
	const [privateError, setPrivateError] = useState(null)

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<PasswordFormValues>()

	const handlePasswordSubmit: SubmitHandler<PasswordFormValues> = async ({
		password,
	}) => {
		try {
			const result = await getPrivatePaste({ url, password }).unwrap()
			setPrivateData(result)
			setPrivateError(null)
		} catch (err) {
			setPrivateError('Invalid password. Please try again.')
		}
	}
	if (isLoading) return <div>Loading...</div>
	if (error && error.status !== 403) return <div>Error: {error.message}</div>
	if (data && data.is_public) {
		return (
			<div className={`${formStyles}`}>
				<h1 className='text-3xl break-words w-11/12 m-auto'>{data.title}</h1>
				<div className='text-xl break-words w-11/12 m-auto'>{data.text}</div>
			</div>
		)
	}
	return (
		<div className='mt-28'>
			{!privateData && (
				<div className={`${formStyles} text-center`}>
					<h1 className='text-7xl sm:text-4xl mb-10'>
						It's private paste. Enter password, please
					</h1>
					<form
						className={`flex flex-col items-center`}
						onSubmit={handleSubmit(handlePasswordSubmit)}
					>
						<label>
							Password <br />
							<input
								type='password'
								{...register('password', { required: true })}
							/>
						</label>
						{errors.password && (
							<span style={{ color: 'red' }}>Password is required</span>
						)}
						{privateError && <div style={{ color: 'red' }}>{privateError}</div>}

						<LogButton button={submitButtonProps} />
					</form>
				</div>
			)}

			{privateData && (
				<div className={`${formStyles}`}>
					<h1 className='text-3xl break-words w-11/12 m-auto'>
						{privateData.title}
					</h1>
					<p className='text-xl break-words w-11/12 m-auto'>
						{privateData.text}
					</p>
				</div>
			)}
		</div>
	)
}

export default Paste
