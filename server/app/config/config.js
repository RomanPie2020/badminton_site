// require('dotenv').config()

const sslOptions = {
	ssl: {
		require: true,
		rejectUnauthorized: false,
	},
}

export default {
	development: {
		username: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_NAME,
		host: process.env.DB_HOST,
		port: process.env.DB_PORT,
		dialect: 'postgres',
		logging: false,
		// dialectOptions:
		// 	process.env.DB_HOST && process.env.DB_HOST !== 'localhost'
		// 		? sslOptions
		// 		: {},
	},
	test: {
		username: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_NAME,
		host: process.env.DB_HOST,
		port: process.env.DB_PORT,
		dialect: 'postgres',
		logging: false,
	},
	production: {
		username: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_NAME,
		host: process.env.DB_HOST,
		port: process.env.DB_PORT,
		dialect: 'postgres',
		logging: false,
		dialectOptions: sslOptions,
	},
}
