import ApiError from '@/exceptions/apiError'
import UserProfile from '@/profile/models/userProfile'
import { logger } from '@/utils/logger/log'
import passport, { PassportStatic, Profile } from 'passport'
import {
	Strategy as GoogleStrategy,
	VerifyCallback,
} from 'passport-google-oauth20'
import sequelize from '../../config/database'
import User from '../models/user'

class OAuthService {
	constructor(passport: PassportStatic) {
		this.configureGoogleStrategy(passport)
		// this.configureSerialization(passport)
	}

	// Метод для налаштування Google Strategy
	configureGoogleStrategy(passport: PassportStatic) {
		passport.use(
			new GoogleStrategy(
				{
					clientID: process.env.GOOGLE_CLIENT_ID ?? '',
					clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
					callbackURL: process.env.GOOGLE_CALLBACK_URL ?? '',
				},
				async (
					accessToken: string,
					refreshToken: string,
					profile: Profile,
					done: VerifyCallback
				) => {
					try {
						// Приклад обробки профілю користувача
						const user = await this.findOrCreateUser(profile)
						return done(null, user)
					} catch (error) {
						return done(error)
					}
				}
			)
		)
	}

	async findOrCreateUser(profile: Profile) {
		try {
			const email = profile.emails?.[0]?.value
			if (!email) {
				throw ApiError.BadRequest('Email не знайдено у Google профілі')
			}
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
				isActive: user.isActive,
			}
		} catch (error) {
			throw ApiError.BadRequest('Помилка при вході через Google')
		}
	}
}
export const oAuthService = new OAuthService(passport)
