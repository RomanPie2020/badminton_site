import { DataTypes, Model, Optional } from 'sequelize'
import sequelize from '../../config/database'

// Інтерфейс для атрибутів моделі
interface UserAttributes {
	id?: number
	username: string
	email: string
	firstName?: string
	lastName?: string
	isStaff?: boolean
	isActive?: boolean
	password: string
	lastLogin?: Date
	dateJoined?: Date
	createdAt?: Date
	updatedAt?: Date
	confirmationToken?: string | null // Явно вказуємо, що може бути null
	passwordResetToken?: string | null
	passwordResetExpires?: Date | null
	refreshToken?: string | null
}

// Інтерфейс для створення (опціональні поля, якщо потрібно)
interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

class User extends Model<UserAttributes, UserCreationAttributes> {
	// Оголошуємо всі атрибути як частини інстансу
	declare id: number
	declare username: string
	declare email: string
	declare firstName: string | null
	declare lastName: string | null
	declare isStaff: boolean
	declare isActive: boolean
	declare password: string
	declare lastLogin: Date | null
	declare dateJoined: Date
	declare createdAt: Date
	declare updatedAt: Date
	declare confirmationToken: string | null
	declare passwordResetToken: string | null
	declare passwordResetExpires: Date | null
	declare refreshToken: string | null
}

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
			defaultValue: false,
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
		createdAt: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW,
		},
		updatedAt: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW,
		},
		confirmationToken: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		passwordResetToken: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		passwordResetExpires: {
			type: DataTypes.DATE,
			allowNull: true,
		},
		refreshToken: {
			type: DataTypes.STRING,
			allowNull: true,
		},
	},
	{
		sequelize,
		modelName: 'User',
		tableName: 'users',
		timestamps: true,
	}
)

export default User
