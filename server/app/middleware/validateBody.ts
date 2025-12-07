// middleware/validate.ts
import { RequestHandler } from 'express'
import { ZodSchema } from 'zod'

export const validateBody = (schema: ZodSchema): RequestHandler => {
	return (req, res, next) => {
		const result = schema.safeParse(req.body)
		if (!result.success) {
			const formatted = result.error.flatten().fieldErrors
			res.status(400).json({
				message: 'Validation error',
				errors: formatted,
			})
		}
		req.body = result.data // normalized values
		next()
	}
}
