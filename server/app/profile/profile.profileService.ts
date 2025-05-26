import ApiError from '@/exceptions/apiError'
import { logger } from '@/utils/logger/log'
import UserProfile from './models/userProfile'

class ProfileService {
	async getUserProfile(user_id: number) {
		try {
			const profile = await UserProfile.findOne({ where: { user_id } })
			if (!profile) {
				logger.info('Профіль не знайдено для користувача з ID:', user_id)
				throw ApiError.BadRequest('Профіль не знайдено')
			}
			return profile
		} catch (error) {
			throw ApiError.BadRequest('Не вдалося отримати профіль')
		}
	}

	async updateUserProfile(user_id: number, data: Partial<UserProfile>) {
		try {
			const profile = await UserProfile.findOne({ where: { user_id } })
			if (!profile) {
				throw ApiError.BadRequest('Профіль не знайдено')
			}
			await profile.update(data)
			return profile
		} catch (error) {
			throw ApiError.BadRequest('Не вдалося оновити профіль')
		}
	}
}
export const profileService = new ProfileService()
