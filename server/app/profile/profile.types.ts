// auth.types.ts

import { Request } from 'express'

export interface IProfilePayload {
	id: number
	username: string
	isActive: boolean
}

export interface IProfileRequest extends Request {
	user: IProfilePayload
}
