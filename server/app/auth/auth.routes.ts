import { Router } from 'express'
import passport from 'passport'
import { isAuthorized } from '../middleware/authMiddleware'
import { authController } from './auth.controller'
import { registerValidate } from './middleware/registerValidate'
import { registerSchema } from './schemas/register.schema'

const router = Router()

router.post(
	'/api/auth/register',
	registerValidate(registerSchema),
	authController.register
)

router.get('/api/auth/confirm', authController.confirmRegister)
router.post('/api/auth/login', authController.login)
router.post('/api/auth/refresh', authController.refreshToken)
router.delete('/api/auth/logout', isAuthorized, authController.logout)
router.get('/api/auth/users', isAuthorized, authController.getUsers)
router.post('/api/auth/forgot-password', authController.forgotPassword)
router.patch('/api/auth/reset-password', authController.resetPassword)

router.get(
	'/auth/google',
	passport.authenticate('google', { scope: ['profile', 'email'] })
)
router.get(
	'/auth/google/callback',
	passport.authenticate('google', {
		session: false,
		failureRedirect: '/login',
	}),
	authController.googleCallback
)

export const authRouter = router
