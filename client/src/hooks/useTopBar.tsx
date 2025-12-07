import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLogOutMutation } from '../services/AuthService'
import { useAppSelector } from '../store/store'
import { useActions } from './useActions'

export function useTopBar() {
	const navigate = useNavigate()
	const { logOut } = useActions()
	const isAuthenticated = useAppSelector(
		state => state.authStatus.isAuthenticated
	)
	const [logOutUser] = useLogOutMutation()

	const [menuOpen, setMenuOpen] = useState(false)

	const handleLogout = useCallback(async () => {
		try {
			const refreshToken = localStorage.getItem('refresh_token')
			if (refreshToken) {
				await logOutUser({ refreshToken }).unwrap()
			}

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
	}, [logOutUser, logOut, navigate])

	// lock body scroll when menu is open
	useEffect(() => {
		document.body.classList.toggle('overflow-hidden', menuOpen)
	}, [menuOpen])

	return {
		isAuthenticated,
		menuOpen,
		setMenuOpen,
		handleLogout,
	}
}
