import { DataTypes } from 'sequelize'

export default {
	up: async queryInterface => {
		// Додаємо поле eventType
		await queryInterface.addColumn('events', 'eventType', {
			type: DataTypes.STRING,
			allowNull: false,
		})

		// Додаємо поле gameType
		await queryInterface.addColumn('events', 'gameType', {
			type: DataTypes.STRING,
			allowNull: false,
		})

		// Додаємо поле levelOfPlayers
		await queryInterface.addColumn('events', 'levelOfPlayers', {
			type: DataTypes.STRING,
			allowNull: false,
		})
	},

	down: async queryInterface => {
		// Видаляємо поле levelOfPlayers
		await queryInterface.removeColumn('events', 'levelOfPlayers')

		// Видаляємо поле gameType
		await queryInterface.removeColumn('events', 'gameType')

		// Видаляємо поле eventType
		await queryInterface.removeColumn('events', 'eventType')
	},
}
