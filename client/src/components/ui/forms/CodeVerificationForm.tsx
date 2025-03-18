import { useForm } from 'react-hook-form'
import {
	ICodeVerifyData,
	ICodeVerifyFormProps,
	ILogButton,
} from '../../../shared/interfaces/models'
import { useAppSelector } from '../../../store/store'
import LogButton from '../LogButton/LogButton'

const SubmitButtonProps: ILogButton = {
	title: 'Send',
	styles: 'signup-button',
	to: '',
	type: 'button',
}

const signUpButtonProps: ILogButton = {
	title: 'Send code again',
	styles: 'mt-2 inline-block',
	to: '',
}

const CodeVerificationForm = ({
	onSubmit,
	onSendCodeAgain,
	errorMessage,
}: ICodeVerifyFormProps & { errorMessage?: string | null }) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<ICodeVerifyData>({
		values: {
			code: '',
			user_id: '',
		},
	})

	const [id] = useAppSelector(state => state.code)
	return (
		<>
			<form
				className='flex flex-col items-center'
				noValidate
				autoComplete='off'
				onSubmit={handleSubmit(onSubmit)}
			>
				<label>
					Code <br />
					<input type='' {...register('code', { required: true })} />
				</label>
				{errors.code && <span>This field is required</span>}
				{errorMessage && (
					<span className='text-red-500 mt-2'>{errorMessage}</span>
				)}
				<br />
				<LogButton button={SubmitButtonProps} />
				<br />
			</form>
			<LogButton
				onButtonClick={() => onSendCodeAgain()}
				button={signUpButtonProps}
			/>
		</>
	)
}

export default CodeVerificationForm
