import ApiError from '@/exceptions/apiError'
import { logger } from '@/utils/logger/log'
import nodemailer from 'nodemailer'
import { ISendEmailParams } from '../auth.types'

export default class BrevoMailService {
	private transporter

	constructor() {
		this.transporter = nodemailer.createTransport({
			host: process.env.BREVO_SMTP_HOST,
			port: Number(process.env.BREVO_SMTP_PORT),
			secure: false, // важливо! Brevo на 587 = TLS STARTTLS
			auth: {
				user: process.env.BREVO_SMTP_USER,
				pass: process.env.BREVO_SMTP_PASS,
			},
			logger: true,
		})
	}

	async sendEmail({ to, subject, text }: ISendEmailParams) {
		if (!to || typeof to !== 'string') {
			throw ApiError.BadRequest('Recipient email is not defined or invalid')
		}

		logger.info(`Sending email via Brevo to: ${to}`)

		try {
			await this.transporter.sendMail({
				from: process.env.MAIL_FROM,
				to,
				subject,
				text,
			})
		} catch (err: any) {
			logger.error('Brevo send error: ' + err.message)
			throw ApiError.BadRequest('Email sending error: ' + err.message)
		}
	}
}
