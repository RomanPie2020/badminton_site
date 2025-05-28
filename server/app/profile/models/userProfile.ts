import { DataTypes, Model, Optional } from 'sequelize'
import User from '../../auth/models/user'
import sequelize from '../../config/database'

interface UserProfileAttributes {
	id?: number
	userId: number

	nickname: string
	avatarUrl?: string | null
	city?: string | null
	age?: number | null
	gender?: string | null

	level?: string | null
	experienceMonths?: number | null
	dominantHand?: string | null
	preferredFormat?: string | null
	playFrequency?: string | null
	commonPlaces?: string[] | null
	playTime?: string | null

	bio?: string | null
	contact?: string | null

	rating?: number
	reviewsCount?: number

	createdAt?: Date
	updatedAt?: Date
}

type UserProfileCreationAttributes = Optional<UserProfileAttributes, 'id'>

class UserProfile
	extends Model<UserProfileAttributes, UserProfileCreationAttributes>
	implements UserProfileAttributes
{
	declare id: number
	declare userId: number

	declare nickname: string
	declare avatarUrl: string | null
	declare city: string | null
	declare age: number | null
	declare gender: string | null

	declare level: string | null
	declare experienceMonths: number | null
	declare dominantHand: string | null
	declare preferredFormat: string | null
	declare playFrequency: string | null
	declare commonPlaces: string[] | null
	declare playTime: string | null

	declare bio: string | null
	declare contact: string | null

	declare rating: number
	declare reviewsCount: number

	declare readonly createdAt: Date
	declare readonly updatedAt: Date
}

UserProfile.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		userId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: { model: 'users', key: 'id' },
			onDelete: 'CASCADE',
		},
		nickname: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		avatarUrl: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		city: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		age: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		gender: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		level: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		experienceMonths: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		dominantHand: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		preferredFormat: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		playFrequency: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		commonPlaces: {
			type: DataTypes.ARRAY(DataTypes.STRING),
			allowNull: true,
		},
		playTime: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		bio: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		contact: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		rating: {
			type: DataTypes.DECIMAL(3, 2),
			defaultValue: 0.0,
		},
		reviewsCount: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
		},
	},
	{
		sequelize,
		modelName: 'UserProfile',
		tableName: 'user_profiles',
		timestamps: true,
		underscored: true,
	}
)

UserProfile.belongsTo(User, { foreignKey: 'userId', as: 'user' })
User.hasOne(UserProfile, { foreignKey: 'userId', as: 'profile' })

export default UserProfile
