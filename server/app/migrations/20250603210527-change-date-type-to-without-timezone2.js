// migrations/20250609_change_event_date_to_timestamp_without_tz.js
export default {
	up: async (queryInterface, Sequelize) => {
		// Явно замінюємо тип колонки на «без часової зони»
		await queryInterface.sequelize.query(`
      ALTER TABLE events
      ALTER COLUMN event_date
      TYPE timestamp without time zone
      USING event_date AT TIME ZONE 'UTC'
    `)
	},
	down: async (queryInterface, Sequelize) => {
		// А якщо відкочувати – повертаємо на timestamptz
		await queryInterface.sequelize.query(`
      ALTER TABLE events
      ALTER COLUMN event_date
      TYPE timestamp with time zone
      USING event_date AT TIME ZONE 'Europe/Kyiv'
    `)
	},
}
