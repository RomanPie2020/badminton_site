// app/middleware/authMiddleware.ts
import User from '@/auth/models/user'
import { tokenService } from '@/auth/services/auth.tokenService'
import ApiError from '@/exceptions/apiError'
import { NextFunction, Request, Response } from 'express'

export const isAuthorized = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const authHeader = req.headers.authorization
		if (!authHeader || !authHeader.startsWith('Bearer ')) {
			throw ApiError.UnauthorizedError()
		}

		const token = authHeader.split(' ')[1]
		const payload = tokenService.verifyAccessToken(token)
		if (!payload) {
			throw ApiError.UnauthorizedError()
		}

		const user = await User.findByPk(payload.id)
		if (!user || !user.isActive) {
			throw ApiError.UnauthorizedError()
		}

		req.user = {
			id: user.id,
			username: user.username,
			isActive: user.isActive,
		}

		next()
	} catch (error) {
		next(error)
	}
}
