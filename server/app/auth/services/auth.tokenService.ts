import ApiError from '@/exceptions/apiError'
import { logger } from '@/utils/logger/log'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import User from '../models/user'

class TokenService {
	private readonly jwtSecret = process.env.JWT_SECRET || 'abar'
	private readonly accessTokenExpiresIn = '15m'
	private readonly refreshTokenExpiresIn = '1d'

	generateAccessToken(userId: number): string {
		return jwt.sign({ id: userId }, this.jwtSecret, {
			expiresIn: this.accessTokenExpiresIn,
		})
	}

	generateRefreshToken(): string {
		return crypto.randomBytes(40).toString('hex')
	}

	async saveRefreshToken(userId: number, refreshToken: string): Promise<void> {
		const user = await User.findByPk(userId)
		if (!user) {
			throw ApiError.BadRequest('User not found')
		}

		await user.update({ refreshToken })
		logger.info(`Refresh token saved for user ${userId}`)
	}

	verifyAccessToken(token: string): { id: number } | null {
		try {
			return jwt.verify(token, this.jwtSecret) as { id: number }
		} catch (error) {
			throw ApiError.BadRequest('Invalid access token:')
		}
	}

	async refreshAccessToken(
		refreshToken: string
	): Promise<{ accessToken: string; newRefreshToken?: string }> {
		const user = await User.findOne({ where: { refreshToken } })
		if (!user) {
			throw ApiError.BadRequest('Invalid refresh token')
		}

		const accessToken = this.generateAccessToken(user.id)
		const newRefreshToken = this.generateRefreshToken()
		await this.saveRefreshToken(user.id, newRefreshToken)

		return { accessToken, newRefreshToken }
	}

	async logout(refreshToken: string): Promise<void> {
		const user = await User.findOne({ where: { refreshToken } })
		if (!user) {
			throw ApiError.BadRequest('Invalid refresh token')
		}
		await user.update({ refreshToken: null })
		logger.info('User logged out')
	}
}

export const tokenService = new TokenService()
