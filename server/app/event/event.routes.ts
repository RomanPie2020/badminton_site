import { isAuthorized } from '@/middleware/authMiddleware'
import { validateBody } from '@/middleware/validateBody'
import { Router } from 'express'
import { eventController } from './event.controller'
import { eventSchema } from './schemas/event.schema'

const router = Router()

// Список всіх івентів (public)
router.get('/api/events', eventController.getAllEvents)

// Деталі конкретного івенту (public)
router.get('/api/events/:id', eventController.getEventById)

// Створити новий івент (тільки авторизовані)
router.post(
	'/api/events',
	isAuthorized,
	validateBody(eventSchema),
	eventController.createEvent
)
// Оновити івент (тільки той, хто створив)
router.put(
	'/api/events/:id',
	isAuthorized,
	validateBody(eventSchema.partial()),
	eventController.updateEvent
)

// Видалити івент (тільки той, хто створив)
router.delete('/api/events/:id', isAuthorized, eventController.deleteEvent)

// Приєднатися до івенту
router.post('/api/events/:id/join', isAuthorized, eventController.joinEvent)

// Вийти з івенту
router.post('/api/events/:id/leave', isAuthorized, eventController.leaveEvent)

router.get('/api/events/user/:id/', isAuthorized, eventController.getUserEvents)

export const eventRouter = router
