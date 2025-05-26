import { NextFunction, RequestHandler, Response } from 'express'
import { IUserRequest } from '../auth/auth.types'
import User from '../auth/models/user'
import { tokenService } from '../auth/services/auth.tokenService'
import ApiError from '../exceptions/apiError'

class AuthMiddleware {
	isAuthorized: RequestHandler = async (
		req: IUserRequest,
		res: Response,
		next: NextFunction
	) => {
		try {
			const authHeader = req.headers.authorization
			if (!authHeader || !authHeader.startsWith('Bearer ')) {
				return next(ApiError.UnauthorizedError())
			}

			const token = authHeader.split(' ')[1]
			const payload = tokenService.verifyAccessToken(token)

			if (!payload) {
				return next(ApiError.UnauthorizedError())
			}

			const user = await User.findByPk(payload.id)
			if (!user || !user.isActive) {
				return next(ApiError.UnauthorizedError())
			}

			// Додаємо користувача до запиту для подальшого використання
			req.user = {
				id: user.id,
				username: user.username,
				isActive: user.isActive,
			}
			next()
		} catch (error) {
			next(ApiError.UnauthorizedError())
		}
	}
}

export const authMiddleware = new AuthMiddleware()
