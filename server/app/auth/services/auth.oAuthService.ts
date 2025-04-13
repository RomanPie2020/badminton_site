import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'

class OAuthService {
	constructor(passport) {
		this.configureGoogleStrategy(passport)
		this.configureSerialization(passport)
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
	configureSerialization(passport) {
		passport.serializeUser((user, done) => {
			done(null, user.id)
		})

		passport.deserializeUser(async (id, done) => {
			try {
				const user = await this.findUserById(id) // Замініть на вашу логіку
				done(null, user)
			} catch (error) {
				done(error, null)
			}
		})
	}

	// Місце для вашої логіки пошуку/створення користувача
	async findOrCreateUser(profile) {
		// Замініть це на відповідну логіку
		console.log('Збереження/пошук користувача:', profile)
		return { id: profile.id, email: profile.emails[0].value } // Приклад
	}

	async findUserById(id) {
		// Замініть це на відповідну логіку
		console.log('Пошук користувача за ID:', id)
		return { id, email: 'example@example.com' } // Приклад
	}
}

export const oAuthService = new OAuthService(passport)

// generateAuthUrl(): string {
// 	const scopes = [
// 		'https://www.googleapis.com/auth/userinfo.profile',
// 		'https://www.googleapis.com/auth/userinfo.email',
// 	]
// 	return this.oauth2Client.generateAuthUrl({
// 		access_type: 'offline',
// 		scope: scopes,
// 	})
// }

// async getUserData(token: string): Promise<User> {
// 	const ticket = await this.oauth2Client.verifyIdToken({
// 		idToken: token,
// 		audience: googleOAuthConfig.clientId,
// 	})
// 	const payload = ticket.getPayload()

// 	if (!payload) {
// 		throw new Error('Invalid token')
// 	}

// 	const user: User = {
// 		id: payload.sub,
// 		email: payload.email,
// 		name: payload.name,
// 		picture: payload.picture,
// 	}

// 	return user
// }
