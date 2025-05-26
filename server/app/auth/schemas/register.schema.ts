import { z } from 'zod'

export const registerSchema = z.object({
	email: z.string().email(),
	username: z.string().min(3).max(32),
	password: z.string().min(6),
})

export type RegisterInput = z.infer<typeof registerSchema>
