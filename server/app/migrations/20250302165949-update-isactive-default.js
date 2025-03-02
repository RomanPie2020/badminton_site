export default {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.changeColumn('users', 'isActive', {
			type: Sequelize.BOOLEAN,
			defaultValue: false,
		})
	},
	down: async (queryInterface, Sequelize) => {
		await queryInterface.changeColumn('users', 'isActive', {
			type: Sequelize.BOOLEAN,
			defaultValue: true,
		})
	},
}
