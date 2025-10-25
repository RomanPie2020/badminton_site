// import React from 'react'
import {
	IBaseButton,
	IEnterEmailData,
	IEnterEmailFormProps,
} from '../../../shared/interfaces/models'
import FormBuilder from './FormBuilder'

const logInButtonProps: IBaseButton = {
	title: 'Надіслати',
	styles: 'signup-button',
	to: '',
	type: 'button',
}

const EnterEmailForm = ({ onSubmit }: IEnterEmailFormProps) => {
	const inputs = [
		{
			name: 'email' as const,
			label: 'Email',
			type: 'email',
			placeholder: 'you@example.com',
			rules: { required: "email обов'язкове поле" },
		},
	]

	return (
		<FormBuilder<IEnterEmailData>
			inputs={inputs}
			submitButton={logInButtonProps}
			defaultValues={{ email: '' }}
			onSubmit={onSubmit}
		/>
	)
}

export default EnterEmailForm
