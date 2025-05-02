export default {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.addColumn('users', 'googleId', {
			type: Sequelize.STRING,
			allowNull: true,
		})
	},
	down: async (queryInterface, Sequelize) => {
		await queryInterface.removeColumn('users', 'googleId')
	},
}
