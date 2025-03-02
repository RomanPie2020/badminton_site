import { authService } from './auth.service'

// authController.js
export class AuthController {
	async registerUser(req, res) {
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
	async confirmUser(req, res) {
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
}

export const authController = new AuthController()
