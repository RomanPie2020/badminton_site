import { Sequelize } from 'sequelize'

const sequelizeConnect = new Sequelize({
	dialect: 'postgres',
	host: process.env.DB_HOST,
	port: Number(process.env.DB_PORT),
	username: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
	logging: false, // в продакшені краще вимкнути

	// ← Ось тут додаємо глобальні define-опції
	// define: {
	// 	underscored: true, // автоматично ставитиме snake_case для всіх полів
	// 	timestamps: true, // автоматично додаватиме created_at / updated_at
	// },
})

export default sequelizeConnect
