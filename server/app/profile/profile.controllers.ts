import ApiError from '@/exceptions/apiError'
import { logger } from '@/utils/logger/log'
import { NextFunction, Request, Response } from 'express'
import { profileService } from './profile.profileService'

class ProfileController {
	async getProfile(req: Request, res: Response, next: NextFunction) {
		try {
			const profile = await profileService.getUserProfile(req?.user?.id)
			res.json(profile)
		} catch (e) {
			next(e)
		}
	}

	updateProfile = async (req: Request, res: Response, next: NextFunction) => {
		try {
			if (!req.user) {
				return next(ApiError.UnauthorizedError())
			}
			logger.info(`User ID: ${req.user.id}`)
			logger.info({ service: 'user body', body: req.body })
			const profile = await profileService.updateUserProfile(
				req.user.id,
				req.body
			)
			res.json(profile)
		} catch (e) {
			next(e)
		}
	}

	async getProfileById(req: Request, res: Response, next: NextFunction) {
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
