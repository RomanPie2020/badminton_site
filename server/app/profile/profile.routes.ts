import { Router } from 'express'

import { isAuthorized } from '@/middleware/authMiddleware'
import { validateBody } from '@/middleware/validateBody'
import { profileController } from './profile.controllers'
import { updateProfileSchema } from './schemas/profile.schema'

const router = Router()

router.get('/api/profile', isAuthorized, profileController.getProfile)
router.put(
	'/api/profile',
	isAuthorized,
	validateBody(updateProfileSchema),
	profileController.updateProfile
)

router.get(
	'/api/users/:id/profile',
	isAuthorized,
	profileController.getProfileById
)

export const profileRouter = router
