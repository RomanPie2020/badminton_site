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

// export type TAsyncRequestHandler = (
// 	req: Request,
// 	res: Response,
// 	next: NextFunction
// ) => Promise<void>
