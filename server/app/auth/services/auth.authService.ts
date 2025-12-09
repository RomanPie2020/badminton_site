import { FRONT_URL } from '@/config/url'
import UserProfile from '@/profile/models/userProfile'
import { logger } from '@/utils/logger/log'
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import { Op } from 'sequelize'
import ApiError from '../../exceptions/apiError'
import {
	IConfirmRegisterServiceData,
	IForgotPasswordServiceData,
	IResetPasswordServiceData,
} from '../auth.types'
import User from '../models/user'
import { tokenService } from './auth.tokenService'

import sequelize from '../../config/database'
import { sendMailGmailAPI } from './googleAPIMailer'
class AuthService {
	async registerUser(email: string, username: string, password: string) {
		const t = await sequelize.transaction()
		try {
			// Перевірка валідності email
			if (!email || typeof email !== 'string') {
				throw ApiError.BadRequest('Invalid or missing email address')
			}

			// Генерація хешу пароля та токена підтвердження
			const hashedPassword = await bcrypt.hash(password, 10)
			const token = crypto.randomBytes(20).toString('hex')

			// Формування лінка для підтвердження
			const confirmationLink = `${FRONT_URL}/auth/confirm?token=${token}`
			logger.info(`Confirmation link for ${email}: ${confirmationLink}`)

			await sendMailGmailAPI(
				email,
				'Підтвердження реєстрації',
				`Будь ласка, підтвердіть вашу реєстрацію, натиснувши на це посилання: ${confirmationLink}`
			)
			// Старий код з використанням MailService
			// const mailService = new MailService()
			// await mailService			.sendEmail({
			// 	to: email,{}
			// 	subject: 'Registration confirmation',
			// 	text: `Your code: ${confirmationLink}`,
			// })

			// Спроба надіслати лист nodemailer
			// await this.sendEmail({
			// 	to: email,
			// 	subject: 'Підтвердження реєстрації',
			// 	text: `Будь ласка, підтвердіть вашу реєстрацію, натиснувши на це посилання: ${confirmationLink}`,
			// })
			logger.info(`Лист надіслано до ${email}`)

			// Якщо все ок — створюємо користувача
			const newUser = await User.create(
				{ email, username, password: hashedPassword, confirmationToken: token },
				{ transaction: t }
			)

			// Створюємо профіль у тій же транзакції
			await UserProfile.create(
				{ userId: newUser.id, nickname: username },
				{ transaction: t }
			)
			await t.commit()

			return newUser
		} catch (error: unknown) {
			await t.rollback()
			logger.error('Помилка при реєстрації користувача: ', error)
			throw ApiError.BadRequest('Не вдалося завершити реєстрацію')
		}
	}

	// async sendEmail({ to, subject, text }: ISendEmailParams) {
	// 	if (!to || typeof to !== 'string') {
	// 		throw ApiError.BadRequest('Recipient email is not defined or invalid')
	// 	}
	// 	const transporter = nodemailer.createTransport({
	// 		service: 'gmail',
	// 		auth: {
	// 			user: process.env.MAILER_USER,
	// 			pass: process.env.MAILER_PASSWORD,
	// 		},
	// 		port: 587,
	// 		secure: false,
	// 		logger: true,
	// 		connectionTimeout: 10000, // 10 seconds
	// 		greetingTimeout: 10000, // 10 seconds
	// 		socketTimeout: 10000, // 10 seconds
	// 	})
	// 	logger.info(to)
	// 	const mailOptions = {
	// 		from: process.env.MAILER_USER,
	// 		to,
	// 		subject,
	// 		text,
	// 	}

	// 	await transporter.sendMail(mailOptions)
	// }

	async confirmRegister({ token }: IConfirmRegisterServiceData) {
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

	async forgotPassword({ email }: IForgotPasswordServiceData) {
		try {
			const user = await User.findOne({ where: { email } })
			if (!user) {
				logger.error(`Користувача з email ${email} не знайдено`)
				throw ApiError.BadRequest('User with this email not found')
			}

			const resetToken = crypto.randomBytes(20).toString('hex')
			const resetTokenExpires = new Date(Date.now() + 3600000) // 1 година

			await user.update({
				passwordResetToken: resetToken,
				passwordResetExpires: resetTokenExpires,
			})

			const resetLink = `${FRONT_URL}/auth/reset-password?token=${resetToken}`
			await this.sendEmail({
				to: email,
				subject: 'Скидання пароля',
				text: resetLink,
			})

			logger.info(`Лист для скидання пароля надіслано до ${email}`)
			return { success: true, message: 'Reset link sent to email' }
		} catch (error) {
			throw ApiError.BadRequest('Помилка при запиті на скидання пароля')
		}
	}

	async resetPassword({ token, newPassword }: IResetPasswordServiceData) {
		try {
			const user = await User.findOne({
				where: {
					passwordResetToken: token,
					passwordResetExpires: { [Op.gt]: new Date() }, // Перевірка, чи токен не прострочений
				},
			})

			if (!user) {
				throw ApiError.BadRequest('Invalid or expired reset token')
			}

			const hashedPassword = await bcrypt.hash(newPassword, 10)
			await user.update({
				password: hashedPassword,
				passwordResetToken: null,
				passwordResetExpires: null,
			})

			logger.info(`Пароль для користувача ${user.email} успішно змінено`)
			return { success: true, message: 'Password reset successfully' }
		} catch (error) {
			throw ApiError.BadRequest('Помилка при скиданні пароля:')
		}
	}
}

export const authService = new AuthService()
