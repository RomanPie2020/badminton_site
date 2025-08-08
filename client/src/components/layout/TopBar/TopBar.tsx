import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { useActions } from '../../../hooks/useActions'
import { useLogOutMutation } from '../../../services/AuthService'
import { IBaseButton } from '../../../shared/interfaces/models'
import { useAppSelector } from '../../../store/store'
import BaseButton from '../../ui/BaseButton/BaseButton'

const logButtonProps: IBaseButton = {
	title: 'Увійти',
	to: '/login',
	styles: 'log-button',
}

const regButtonProps: IBaseButton = {
	title: 'Зареєструватися',
	to: '/signup',
	styles: 'reg-button',
}

const logoutButtonProps: IBaseButton = {
	title: 'Вийти',
	to: '/login',
	styles: 'reg-button',
}

const profileButtonProps: IBaseButton = {
	title: 'Профіль',
	to: '/profile',
	styles: 'log-button',
}

const eventsButtonProps: IBaseButton = {
	title: 'Події',
	to: '/events',
	styles: 'log-button',
}

const myEventsButtonProps: IBaseButton = {
	title: 'Мої події',
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

	const [menuOpen, setMenuOpen] = useState(false)

	const handleLogout = async () => {
		try {
			const refreshToken = localStorage.getItem('refresh_token')
			await logOutUser({ refreshToken }).unwrap()
			localStorage.removeItem('access_token')
			localStorage.removeItem('refresh_token')
			localStorage.setItem('is_Auth', 'false')
			localStorage.setItem('user_id', '')
			logOut()
			setMenuOpen(false)
			navigate('/login')
		} catch (error) {
			console.error('error of logging out', error)
		}
	}

	const renderAuthButtons = () => (
		<>
			<BaseButton
				button={myEventsButtonProps}
				onButtonClick={() => setMenuOpen(false)}
			/>
			<BaseButton
				button={eventsButtonProps}
				onButtonClick={() => setMenuOpen(false)}
			/>
			<BaseButton
				button={profileButtonProps}
				onButtonClick={() => setMenuOpen(false)}
			/>
			<BaseButton button={logoutButtonProps} onButtonClick={handleLogout} />
		</>
	)

	const renderGuestButtons = () => (
		<>
			<BaseButton
				button={logButtonProps}
				onButtonClick={() => setMenuOpen(false)}
			/>
			<BaseButton
				button={regButtonProps}
				onButtonClick={() => setMenuOpen(false)}
			/>
		</>
	)

	return (
		<>
			<header className='fixed top-0 w-full bg-gradient-to-t from-gray-700 to-indigo-500 z-50'>
				<div className='flex items-center justify-between px-5 h-20'>
					{/* Лого */}
					<Link
						className='inline-block bg-shuttlecock_icon bg-no-repeat bg-left bg-cover h-16 w-16'
						to='/'
						onClick={() => setMenuOpen(false)}
					/>
					<span className='ml-2 text-white text-lg font-semibold md:hidden'>
						BadmickTogether
					</span>

					{/* Десктоп-меню (показувати за замовчуванням, ховати при ≤768px) */}
					<nav className='flex gap-3 md:hidden'>
						{isAuthenticated ? renderAuthButtons() : renderGuestButtons()}
					</nav>

					{/* Бургер-іконка (прихована за замовчуванням, показувати при ≤768px) */}
					<button
						type='button'
						aria-label='Toggle menu'
						onClick={() => setMenuOpen(!menuOpen)}
						className='hidden md:flex text-white'
					>
						{menuOpen ? <X size={32} /> : <Menu size={32} />}
					</button>
				</div>

				{/* Мобільне випадаюче меню (приховане за замовчуванням, показувати при ≤768px) */}
				{menuOpen && (
					<nav className='hidden md:flex flex-col gap-4 px-5 pb-6 bg-gradient-to-b from-indigo-500 to-gray-700'>
						{isAuthenticated ? renderAuthButtons() : renderGuestButtons()}
					</nav>
				)}
			</header>

			{/* Відступ під фіксовану шапку */}
			<div className='pt-20'>
				<Outlet />
			</div>
		</>
	)
}

export default TopBar
