import { logger } from '@/utils/logger/log'
import cors from 'cors'
import express, { urlencoded } from 'express'

import { authRouter } from '@/auth/auth.routes'
import { errorHandler } from '@/middleware/auth.errorMiddleware'
import compression from 'compression'
import helmet from 'helmet'
import passport from 'passport'
import { oAuthService } from './app/auth/services/auth.oAuthService'
import sequelize from './app/config/database'

const app = express()

// Middleware
app.use(
	cors({
		origin: 'http://localhost:5173',
		credentials: true,
	})
)

app.use(express.json())
app.use(urlencoded({ extended: false }))
app.use(helmet())
app.use(compression())

//  Перевірка підключення до бази даних
const testDbConnection = async () => {
	try {
		await sequelize.authenticate()
		logger.info('Database connection has been established successfully12.')
	} catch (error) {
		logger.error('Unable to connect to the database:', error)
	}
}

// Тестовий роут
// app.get('/api/health', (req, res) => {
// 	res.json({ message: 'Server is running' })
// 	logger.info('Health check endpoint was called')
// })

oAuthService.configureGoogleStrategy(passport)
app.use(passport.initialize())

app.use(authRouter)

app.use(errorHandler)
app.all('*', (req, res) => {
	res.status(404).json({ message: 'Not found' })
})

const PORT = process.env.PORT || 3000

app.listen(PORT, async () => {
	logger.info(`Server is running on1 port ${PORT}`)
	await testDbConnection()
})
