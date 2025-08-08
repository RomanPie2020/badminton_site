// import { SubmitHandler, useForm } from 'react-hook-form'
// import { useNavigate } from 'react-router-dom'
// import { formStyles } from '../../configs/styles.config'
// import { useActions } from '../../hooks/useActions'
// import {
// 	useDeleteUserMutation,
// 	useUpdateUserMutation,
// } from '../../services/AuthService'
// import {
// 	IBaseButton,
// 	IRequestChangeUsername,
// } from '../../shared/interfaces/models'
// import BaseButton from '../ui/BaseButton/BaseButton'

// const ChangeAccountButtonProps: IBaseButton = {
// 	title: 'Change username',
// 	to: '',
// 	styles: 'signup-button',
// 	type: 'button',
// }

// const deleteAccountButtonProps: IBaseButton = {
// 	title: 'Delete account',
// 	to: '',
// 	styles: 'delete-account-button',
// 	type: 'button',
// }

// const Profile = () => {
// 	const { logOut } = useActions()
// 	const navigate = useNavigate()
// 	const [deleteUser] = useDeleteUserMutation()
// 	const [updateUser] = useUpdateUserMutation()

// 	const updateUserFunc: SubmitHandler<IRequestChangeUsername> = async req => {
// 		// const data = await updateUser(req)
// 		// console.log(data)
// 		try {
// 			const data = await updateUser(req)
// 			console.log(data)
// 			if (data) {
// 				console.log('ok')
// 			}
// 		} catch (error) {
// 			console.log(error)
// 		}
// 	}

// 	const deleteAccount = async () => {
// 		try {
// 			const { data } = await deleteUser('')
// 			console.log(data)

// 			localStorage.removeItem('access_token')
// 			localStorage.removeItem('refresh_token')
// 			localStorage.removeItem('userId')
// 			localStorage.setItem('is_Auth', 'false')
// 			logOut()
// 			navigate('/login')
// 		} catch (error) {
// 			console.log(error, 'error of deleting account')
// 		}
// 	}

// 	const {
// 		register,
// 		handleSubmit,
// 		formState: { errors },
// 	} = useForm<IRequestChangeUsername>({
// 		values: {
// 			username: '',
// 		},
// 	})

// 	return (
// 		<div>
// 			<div className={`${formStyles} flex flex-col items-center`}>
// 				<h1 className='text-7xl mb-10 sm:text-4xl'>Profile</h1>
// 				<form
// 					className=''
// 					noValidate
// 					autoComplete='off'
// 					onSubmit={handleSubmit(updateUserFunc)}
// 				>
// 					<label>
// 						Enter new username <br />
// 						<input type='text' {...register('username', { required: true })} />
// 					</label>
// 					{errors.username && (
// 						<div>
// 							<span>This field is required</span>
// 						</div>
// 					)}

// 					<br />
// 					<BaseButton button={ChangeAccountButtonProps} />
// 					<br />
// 				</form>
// 			</div>
// 			<div className=''>
// 				<BaseButton
// 					onButtonClick={() => deleteAccount()}
// 					button={deleteAccountButtonProps}
// 				/>
// 			</div>
// 		</div>
// 	)
// }

// export default Profile
