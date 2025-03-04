import { logger } from '@/utils/logger/log'
import { ErrorRequestHandler, NextFunction, Request, Response } from 'express'
import ApiError from '../exceptions/apiError'

export const errorHandler: ErrorRequestHandler = (
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	logger.error('Error:', err.message)
	if (err instanceof ApiError) {
		return next(
			res.status(err.status).json({ success: false, message: err.message })
		)
	}
	return next(res.status(500).json({ success: false, message: err.message }))
}
