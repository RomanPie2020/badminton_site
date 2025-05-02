import { Router } from 'express'
import passport from 'passport'
import { authController } from './auth.controller'
import { authMiddleware } from './middleware/auth.authMiddleware'

const router = Router()

router.post('/api/auth/register', authController.register)
router.get('/api/auth/confirm', authController.confirmRegister)
router.post('/api/auth/login', authController.login)
router.post(
	'/api/auth/refresh',
	authMiddleware.isAuthorized.bind(authMiddleware),
	authController.refreshToken
)
router.delete(
	'/api/auth/logout',
	authMiddleware.isAuthorized.bind(authMiddleware),
	authController.logout
)
router.get(
	'/api/auth/users',
	authMiddleware.isAuthorized.bind(authMiddleware),
	authController.getUsers
)
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

router.get('/f', (req, res) => {
	res.send('<a href="/auth/google">Login with Google</a>')
})

export const authRouter = router
