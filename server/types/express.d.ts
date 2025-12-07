import 'express-serve-static-core'

interface UserPayload {
	id: number
	username: string
	isActive: boolean
}

declare module 'express-serve-static-core' {
	interface Request {
		user?: UserPayload
	}
}
