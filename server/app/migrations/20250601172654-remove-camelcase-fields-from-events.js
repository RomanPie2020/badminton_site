import { DataTypes } from 'sequelize'

export default {
	up: async queryInterface => {
		// Видаляємо поля у camelCase
		await queryInterface.removeColumn('events', 'eventType')
		await queryInterface.removeColumn('events', 'gameType')
		await queryInterface.removeColumn('events', 'levelOfPlayers')
	},

	down: async queryInterface => {
		// Якщо відкотити цю міграцію, знову додаємо старі camelCase-колонки
		await queryInterface.addColumn('events', 'eventType', {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: 'Дружня гра', // або поставте значення за замовчуванням / змініть відповідно
		})
		await queryInterface.addColumn('events', 'gameType', {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: 'Одиночна',
		})
		await queryInterface.addColumn('events', 'levelOfPlayers', {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: 'Новачок',
		})
	},
}
