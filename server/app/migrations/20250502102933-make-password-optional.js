export default {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.changeColumn('users', 'password', {
			type: Sequelize.STRING,
			allowNull: true, // Дозволити пусті значення
		})
	},
	down: async (queryInterface, Sequelize) => {
		await queryInterface.changeColumn('users', 'password', {
			type: Sequelize.STRING,
			allowNull: false, // Повернути обов’язковість поля
		})
	},
}
