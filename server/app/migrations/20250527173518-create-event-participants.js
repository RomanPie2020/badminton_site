import { DataTypes } from 'sequelize'
export default {
	up: async queryInterface => {
		await queryInterface.createTable('event_participants', {
			event_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: { model: 'events', key: 'id' },
				onDelete: 'CASCADE',
				primaryKey: true,
			},
			user_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: { model: 'users', key: 'id' },
				onDelete: 'CASCADE',
				primaryKey: true,
			},
			created_at: {
				allowNull: false,
				type: DataTypes.DATE,
			},
			updated_at: {
				allowNull: false,
				type: DataTypes.DATE,
			},
		})
	},
	down: async queryInterface => {
		await queryInterface.dropTable('event_participants')
	},
}
