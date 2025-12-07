import ApiError from '@/exceptions/apiError'
import { NextFunction, RequestHandler } from 'express'
import { profileService } from './profile.profileService'

type TAsyncRequestHandler = (
	req: Request,
	res: Response,
	next: NextFunction
) => Promise<void>
// const test = (req: Request) => {
// 	req.user?.id
// }
class ProfileController {
	getProfile: RequestHandler<any, any, any, any, Record<string, any>> = async (
		req,
		res,
		next
	) => {
		try {
			if (req.user && req.user.id) {
				const profile = await profileService.getUserProfile(req.user.id)
				res.json(profile)
			}
		} catch (e) {
			next(e)
		}
	}

	updateProfile: RequestHandler = async (req, res, next) => {
		try {
			if (!req.user) {
				return next(ApiError.UnauthorizedError())
			}
			const profile = await profileService.updateUserProfile(
				req.user.id,
				req.body
			)
			res.json(profile)
		} catch (e) {
			next(e)
		}
	}

	getProfileById: RequestHandler = async (req, res, next) => {
		try {
			const userId = Number(req.params.id)
			if (isNaN(userId)) {
				throw ApiError.BadRequest('Невірний ID користувача')
			}
			const profile = await profileService.getUserProfileById(userId)
			res.json(profile)
		} catch (err) {
			next(err)
		}
	}
}

export const profileController = new ProfileController()
