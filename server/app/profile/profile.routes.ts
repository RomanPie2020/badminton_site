import { authMiddleware } from '@/middleware/auth.authMiddleware'
import { Router } from 'express'
import { profileController } from './profile.controllers'

const router = Router()

router.get(
	'/api/profile',
	authMiddleware.isAuthorized.bind(authMiddleware),
	profileController.getProfile
)
router.put(
	'/api/profile',
	authMiddleware.isAuthorized.bind(authMiddleware),
	profileController.updateProfile
)

export const profileRouter = router
