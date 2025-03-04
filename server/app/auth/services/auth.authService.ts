import { BASE_URL } from '@/config/url'
import { logger } from '@/utils/logger/log'
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import nodemailer from 'nodemailer'
import ApiError from '../../exceptions/apiError'
import { SendEmailParams } from '../auth.types'
import User from '../models/user'
import { tokenService } from './auth.tokenService'

class AuthService {
	async registerUser(email: string, username: string, password: string) {
		try {
			const hashedPassword = await bcrypt.hash(password, 10)

			// Реєстрація користувача у базі даних
			const newUser = await User.create({
				email,
				username,
				password: hashedPassword,
			})
			logger.info(`Користувача ${username} успішно зареєстровано`)

			// Генерація токена підтвердження
			const token = crypto.randomBytes(20).toString('hex')
			newUser.confirmationToken = token
			await newUser.save()

			if (!newUser.email || typeof newUser.email !== 'string') {
				throw ApiError.BadRequest('Invalid or missing email address for user')
			}

			// Надсилання листа із посиланням для підтвердження
			const confirmationLink = `${BASE_URL}/api/auth/confirm?token=${token}`
			await this.sendEmail({
				to: newUser.email,
				subject: 'Підтвердження реєстрації',
				text: `Будь ласка, підтвердіть вашу реєстрацію, натиснувши на це посилання: ${confirmationLink}`,
			})
			logger.info(`Лист надіслано до ${newUser.email}`)

			return newUser
		} catch (error) {
			throw ApiError.BadRequest('Invalid or missing email address for user')
		}
	}

	async sendEmail({ to, subject, text }: SendEmailParams) {
		if (!to || typeof to !== 'string') {
			throw ApiError.BadRequest('Recipient email is not defined or invalid')
		}
		const transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: process.env.MAILER_USER,
				pass: process.env.MAILER_PASSWORD,
			},
			port: 465,
			secure: true, // Використовуй false для порту 587 з STARTTLS
			requireTLS: true,
		})
		logger.info(to)
		const mailOptions = {
			from: process.env.MAILER_USER,
			to,
			subject,
			text,
		}

		await transporter.sendMail(mailOptions)
	}

	async confirmRegister(token: string) {
		try {
			// Знаходимо користувача за confirmationToken
			const user = await User.findOne({ where: { confirmationToken: token } })

			if (!user) {
				throw ApiError.BadRequest('Invalid confirmation token')
			}

			// Перевіряємо, чи токен ще валідний (опціонально)
			if (!user.confirmationToken) {
				throw ApiError.BadRequest('Token has already been used')
			}

			// Оновлюємо isActive та очищаємо confirmationToken
			await user.update({
				isActive: true,
				confirmationToken: null, // Очищаємо токен після використання
			})

			logger.info(`Користувач з email ${user.email} успішно підтверджений`)
			return {
				success: true,
				message: 'Email successfully confirmed',
			}
		} catch (error) {
			throw ApiError.BadRequest('Помилка при підтвердженні користувача:')
		}
	}

	async loginUser(email: string, password: string) {
		try {
			const user = await User.findOne({ where: { email } })
			if (!user || !(await bcrypt.compare(password, user.password))) {
				throw ApiError.BadRequest('Invalid username or password')
			}

			if (!user.isActive) {
				throw ApiError.BadRequest('User is not activated')
			}

			const accessToken = tokenService.generateAccessToken(user.id)
			const refreshToken = tokenService.generateRefreshToken()
			await tokenService.saveRefreshToken(user.id, refreshToken)

			logger.info(`Користувач ${email} успішно увійшов`)
			return {
				accessToken,
				refreshToken,
				user: { id: user.id, username: user.username, email: user.email },
			}
		} catch (error) {
			throw ApiError.BadRequest('Login Error')
		}
	}
	async getUsers() {
		try {
			const users = await User.findAll({
				attributes: ['id', 'username', 'email', 'isActive'], // Виключаємо пароль
			})
			return users
		} catch (error) {
			throw ApiError.BadRequest('Error fetching users')
		}
	}
}

export const authService = new AuthService()
