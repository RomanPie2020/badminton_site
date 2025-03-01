import { authService } from './auth.service'

// authController.js
export class AuthController {
	async register(req, res) {
		try {
			const { username, password } = req.body
			// Виклик сервісу для реєстрації користувача
			const newUser = await authService.registerUser(username, password)
			res.status(201).json(newUser)
		} catch (error) {
			res
				.status(500)
				.json({ message: 'Error registering user', error: error.message })
		}
	}
}

export const authController = new AuthController()
