import { logger } from '@/utils/logger/log'
import { ErrorRequestHandler } from 'express'
import ApiError from '../exceptions/apiError'

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
	logger.error('Error:', err.message)
	if (err instanceof ApiError) {
		next(res.status(err.status).json({ success: false, message: err.message }))
	}
	return next(res.status(500).json({ success: false, message: err.message }))
}
