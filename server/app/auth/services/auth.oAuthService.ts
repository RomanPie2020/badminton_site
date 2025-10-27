import ApiError from '@/exceptions/apiError'
import UserProfile from '@/profile/models/userProfile'
import { logger } from '@/utils/logger/log'
import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import sequelize from '../../config/database'
import User from '../models/user'

class OAuthService {
	constructor(passport) {
		this.configureGoogleStrategy(passport)
		// this.configureSerialization(passport)
	}

	// Метод для налаштування Google Strategy
	configureGoogleStrategy(passport) {
		passport.use(
			new GoogleStrategy(
				{
					clientID: process.env.GOOGLE_CLIENT_ID,
					clientSecret: process.env.GOOGLE_CLIENT_SECRET,
					callbackURL: process.env.GOOGLE_CALLBACK_URL,
				},
				async (accessToken, refreshToken, profile, done) => {
					try {
						// Приклад обробки профілю користувача
						const user = await this.findOrCreateUser(profile) // Замініть на вашу логіку
						return done(null, user)
					} catch (error) {
						return done(error, null)
					}
				}
			)
		)
	}

	// Метод для серіалізації користувача
	// configureSerialization(passport) {
	// 	passport.serializeUser((user, done) => {
	// 		done(null, user.id)
	// 	})

	// 	passport.deserializeUser(async (id, done) => {
	// 		try {
	// 			// const user = await this.findUserById(id) // Замініть на вашу логіку
	// 			done(null, user)
	// 		} catch (error) {
	// 			done(error, null)
	// 		}
	// 	})
	// }

	async findOrCreateUser(profile) {
		try {
			const email = profile.emails[0].value
			let user = await User.findOne({ where: { email } })
			const t = await sequelize.transaction()

			if (!user) {
				user = await User.create(
					{
						email,
						username: profile.displayName,
						googleId: profile.id,
						isActive: true,
					},
					{ transaction: t }
				)

				await UserProfile.create(
					{
						userId: user.id,
						nickname: profile.displayName,
						avatarUrl: profile.photos?.[0]?.value,
					},
					{ transaction: t }
				)
			} else if (!user.googleId) {
				user.googleId = profile.id
				await user.save()
			}
			await t.commit()
			logger.info(`Користувач ${user.email} успішно увійшов через Google`)

			return {
				id: user.id,
				username: user.username,
				email: user.email,
			}
		} catch (error) {
			throw ApiError.BadRequest('Помилка при вході через Google')
		}
	}

	// async findUserById(id) {
	// 	try {
	// 		const user = await User.findById(id)
	// 		if (!user) {
	// 			throw new Error('Користувача не знайдено')
	// 		}
	// 		return user
	// 	} catch (error) {
	// 		console.error('Помилка при пошуку користувача:', error)
	// 		throw error
	// 	}
	// }
}

export const oAuthService = new OAuthService(passport)
