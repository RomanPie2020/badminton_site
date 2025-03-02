import { Router } from 'express'
import { authController } from './auth.controller'

const router = Router()

router.post('/api/auth/register', authController.register)
router.get('/api/auth/confirm', authController.confirmRegister)
router.post('/api/auth/login', authController.login)
router.post('/api/auth/refresh', authController.refreshToken)
router.post('/api/auth/logout', authController.logout)

export const authRouter = router
