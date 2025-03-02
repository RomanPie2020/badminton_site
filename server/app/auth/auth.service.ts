import { BASE_URL } from '@/config/url'
import { logger } from '@/utils/logger/log'
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import nodemailer from 'nodemailer'
import User from './models/user'

class AuthService {
	async registerUser(email: string, username: string, password: string) {
		try {
			const hashedPassword = await bcrypt.hash(password, 10)
			logger.info(21)
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
				throw new Error('Invalid or missing email address for user')
			}

			// Надсилання листа із посиланням для підтвердження
			const confirmationLink = `${BASE_URL}/confirm?token=${token}`
			await this.sendEmail(
				newUser.email,
				'Підтвердження реєстрації',
				`Будь ласка, підтвердіть вашу реєстрацію, натиснувши на це посилання: ${confirmationLink}`
			)
			logger.info(`Лист надіслано до ${newUser.email}`)

			return newUser
		} catch (error) {
			logger.error('Помилка при реєстрації користувача: ', error)
			throw error
		}
	}

	async sendEmail(to, subject, text) {
		if (!to || typeof to !== 'string') {
			throw new Error('Recipient email is not defined or invalid')
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

	async confirmUser(token: string) {
		try {
			// Знаходимо користувача за confirmationToken
			const user = await User.findOne({ where: { confirmationToken: token } })

			if (!user) {
				logger.error('Користувача з таким токеном не знайдено')
				throw new Error('Invalid confirmation token')
			}

			// Перевіряємо, чи токен ще валідний (опціонально)
			if (!user.confirmationToken) {
				logger.error('Токен уже використано або видалено')
				throw new Error('Token has already been used')
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
			logger.error('Помилка при підтвердженні користувача:', {
				message: error.message,
				stack: error.stack,
			})
			throw error
		}
	}
}

export const authService = new AuthService()
