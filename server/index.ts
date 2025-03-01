import { logger } from '@/utils/logger/log'
import cors from 'cors'
import express from 'express'

import compression from 'compression'
import helmet from 'helmet'
import { userRouter } from './app/auth/auth.controller'
import sequelize from './app/config/database'

const app = express()

// Middleware
app.use(express.json())
app.use(
	cors({
		origin: 'http://localhost:5173',
		credentials: true,
	})
)

app.use(helmet())
app.use(compression())
// Перевірка підключення до бази даних
const testDbConnection = async () => {
	try {
		await sequelize.authenticate()
		logger.info('Database connection has been established successfully12.')

		// Синхронізація моделей з базою даних (в продакшені краще використовувати міграції)
		await sequelize.sync({ alter: true })
		logger.info('Database synchronized')
	} catch (error) {
		logger.error('Unable to connect to the database:', error)
	}
}

// Тестовий роут
// app.get('/api/health', (req, res) => {
// 	res.json({ message: 'Server is running' })
// 	logger.info('Health check endpoint was called')
// })

app.use('/api/user', userRouter)

const PORT = process.env.PORT || 3000

app.listen(PORT, async () => {
	logger.info(`Server is running on1 port ${PORT}`)
	await testDbConnection()
})
