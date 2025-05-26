import { DataTypes } from 'sequelize'

export default {
	up: async queryInterface => {
		await queryInterface.createTable('user_profiles', {
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true,
			},
			user_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				unique: true,
				references: {
					model: 'users',
					key: 'id',
				},
				onDelete: 'CASCADE',
			},
			nickname: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			avatar_url: {
				type: DataTypes.STRING,
			},
			city: {
				type: DataTypes.STRING,
			},
			age: {
				type: DataTypes.INTEGER,
			},
			gender: {
				type: DataTypes.STRING,
			},
			level: {
				type: DataTypes.STRING,
			},
			experience_months: {
				type: DataTypes.INTEGER,
			},
			dominant_hand: {
				type: DataTypes.STRING,
			},
			preferred_format: {
				type: DataTypes.STRING,
			},
			play_frequency: {
				type: DataTypes.STRING,
			},
			common_places: {
				type: DataTypes.ARRAY(DataTypes.STRING),
			},
			play_time: {
				type: DataTypes.STRING,
			},
			bio: {
				type: DataTypes.TEXT,
			},
			contact: {
				type: DataTypes.STRING,
			},
			rating: {
				type: DataTypes.DECIMAL(3, 2),
				defaultValue: 0.0,
			},
			reviews_count: {
				type: DataTypes.INTEGER,
				defaultValue: 0,
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
		await queryInterface.dropTable('user_profiles')
	},
}
