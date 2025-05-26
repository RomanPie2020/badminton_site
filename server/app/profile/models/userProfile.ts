import { DataTypes, Model, Optional } from 'sequelize'
import User from '../../auth/models/user'
import sequelize from '../../config/database'

interface UserProfileAttributes {
	id?: number
	userId: number

	nickname: string
	avatarUrl?: string
	city?: string
	age?: number
	gender?: string

	level?: string
	experienceMonths?: number
	dominantHand?: string
	preferredFormat?: string
	playFrequency?: string
	commonPlaces?: string[]
	playTime?: string

	bio?: string
	contact?: string

	rating?: number
	reviewsCount?: number

	createdAt?: Date
	updatedAt?: Date
}

interface UserProfileCreationAttributes
	extends Optional<UserProfileAttributes, 'id'> {}

class UserProfile
	extends Model<UserProfileAttributes, UserProfileCreationAttributes>
	implements UserProfileAttributes
{
	declare id: number
	declare userId: number

	declare nickname: string
	declare avatarUrl: string
	declare city: string
	declare age: number
	declare gender: string

	declare level: string
	declare experienceMonths: number
	declare dominantHand: string
	declare preferredFormat: string
	declare playFrequency: string
	declare commonPlaces: string[]
	declare playTime: string

	declare bio: string
	declare contact: string

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
		avatarUrl: {
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
		experienceMonths: {
			type: DataTypes.INTEGER,
		},
		dominantHand: {
			type: DataTypes.STRING,
		},
		preferredFormat: {
			type: DataTypes.STRING,
		},
		playFrequency: {
			type: DataTypes.STRING,
		},
		commonPlaces: {
			type: DataTypes.ARRAY(DataTypes.STRING),
		},
		playTime: {
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
	}
)

UserProfile.belongsTo(User, { foreignKey: 'userId', as: 'user' })
User.hasOne(UserProfile, { foreignKey: 'userId', as: 'profile' })

export default UserProfile
