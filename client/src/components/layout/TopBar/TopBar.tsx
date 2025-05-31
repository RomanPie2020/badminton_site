import { Link, Outlet, useNavigate } from 'react-router-dom'
import { useActions } from '../../../hooks/useActions'
import { useLogOutMutation } from '../../../services/AuthService'
import { ILogButton } from '../../../shared/interfaces/models'
import { useAppSelector } from '../../../store/store'
import LogButton from '../../ui/LogButton/LogButton'

// const button: ILogButton = {
//   title: 'click me',
//   color: 'text-black',
//   bgColor: 'bg-white',
//   width: 'w-20',
//   height: 'h-10'
// }

const logButtonProps: ILogButton = {
	title: 'Log in',
	to: '/login',
	styles: 'log-button',
}

const regButtonProps: ILogButton = {
	title: 'Sign up',
	to: '/signup',
	styles: 'reg-button',
}

const logoutButtonProps: ILogButton = {
	title: 'Log out',
	to: '/login',
	styles: 'reg-button',
}

const profileButtonProps: ILogButton = {
	title: 'Profile',
	to: '/profile',
	styles: 'log-button',
}

const eventsButtonProps: ILogButton = {
	title: 'Events',
	to: '/events',
	styles: 'log-button',
}

const myEventsButtonProps: ILogButton = {
	title: 'My Events',
	to: '/myevents',
	styles: 'log-button',
}

function TopBar() {
	const navigate = useNavigate()
	const { logOut } = useActions()
	const isAuthenticated = useAppSelector(
		state => state.authStatus.isAuthenticated
	)
	const [logOutUser] = useLogOutMutation()

	const logoutUser = async () => {
		try {
			const refreshToken = localStorage.getItem('refresh_token')

			const data = await logOutUser({ refreshToken: refreshToken }).unwrap()
			console.log('logout success, now clearing localStorage')
			console.log(data)
			localStorage.removeItem('access_token')
			localStorage.removeItem('refresh_token')
			localStorage.setItem('is_Auth', 'false')
			localStorage.setItem('user_id', '')
			logOut()
			navigate('/login')
		} catch (error) {
			console.log(error, 'error of logging out')
		}
	}

	return (
		<>
			<div className='flex justify-between fixed top-0 w-full px-5 bg-gradient-to-t from-gray-700 to-indigo-500 z-50 '>
				<div className='flex'>
					<Link
						className='inline-block bg-shuttlecock_icon bg-no-repeat bg-left my-4 bg-cover h-16 w-16'
						to='/'
					></Link>
					<div className='ml-2 mt-10 text-white sm:hidden'>BadmickTogether</div>
				</div>

				{/* <SearchInput /> */}
				{isAuthenticated ? (
					<div className='flex'>
						<LogButton button={myEventsButtonProps} />
						<LogButton button={eventsButtonProps} />

						<LogButton button={profileButtonProps} />
						<LogButton
							onButtonClick={() => logoutUser()}
							button={logoutButtonProps}
						/>
					</div>
				) : (
					<div className='flex'>
						<LogButton button={logButtonProps} />
						<LogButton button={regButtonProps} />
					</div>
				)}
			</div>
			<Outlet />
		</>
	)
}

export default TopBar
