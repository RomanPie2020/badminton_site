import { authService } from './auth.authService'
import { tokenService } from './auth.tokenService'

export class AuthController {
	async register(req, res) {
		try {
			const { email, username, password } = req.body
			// Виклик сервісу для реєстрації користувача
			const newUser = await authService.registerUser(email, username, password)
			res.status(201).json(newUser)
		} catch (error) {
			res
				.status(500)
				.json({ message: 'Error registering user', error: error.message })
		}
	}
	async confirmRegister(req, res) {
		try {
			const { token } = req.query
			if (!token || typeof token !== 'string') {
				return res
					.status(400)
					.json({ success: false, message: 'Token is required' })
			}

			const result = await authService.confirmUser(token)
			res.status(200).json(result)
		} catch (error) {
			res.status(500).json({ success: false, message: error.message })
		}
	}
	async login(req, res) {
		try {
			const { email, password } = req.body
			if (!email || !password) {
				return res.status(400).json({
					success: false,
					message: 'Username and password are required',
				})
			}
			const { accessToken, refreshToken, user } = await authService.loginUser(
				email,
				password
			)
			res.status(200).json({ success: true, accessToken, refreshToken, user })
		} catch (error) {
			res.status(401).json({ success: false, message: error.message })
		}
	}

	async refreshToken(req, res) {
		try {
			const { refreshToken } = req.body
			if (!refreshToken || typeof refreshToken !== 'string') {
				return res
					.status(400)
					.json({ success: false, message: 'Refresh token is required' })
			}
			const { accessToken, newRefreshToken } =
				await tokenService.refreshAccessToken(refreshToken)
			res
				.status(200)
				.json({ success: true, accessToken, refreshToken: newRefreshToken })
		} catch (error) {
			res.status(401).json({ success: false, message: error.message })
		}
	}

	async logout(req, res) {
		try {
			const { refreshToken } = req.body
			if (!refreshToken || typeof refreshToken !== 'string') {
				return res
					.status(400)
					.json({ success: false, message: 'Refresh token is required' })
			}
			await tokenService.logout(refreshToken)
			res
				.status(200)
				.json({ success: true, message: 'Logged out successfully' })
		} catch (error) {
			res.status(401).json({ success: false, message: error.message })
		}
	}

	async getUsers(req, res) {
		try {
			const users = await authService.getUsers()
			res.status(200).json({ success: true, users })
		} catch (error) {
			res.status(500).json({ success: false, message: 'Internal server error' })
		}
	}
}

export const authController = new AuthController()
