import User from '@/auth/models/user'
import ApiError from '@/exceptions/apiError'
import UserProfile from '@/profile/models/userProfile'
import {
	default as Event,
	EventAttributes,
	default as EventModel,
} from './models/event'
class EventService {
	// 1) Отримати всі івенти разом із кількістю учасників
	async getAll() {
		return await Event.findAll({
			order: [['id', 'ASC']],
			include: [
				{
					// Творець події
					association: Event.associations.creator,
					attributes: ['id', 'username'],
					include: [
						{
							// Профіль користувача
							model: UserProfile,
							as: 'profile',
							attributes: ['nickname'],
						},
					],
				},
				{
					// Учасники події
					association: Event.associations.participants,
					attributes: ['id', 'username'],
					through: { attributes: [] },
					include: [
						{
							model: UserProfile,
							as: 'profile',
							attributes: ['nickname'],
						},
					],
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

	async getUserEvents(userId: number, type: 'created' | 'attending' | 'all') {
		// Перевіряємо, що юзер існує
		const user = await User.findByPk(userId)
		if (!user) throw ApiError.NotFound('Користувача не знайдено')

		if (type === 'all') {
			// 1) Отримуємо всі створені івенти
			const created = await this.getUserEvents(userId, 'created')

			// 2) Отримуємо всі івенти, в яких користувач бере участь
			const attending = await this.getUserEvents(userId, 'attending')

			// 3) Зливаємо два масиви та уникаємо дублікатів за id
			const combinedMap = new Map<number, EventModel>()
			for (const evt of created) {
				combinedMap.set(evt.id, evt)
			}
			for (const evt of attending) {
				combinedMap.set(evt.id, evt)
			}

			// 4) Повертаємо сортований за датою масив
			return Array.from(combinedMap.values()).sort(
				(a, b) => (a.eventDate?.getTime() ?? 0) - (b.eventDate?.getTime() ?? 0)
			)
		}

		if (type === 'created') {
			// Всі івенти, де я є creator
			return await Event.findAll({
				where: { creatorId: userId },
				order: [['event_date', 'ASC']],
				include: [
					{
						association: Event.associations.creator,
						attributes: ['id', 'username'],
						include: [
							{
								// Профіль користувача
								model: UserProfile,
								as: 'profile',
								attributes: ['nickname'],
							},
						],
					},
					{
						association: Event.associations.participants,
						attributes: ['id'],
						include: [
							{
								// Профіль користувача
								model: UserProfile,
								as: 'profile',
								attributes: ['nickname'],
							},
						],
					},
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
						include: [
							{
								// Профіль користувача
								model: UserProfile,
								as: 'profile',
								attributes: ['nickname'],
							},
						],
					},
					{
						association: Event.associations.participants,
						attributes: ['id'],
						include: [
							{
								// Профіль користувача
								model: UserProfile,
								as: 'profile',
								attributes: ['nickname'],
							},
						],
					},
				],
			})
		}
	}
}

export const eventService = new EventService()
