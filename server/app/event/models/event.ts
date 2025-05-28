import {
	Association,
	BelongsToManyAddAssociationMixin,
	BelongsToManyGetAssociationsMixin,
	BelongsToManyRemoveAssociationMixin,
	DataTypes,
	Model,
	Optional,
} from 'sequelize'
import User from '../../auth/models/user'
import sequelize from '../../config/database'

// Атрибути події
export interface EventAttributes {
	id: number
	title: string
	description?: string | null
	location: string // назва або адреса
	eventDate: Date | null // коли найчастіше
	maxParticipants?: number // скільки максимум
	creatorId: number // хто створив
	createdAt?: Date
	updatedAt?: Date
}

// Поля, що потрібні при створенні
interface EventCreationAttributes
	extends Optional<EventAttributes, 'id' | 'description' | 'maxParticipants'> {}

class EventModel
	extends Model<EventAttributes, EventCreationAttributes>
	implements EventAttributes
{
	declare id: number
	declare title: string
	declare description: string | null
	declare location: string
	declare eventDate: Date | null
	declare maxParticipants: number
	declare creatorId: number
	declare readonly createdAt: Date
	declare readonly updatedAt: Date

	// Міксини для зв’язку many-to-many з User
	declare addParticipant: BelongsToManyAddAssociationMixin<User, number>
	declare getParticipants: BelongsToManyGetAssociationsMixin<User>
	declare removeParticipant: BelongsToManyRemoveAssociationMixin<User, number>

	// Ассоціації
	static associations: {
		participants: Association<EventModel, User>
		creator: Association<EventModel, User>
	}
}

EventModel.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		title: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		description: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		location: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		eventDate: {
			type: DataTypes.DATE,
			allowNull: false,
			field: 'event_date',
		},
		maxParticipants: {
			type: DataTypes.INTEGER,
			allowNull: true,
			field: 'max_participants',
		},
		creatorId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			field: 'creator_id',
			references: { model: 'users', key: 'id' },
			onDelete: 'CASCADE',
		},
	},
	{
		sequelize,
		modelName: 'Event',
		tableName: 'events',
		underscored: true,
		timestamps: true,
	}
)

// Взаємозв’язки
EventModel.belongsTo(User, { as: 'creator', foreignKey: 'creatorId' })
User.hasMany(EventModel, { as: 'createdEvents', foreignKey: 'creatorId' })

// Таблиця учасників — many-to-many
EventModel.belongsToMany(User, {
	through: 'event_participants',
	as: 'participants',
	foreignKey: 'event_id',
})
User.belongsToMany(EventModel, {
	through: 'event_participants',
	as: 'attendingEvents',
	foreignKey: 'user_id',
})

export default EventModel
