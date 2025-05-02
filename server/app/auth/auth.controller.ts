import { NextFunction, Request, Response } from 'express'
import ApiError from '../exceptions/apiError'

import { logger } from '@/utils/logger/log'
import { IConfirmRegisterRequest } from './auth.types'
import { authService } from './services/auth.authService'
import { tokenService } from './services/auth.tokenService'

export class AuthController {
	async register(req: Request, res: Response, next: NextFunction) {
		try {
			const { email, username, password } = req.body
			// Виклик сервісу для реєстрації користувача
			const newUser = await authService.registerUser(email, username, password)
			res.status(201).json(newUser)
		} catch (e) {
			next(e)
		}
	}
	async confirmRegister(
		req: IConfirmRegisterRequest,
		res: Response,
		next: NextFunction
	) {
		try {
			const { token } = req.query
			if (!token || typeof token !== 'string') {
				// res.status(400).json({ success: false, message: 'Token is required' })
				ApiError.BadRequest('Not confirm')
			}

			const result = await authService.confirmRegister({ token })
			res.status(200).json(result)
		} catch (e) {
			next(e)
		}
	}
	async login(req: Request, res: Response, next: NextFunction) {
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
		} catch (e) {
			next(e)
		}
	}

	async refreshToken(req: Request, res: Response, next: NextFunction) {
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
		} catch (e) {
			next(e)
		}
	}

	async logout(req: Request, res: Response, next: NextFunction) {
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
		} catch (e) {
			next(e)
		}
	}

	async getUsers(req: Request, res: Response, next: NextFunction) {
		try {
			const users = await authService.getUsers()
			res.status(200).json({ success: true, users })
		} catch (e) {
			next(e)
		}
	}

	async forgotPassword(req: Request, res: Response, next: NextFunction) {
		try {
			const { email } = req.body
			if (!email || typeof email !== 'string') {
				res.status(400).json({ success: false, message: 'Email is required' })
			}
			const result = await authService.forgotPassword({ email })
			res.status(200).json(result)
		} catch (e) {
			next(e)
		}
	}

	async resetPassword(req: Request, res: Response, next: NextFunction) {
		try {
			const { token } = req.query // #todo type
			const { password } = req.body
			if (typeof token !== 'string' || !token.trim() || !password) {
				res
					.status(400)
					.json({ success: false, message: 'Token and password are required' })
			}
			if (typeof token === 'string') {
				const result = await authService.resetPassword({
					token,
					newPassword: password,
				})
				res.status(200).json(result)
			}
		} catch (e) {
			next(e)
		}
	}

	// async googleLogin(req: Request, res: Response, next: NextFunction) {
	// 	try {
	// 		const url = oAuthService.generateGoogleAuthUrl()
	// 		res.redirect(url)
	// 	} catch (e) {
	// 		next(e)
	// 	}
	// }

	// async googleCallback(req: Request, res: Response, next: NextFunction) {
	// 	try {
	// 		const user = await oAuthService.handleGoogleCallback(req)
	// 		res.status(200).json({ message: 'Login successful', user })
	// 	} catch (e) {
	// 		next(e)
	// 	}
	// }
	async googleCallback(req: Request, res: Response, next: NextFunction) {
		try {
			// if (!req.user) {
			// 	res.status(401).json({ message: 'Автентифікація не вдалася' })
			// }
			logger.info('Отримані дані:', req.body)
			const accessToken = tokenService.generateAccessToken(req.user.id)
			const refreshToken = tokenService.generateRefreshToken()
			await tokenService.saveRefreshToken(req.user.id, refreshToken)

			res.status(200).json({
				message: 'Успішно увійшли через Google!',
				user: req.user,
				accessToken,
				refreshToken,
			})
			// res.redirect('/')
		} catch (e) {
			next(e)
		}
	}
}

export const authController = new AuthController()
