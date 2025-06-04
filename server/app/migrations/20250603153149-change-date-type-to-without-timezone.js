export default {
	up: async (queryInterface, Sequelize) => {
		// змінюємо тип колонки event_date у таблиці events
		await queryInterface.changeColumn('events', 'event_date', {
			type: 'TIMESTAMP WITHOUT TIME ZONE',
			allowNull: false,
		})
	},
	down: async (queryInterface, Sequelize) => {
		// якщо відкочувати, повертаємо назад у WITH TIME ZONE
		await queryInterface.changeColumn('events', 'event_date', {
			type: Sequelize.DATE, // з час. зоною за замовчуванням
			allowNull: false,
		})
	},
}
