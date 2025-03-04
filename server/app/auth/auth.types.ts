import { Request } from 'express'
export interface UserRequest extends Request {
	user?: {
		id: number
		username: string
		isActive: boolean
	}
}

export interface confirmRegisterRequest extends Request {
	query: {
		token: string
	}
}
export interface confirmRegisterServiceData {
	token: string
}

export interface SendEmailParams {
	to: string
	subject: string
	text: string
}
