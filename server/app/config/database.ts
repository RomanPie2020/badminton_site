import { Sequelize } from 'sequelize'

const sequelize = new Sequelize({
	dialect: 'postgres',
	host: process.env.DB_HOST,
	port: Number(process.env.DB_PORT),
	username: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
	logging: false, // в продакшені краще вимкнути
})

export default sequelize
