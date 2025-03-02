import { Router } from 'express'
import { authController } from './auth.controller'

const router = Router()

router.post('/api/auth/register', authController.registerUser)
router.get('/confirm', authController.confirmUser)

export const authRouter = router
