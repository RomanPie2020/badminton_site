// src/migrations/20250602-add-snake-case-fields-to-events.js
import { DataTypes } from 'sequelize'

export default {
	up: async queryInterface => {
		// Додаємо колонку event_type (snake_case)
		await queryInterface.addColumn('events', 'event_type', {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: 'Дружня гра', // або змініть на NULL, якщо хочете дозволити пусте
		})

		// Додаємо колонку game_type
		await queryInterface.addColumn('events', 'game_type', {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: 'Одиночна',
		})

		// Додаємо колонку level_of_players
		await queryInterface.addColumn('events', 'level_of_players', {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: 'Новачок',
		})
	},

	down: async queryInterface => {
		// Видаляємо колонку level_of_players
		await queryInterface.removeColumn('events', 'level_of_players')

		// Видаляємо колонку game_type
		await queryInterface.removeColumn('events', 'game_type')

		// Видаляємо колонку event_type
		await queryInterface.removeColumn('events', 'event_type')
	},
}
