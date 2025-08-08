import { useForm } from 'react-hook-form'
import { formStyles } from '../../../configs/styles.config'
import { IRequestCreatePaste } from '../../../shared/interfaces/models'
import BaseButton from '../BaseButton/BaseButton'

function PasteForm({ submitFunc, submitButton }) {
	const {
		register,
		handleSubmit,
		formState: { errors },
		watch,
		reset,
	} = useForm<IRequestCreatePaste>({
		values: {
			title: '',
			text: '',
			syntax: '',
			password: '',
			is_public: true,
		},
	})

	const isPublic = watch('is_public', true)

	return (
		<>
			<div className={`${formStyles}`}>
				<h1 className='text-7xl sm:text-4xl mb-10'>Enter info</h1>
				<form
					className='flex flex-col items-center'
					noValidate
					autoComplete='off'
					onSubmit={handleSubmit(data => {
						submitFunc(data)
						reset() // Очищуємо поля після виконання submit
					})}
				>
					<label>
						Title
						<br />
						<input type='text' {...register('title', { required: true })} />
					</label>
					{errors.title && <span>This field is required</span>}

					<label>
						<br />
						Description
						<br />
						<textarea {...register('text', { required: true })} />
					</label>
					{errors.text && <span>This field is required</span>}

					<label>
						<br />
						Syntax
						<br />
						<input type='text' {...register('syntax', { required: false })} />
					</label>
					{/* {errors.syntax && <span>This field is required</span>} */}

					<label>
						<br /> Password <br />
						<input
							type='password'
							{...register('password', {
								validate: value =>
									!!isPublic ||
									(value && value.length > 0) ||
									'Password is required for non-public posts',
							})}
						/>
					</label>
					{errors.password && <span>This field is required</span>}

					<label>
						<br /> Public <br />
						<input type='checkbox' {...register('is_public')} />
					</label>

					<br />
					<BaseButton button={submitButton} />
					<br />
				</form>
			</div>
		</>
	)
}

export default PasteForm
