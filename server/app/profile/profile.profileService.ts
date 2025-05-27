import User from '@/auth/models/user'
import ApiError from '@/exceptions/apiError'
import { camelToSnake, snakeToCamel } from '@/utils/caseConvert'
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
			return snakeToCamel(profile.dataValues)
		} catch (error) {
			throw ApiError.BadRequest('Не вдалося отримати профіль')
		}
	}

	async updateUserProfile(user_id: number, data: Partial<UserProfile>) {
		try {
			logger.info(`User IDservice: ${user_id}`)
			const profile = await UserProfile.findOne({ where: { user_id } })
			if (!profile) {
				throw ApiError.BadRequest('Профіль не знайдено')
			}
			logger.info({ service: 'updateUserProfile', data })

			logger.info(`profile service2  ${JSON.stringify(profile, null, 2)}`)
			logger.info('data service3: ' + JSON.stringify(data, null, 2))

			const snakeData = camelToSnake(data)
			const updateProfile = await profile.update(snakeData)

			// 2) отримуємо свіжий запис і конвертуємо в camelCase
			// const fresh = await UserProfile.findByPk(profile.id)
			// return snakeToCamel(fresh!.toJSON())
			return snakeToCamel(updateProfile.dataValues)
		} catch (error) {
			throw ApiError.BadRequest('Не вдалося оновити профіль')
		}
	}

	async getUserProfileById(userId: number) {
		// Перевіряємо, що користувач і профіль існують
		const user = await User.findByPk(userId, {
			attributes: ['id', 'username', 'email'], // при бажанні обмежити поля
		})
		if (!user) {
			throw ApiError.NotFound('Користувача не знайдено')
		}

		const profile = await UserProfile.findOne({
			where: { user_id: userId },
			attributes: { exclude: ['user_id'] },
		})
		// Якщо профіль ще не створений, можна повернути обʼєкт із дефолтами
		if (!profile) {
			return {
				id: user.id,
				username: user.username,
				// інші дефолтні значення...
			}
		}

		// Зливаємо дані з двох таблиць
		return {
			id: user.id,
			username: user.username,
			email: user.email, // або прибрати, якщо не публічно
			...profile.get({ plain: true }),
		}
	}
}
export const profileService = new ProfileService()
