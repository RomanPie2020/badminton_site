import { logger } from '@/utils/logger/log'

class AuthService {
	registerUser(user: any, password) {
		logger.info('yes')
		return user
	}
}

export const authService = new AuthService()
