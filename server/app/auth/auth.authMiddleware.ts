import { logger } from '@/utils/logger/log'
import { NextFunction, Request, RequestHandler, Response } from 'express'
import { tokenService } from './auth.tokenService'
import User from './models/user'

class AuthMiddleware {
	isAuthorized: RequestHandler = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		try {
			const authHeader = req.headers.authorization
			if (!authHeader || !authHeader.startsWith('Bearer ')) {
				return next(new Error('No token provided or invalid format'))
			}

			const token = authHeader.split(' ')[1]
			const payload = tokenService.verifyAccessToken(token)

			if (!payload) {
				return next(new Error('Invalid or expired token'))
			}

			const user = await User.findByPk(payload.id)
			if (!user || !user.isActive) {
				return next(new Error('User is not registered or not activated'))
			}

			// Додаємо користувача до запиту для подальшого використання
			req.user = {
				id: user.id,
				username: user.username,
				isActive: user.isActive,
			}
			next()
		} catch (error) {
			logger.error('Authentication error:', error.message)
			next(error) // Передаємо помилку далі
		}
	}
}

export const authMiddleware = new AuthMiddleware()
