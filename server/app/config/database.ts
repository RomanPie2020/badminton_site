import { Sequelize } from 'sequelize'

const sequelizeConnect = new Sequelize({
	dialect: 'postgres',
	host: process.env.DB_HOST,
	port: Number(process.env.DB_PORT),
	username: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
	logging: false,
	// dialectOptions:
	// 	process.env.DB_HOST && process.env.DB_HOST !== 'localhost'
	// 		? {
	// 				ssl: {
	// 					require: true,
	// 					rejectUnauthorized: false,
	// 				},
	// 		  }
	// 		: {},

	// define: {
	// 	underscored: true, // автоматично ставитиме snake_case для всіх полів
	// 	timestamps: true, // автоматично додаватиме created_at / updated_at
	// },
})

export default sequelizeConnect
