import User from '@/auth/models/user'
import ApiError from '@/exceptions/apiError'
import Event, { EventAttributes } from './models/event'
class EventService {
	// 1) Отримати всі івенти разом із кількістю учасників
	async getAll() {
		return await Event.findAll({
			order: [['id', 'ASC']],

			include: [
				{
					association: Event.associations.creator,
					attributes: ['id', 'username'],
				},
				{
					association: Event.associations.participants,
					attributes: ['id'],
					through: { attributes: [] }, // без лишніх полів join
				},
			],
		})
	}

	// 2) Отримати один івент з деталями
	async getById(id: number) {
		const event = await Event.findByPk(id, {
			include: [
				{
					association: Event.associations.creator,
					attributes: ['id', 'username'],
				},
				{
					association: Event.associations.participants,
					attributes: ['id', 'username'],
				},
			],
		})
		if (!event) throw ApiError.BadRequest('Івент не знайдено')
		return event
	}

	// 3) Створити івент
	async create(creatorId: number, data: Partial<Event>) {
		return await Event.create({ ...data, creatorId })
	}

	async update(
		userId: number,
		eventId: number,
		data: Partial<EventAttributes>
	) {
		const event = await Event.findByPk(eventId)
		if (!event) {
			throw ApiError.BadRequest('Івент не знайдено')
		}
		if (event.creatorId !== userId) {
			throw ApiError.Forbidden('Ви не можете редагувати цей івент')
		}

		// фільтруємо undefined/null
		const cleaned = Object.fromEntries(
			Object.entries(data).filter(([, v]) => v !== undefined && v !== null)
		)
		await event.update(cleaned)
		return event
	}

	// Видалити івент — тільки його творець
	async remove(userId: number, eventId: number) {
		const event = await Event.findByPk(eventId)
		if (!event) throw ApiError.BadRequest('Івент не знайдено')
		if (event.creatorId !== userId)
			throw ApiError.Forbidden('Ви не можете видалити цей івент')

		await event.destroy()
	}
	// 4) Додати учасника
	async addParticipant(eventId: number, userId: number) {
		const event = await Event.findByPk(eventId)
		if (!event) {
			throw ApiError.NotFound('Івент не знайдено')
		}
		await event.addParticipant(userId)
	}

	// 5) Видалити учасника
	async removeParticipant(eventId: number, userId: number) {
		const event = await Event.findByPk(eventId)
		if (!event) {
			throw ApiError.NotFound('Івент не знайдено')
		}
		await event.removeParticipant(userId)
	}

	//  @param userId – ID поточного користувача
	// @param type   – 'created' | 'attending'

	async getUserEvents(userId: number, type: 'created' | 'attending') {
		// Перевіряємо, що юзер існує
		const user = await User.findByPk(userId)
		if (!user) throw ApiError.NotFound('Користувача не знайдено')

		if (type === 'created') {
			// Всі івенти, де я є creator
			return await Event.findAll({
				where: { creatorId: userId },
				order: [['event_date', 'ASC']],
				include: [
					{ association: Event.associations.participants, attributes: ['id'] },
				],
			})
		} else {
			// Всі івенти, до яких я приєднався
			return await user.getAttendingEvents({
				order: [['event_date', 'ASC']],
				joinTableAttributes: [], // не тягнути поля з event_participants
				include: [
					{
						association: Event.associations.creator,
						attributes: ['id', 'username'],
					},
				],
			})
		}
	}
}

export const eventService = new EventService()
