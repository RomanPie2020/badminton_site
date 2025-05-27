import ApiError from '@/exceptions/apiError'
import { NextFunction, Request, Response } from 'express'
import { eventService } from './event.eventService'
import { EventAttributes } from './models/event'

class EventController {
	// 1) Повертає масив подій
	async getAllEvents(req: Request, res: Response, next: NextFunction) {
		try {
			const events = await eventService.getAll()
			res.json(events)
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

			const type = (req.query.type as string) || 'created'
			if (!['created', 'attending'].includes(type)) {
				throw ApiError.BadRequest('Невідомий тип подій')
			}

			const events = await eventService.getUserEvents(
				me,
				type as 'created' | 'attending'
			)
			res.json(events)
		} catch (err) {
			next(err)
		}
	}
}

export const eventController = new EventController()
