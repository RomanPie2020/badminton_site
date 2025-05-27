import { Router } from 'express'

import { isAuthorized } from '@/middleware/authMiddleware'
import { profileUpdateValidation } from './middleware/profileUpdateValidation'
import { profileController } from './profile.controllers'
import { updateProfileSchema } from './schemas/profile.schema'

const router = Router()

router.get('/api/profile', isAuthorized, profileController.getProfile)
router.put(
	'/api/profile',
	isAuthorized,
	profileUpdateValidation(updateProfileSchema),
	profileController.updateProfile
)

export const profileRouter = router
