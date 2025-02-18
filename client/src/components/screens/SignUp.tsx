import { SubmitHandler } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { formStyles } from '../../configs/styles.config'
import { useActions } from '../../hooks/useActions'
import { useSignUpMutation } from '../../services/AuthService'
import { ISignUpData } from '../../shared/interfaces/models'
import SignUpForm from '../ui/forms/SignUpForm'

// дістати з відповіді мутації ,значенння з стору

const SignUp = () => {
	const { addUserId } = useActions()

	const navigate = useNavigate()
	const [signUp] = useSignUpMutation()
	const onSubmit: SubmitHandler<ISignUpData> = async formData => {
		try {
			const { data } = await signUp(formData)
			const code = await addUserId(data.id)
			if (code) {
				navigate('/codeverification')
			}
		} catch (error) {
			console.log(error, 'no id')
		}
	}
	return (
		<div>
			<div className={`${formStyles}`}>
				<h1 className='text-7xl sm:text-4xl mb-10'>SignUp</h1>
				<SignUpForm onSubmit={onSubmit} />
			</div>
		</div>
	)
}

export default SignUp
