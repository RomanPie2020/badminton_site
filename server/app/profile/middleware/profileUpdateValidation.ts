// middleware/validate.ts
import { NextFunction, Request, Response } from 'express'
import { ZodSchema } from 'zod'

export const profileUpdateValidation = (schema: ZodSchema) => {
	return (req: Request, res: Response, next: NextFunction) => {
		const result = schema.safeParse(req.body)
		if (!result.success) {
			const formatted = result.error.flatten().fieldErrors
			res.status(400).json({
				message: 'Validation error',
				errors: formatted,
			})
		}
		req.body = result.data // нормалізовані значення
		next()
	}
}
