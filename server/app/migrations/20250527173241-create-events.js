import { DataTypes } from 'sequelize'
export default {
	up: async queryInterface => {
		await queryInterface.createTable('events', {
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true,
			},
			title: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			description: {
				type: DataTypes.TEXT,
				allowNull: true,
			},
			location: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			event_date: {
				type: DataTypes.DATE,
				allowNull: false,
			},
			max_participants: {
				type: DataTypes.INTEGER,
				allowNull: true,
			},
			creator_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: { model: 'users', key: 'id' },
				onDelete: 'CASCADE',
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
		await queryInterface.dropTable('events')
	},
}
