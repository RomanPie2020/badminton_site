import { Request, Response } from 'express'
import ApiError from '../exceptions/apiError'
import { confirmRegisterRequest } from './auth.types'
import { authService } from './services/auth.authService'
import { tokenService } from './services/auth.tokenService'

export class AuthController {
	async register(req: Request, res: Response) {
		try {
			const { email, username, password } = req.body
			// Виклик сервісу для реєстрації користувача
			const newUser = await authService.registerUser(email, username, password)
			res.status(201).json(newUser)
		} catch (error) {
			throw ApiError.BadRequest('Error registering user')
		}
	}
	async confirmRegister(req: confirmRegisterRequest, res: Response) {
		try {
			const { token } = req.query
			if (!token || typeof token !== 'string') {
				// res.status(400).json({ success: false, message: 'Token is required' })
				ApiError.BadRequest('Not confirm')
			}

			const result = await authService.confirmRegister(token)
			res.status(200).json(result)
		} catch (error) {
			throw ApiError.BadRequest('Not confirm')
		}
	}
	async login(req: Request, res: Response) {
		try {
			const { email, password } = req.body
			if (!email || !password) {
				res.status(400).json({
					success: false,
					message: 'Username and password are required',
				})
			}
			const { accessToken, refreshToken, user } = await authService.loginUser(
				email,
				password
			)
			res.status(200).json({ success: true, accessToken, refreshToken, user })
		} catch (err) {
			throw ApiError.UnauthorizedError()
		}
	}

	async refreshToken(req: Request, res: Response) {
		try {
			const { refreshToken } = req.body
			if (!refreshToken || typeof refreshToken !== 'string') {
				res
					.status(400)
					.json({ success: false, message: 'Refresh token is required' })
			}
			const { accessToken, newRefreshToken } =
				await tokenService.refreshAccessToken(refreshToken)
			res
				.status(200)
				.json({ success: true, accessToken, refreshToken: newRefreshToken })
		} catch (error) {
			throw ApiError.UnauthorizedError()
		}
	}

	async logout(req: Request, res: Response) {
		try {
			const { refreshToken } = req.body
			if (!refreshToken || typeof refreshToken !== 'string') {
				res
					.status(400)
					.json({ success: false, message: 'Refresh token is required' })
			}
			await tokenService.logout(refreshToken)
			res
				.status(200)
				.json({ success: true, message: 'Logged out successfully' })
		} catch (error) {
			throw ApiError.UnauthorizedError()
		}
	}

	async getUsers(req: Request, res: Response) {
		try {
			const users = await authService.getUsers()
			res.status(200).json({ success: true, users })
		} catch (error) {
			throw ApiError.BadRequest('Error getting users')
		}
	}
}

export const authController = new AuthController()
