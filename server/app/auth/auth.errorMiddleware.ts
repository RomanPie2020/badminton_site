import { logger } from '@/utils/logger/log'
import ApiError from './exceptions/apiError'
import { ErrorRequestHandler, NextFunction } from 'express'


export const errorHandler: ErrorRequestHandler =
	(
		err: Error,
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		logger.error('Error:', err.message)
		if (err instanceof ApiError) {
			return res
				.status(err.status)
				.json({ success: false, message: err.message })
		}
		return res.status(500).json({ success: false, message: err.message })
	}
)