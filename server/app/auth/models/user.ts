import { DataTypes, Model } from 'sequelize'
import sequelize from '../../config/database'

class User extends Model {}

User.init(
	{
		username: {
			type: DataTypes.STRING,
			unique: true,
			allowNull: false,
		},
		email: {
			type: DataTypes.STRING,
			unique: true,
			allowNull: false,
		},
		firstName: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		lastName: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		isStaff: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},
		isActive: {
			type: DataTypes.BOOLEAN,
			defaultValue: true,
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		lastLogin: {
			type: DataTypes.DATE,
			allowNull: true,
		},
		dateJoined: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW,
		},
	},
	{
		sequelize,
		modelName: 'User',
		tableName: 'users',
	}
)

export default User
