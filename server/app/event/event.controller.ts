import ApiError from '@/exceptions/apiError'
import { NextFunction, Request, Response } from 'express'
import { eventService } from './event.eventService'
import { EventAttributes } from './models/event'

class EventController {
	// 1) Повертає масив подій
	async getFilteredEvents(req: Request, res: Response, next: NextFunction) {
		try {
			// Розбираємо query-параметри
			const {
				events: eventsParam,
				dateFrom: dateFromParam,
				dateTo: dateToParam,
				typeOfGame: gameParam,
				levelOfPlayers: levelParam,
			} = req.query

			// Будуємо об'єкт filters — перевіряємо, чи параметри задані й непусті
			const filters: {
				eventType?: string[]
				dateFrom?: string
				dateTo?: string
				gameType?: string[]
				levelOfPlayers?: string[]
			} = {}

			if (
				typeof eventsParam === 'string' &&
				eventsParam.trim() !== '' &&
				eventsParam.trim().toLowerCase() !== 'null'
			) {
				// розбиваємо рядок "Турнір,Тренування" → ['Турнір', 'Тренування']
				filters.eventType = eventsParam
					.split(',')
					.map(s => s.trim())
					.filter(s => s !== '' && s.toLowerCase() !== 'null')
			}

			// 2) Фільтр за датою: перевіряємо, чи це не рядок "null" і не порожній
			if (
				typeof dateFromParam === 'string' &&
				dateFromParam.trim() !== '' &&
				dateFromParam.trim().toLowerCase() !== 'null'
			) {
				filters.dateFrom = dateFromParam.trim()
			}

			if (
				typeof dateToParam === 'string' &&
				dateToParam.trim() !== '' &&
				dateToParam.trim().toLowerCase() !== 'null'
			) {
				filters.dateTo = dateToParam.trim()
			}

			// 3) Фільтр за типом гри (gameType)
			if (
				typeof gameParam === 'string' &&
				gameParam.trim() !== '' &&
				gameParam.trim().toLowerCase() !== 'null'
			) {
				filters.gameType = gameParam
					.split(',')
					.map(s => s.trim())
					.filter(s => s !== '' && s.toLowerCase() !== 'null')
			}

			// 4) Фільтр за рівнем гравців (levelOfPlayers)
			if (
				typeof levelParam === 'string' &&
				levelParam.trim() !== '' &&
				levelParam.trim().toLowerCase() !== 'null'
			) {
				filters.levelOfPlayers = levelParam
					.split(',')
					.map(s => s.trim())
					.filter(s => s !== '' && s.toLowerCase() !== 'null')
			}

			// Викликаємо сервіс із сформованими фільтрами
			const events = await eventService.getFiltered(filters)
			return res.json(events)
		} catch (err) {
			next(err)
		}
	}

	// 2) Деталі одного івенту (разом із creator та списком participants)
	async getEventById(req: Request, res: Response, next: NextFunction) {
		try {
			const id = Number(req.params.id)
			const event = await eventService.getById(id)
			res.json(event)
		} catch (err) {
			next(err)
		}
	}

	// 3) Створення нового івенту
	async createEvent(req: Request, res: Response, next: NextFunction) {
		try {
			const userId = req.user!.id
			const data = req.body // маємо вже validatied camelCase поля
			const newEvent = await eventService.create(userId, data)
			res.status(201).json(newEvent)
		} catch (err) {
			next(err)
		}
	}
	async updateEvent(req: Request, res: Response, next: NextFunction) {
		try {
			const userId = req.user!.id
			const eventId = Number(req.params.id)
			const data = req.body as Partial<EventAttributes>

			const updated = await eventService.update(userId, eventId, data)
			res.json(updated)
		} catch (err) {
			next(err)
		}
	}

	// 7) Видалення івенту
	async deleteEvent(req: Request, res: Response, next: NextFunction) {
		try {
			const userId = req.user!.id
			const eventId = Number(req.params.id)

			await eventService.remove(userId, eventId)
			res.status(204).end()
		} catch (err) {
			next(err)
		}
	}

	// 4) Приєднати користувача до івенту
	async joinEvent(req: Request, res: Response, next: NextFunction) {
		try {
			const userId = req.user!.id
			const eventId = Number(req.params.id)
			await eventService.addParticipant(eventId, userId)
			res.json({ success: true })
		} catch (err) {
			next(err)
		}
	}

	// 5) Вийти з івенту
	async leaveEvent(req: Request, res: Response, next: NextFunction) {
		try {
			const userId = req.user!.id
			const eventId = Number(req.params.id)
			await eventService.removeParticipant(eventId, userId)
			res.json({ success: true })
		} catch (err) {
			next(err)
		}
	}

	async getUserEvents(req: Request, res: Response, next: NextFunction) {
		try {
			const requestedUserId = Number(req.params.id)
			const me = req.user!.id

			// Дозволяємо лише собі
			if (requestedUserId !== me) {
				throw ApiError.Forbidden('Доступ заборонено')
			}

			// Тепер підтримуємо: created | attending | all
			const type = (req.query.type as string) || 'created'
			if (!['created', 'attending', 'all'].includes(type)) {
				throw ApiError.BadRequest('Невідомий тип подій')
			}

			const events = await eventService.getUserEvents(
				me,
				type as 'created' | 'attending' | 'all'
			)
			res.json(events)
		} catch (err) {
			next(err)
		}
	}
}

export const eventController = new EventController()
