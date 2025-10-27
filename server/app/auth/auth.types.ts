import { Request } from 'express'
import { Transaction } from 'sequelize'
export interface IUserRequest extends Request {
	user?: {
		id: number
		username: string
		isActive: boolean
	}
}

export interface IConfirmRegisterRequest extends Request {
	query: {
		token: string
	}
}

export interface IConfirmRegisterServiceData {
	token: string
}

export interface ISendEmailParams {
	to: string
	subject: string
	text: string
}

export interface IForgotPasswordServiceData {
	email: string
}

// resetPassword
export interface IResetPasswordServiceData {
	token: string
	newPassword: string
}

export interface CreateUserWithProfileOptions {
	email: string
	username: string
	passwordHash?: string
	googleId?: string
	isActive?: boolean
	transaction?: Transaction
	avatarUrl?: string
}
