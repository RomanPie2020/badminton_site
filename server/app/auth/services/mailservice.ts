import ApiError from '@/exceptions/apiError'
import { logger } from '@/utils/logger/log'
import { Resend } from 'resend'
import { ISendEmailParams } from '../auth.types'

export default class MailService {
	private resend: Resend

	constructor() {
		this.resend = new Resend(process.env.RESEND_API_KEY)
	}

	async sendEmail({ to, subject, text }: ISendEmailParams) {
		if (!to || typeof to !== 'string') {
			throw ApiError.BadRequest('Recipient email is not defined or invalid')
		}

		logger.info(`Sending email to: ${to}`)

		const { error } = await this.resend.emails.send({
			from: 'Acme <onboarding@resend.dev>',
			to,
			subject,
			text,
		})

		if (error) {
			logger.error('Resend error: ' + error.message)
			throw ApiError.BadRequest('Email sending error: ' + error.message)
		}
	}
}
