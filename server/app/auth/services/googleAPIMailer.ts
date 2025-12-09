import { google } from 'googleapis'

export async function sendMailGmailAPI(
	to: string,
	subject: string,
	message: string
) {
	const oAuth2Client = new google.auth.OAuth2(
		process.env.GOOGLE_CLIENT_ID,
		process.env.GOOGLE_CLIENT_SECRET,
		process.env.GOOGLE_REDIRECT_URI
	)

	oAuth2Client.setCredentials({
		refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
	})

	const gmail = google.gmail({ version: 'v1', auth: oAuth2Client })

	const encodedSubject = `=?UTF-8?B?${Buffer.from(subject).toString(
		'base64'
	)}?=`

	const emailMessage =
		`To: ${to}\r\n` +
		`Subject: ${encodedSubject}\r\n` +
		`Content-Type: text/html; charset=UTF-8\r\n\r\n` +
		`${message}`

	const encodedMessage = Buffer.from(emailMessage)
		.toString('base64')
		.replace(/\+/g, '-')
		.replace(/\//g, '_')
		.replace(/=+$/, '')

	await gmail.users.messages.send({
		userId: 'me',
		requestBody: {
			raw: encodedMessage,
		},
	})

	return true
}
