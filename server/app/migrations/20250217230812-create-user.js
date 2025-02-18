export default {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('users', {
			id: {
				type: Sequelize.INTEGER,
				autoIncrement: true,
				primaryKey: true,
			},
			username: {
				type: Sequelize.STRING,
				unique: true,
				allowNull: false,
			},
			email: {
				type: Sequelize.STRING,
				unique: true,
				allowNull: false,
			},
			firstName: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			lastName: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			isStaff: {
				type: Sequelize.BOOLEAN,
				defaultValue: false,
			},
			isActive: {
				type: Sequelize.BOOLEAN,
				defaultValue: true,
			},
			password: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			lastLogin: {
				type: Sequelize.DATE,
				allowNull: true,
			},
			dateJoined: {
				type: Sequelize.DATE,
				defaultValue: Sequelize.NOW,
			},
			createdAt: {
				type: Sequelize.DATE,
				defaultValue: Sequelize.NOW,
			},
			updatedAt: {
				type: Sequelize.DATE,
				defaultValue: Sequelize.NOW,
			},
		})
	},

	down: async queryInterface => {
		await queryInterface.dropTable('users')
	},
}
