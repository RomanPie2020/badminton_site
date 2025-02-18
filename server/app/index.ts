import cors from 'cors'
import express from 'express'
import sequelize from './config/database'

const app = express()

// Middleware
app.use(express.json())
app.use(
	cors({
		origin: 'http://localhost:5173',
		credentials: true,
	})
)

// Тестовий роут
app.get('/api/health', (req, res) => {
	res.json({ message: 'Server is running' })
	console.log('Health check endpoint was called')
})

// Перевірка підключення до бази даних
const testDbConnection = async () => {
	try {
		await sequelize.authenticate()
		console.log('Database connection has been established successfully.')

		// Синхронізація моделей з базою даних (в продакшені краще використовувати міграції)
		await sequelize.sync({ alter: true })
		console.log('Database synchronized')
	} catch (error) {
		console.error('Unable to connect to the database:', error)
	}
}

const PORT = process.env.PORT || 3000

app.listen(PORT, async () => {
	console.log(`Server is running on port ${PORT}`)
	await testDbConnection()
})
