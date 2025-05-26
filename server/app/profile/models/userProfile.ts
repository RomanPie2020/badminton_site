import { DataTypes, Model, Optional } from 'sequelize'
import User from '../../auth/models/user'
import sequelize from '../../config/database'

interface UserProfileAttributes {
	id?: number
	user_id: number

	nickname: string
	avatar_url?: string
	city?: string
	age?: number
	gender?: string

	level?: string
	experience_months?: number
	dominant_hand?: string
	preferred_format?: string
	play_frequency?: string
	common_places?: string[]
	play_time?: string

	bio?: string
	contact?: string

	rating?: number
	reviews_count?: number

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
	declare user_id: number

	declare nickname: string
	declare avatar_url: string
	declare city: string
	declare age: number
	declare gender: string

	declare level: string
	declare experience_months: number
	declare dominant_hand: string
	declare preferred_format: string
	declare play_frequency: string
	declare common_places: string[]
	declare play_time: string

	declare bio: string
	declare contact: string

	declare rating: number
	declare reviews_count: number

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
		user_id: {
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
	},
	{
		sequelize,
		modelName: 'UserProfile',
		tableName: 'user_profiles',
		timestamps: true,
		underscored: true,
	}
)

UserProfile.belongsTo(User, { foreignKey: 'user_id', as: 'user' })
User.hasOne(UserProfile, { foreignKey: 'user_id', as: 'profile' })

export default UserProfile
