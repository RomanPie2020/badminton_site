import { Router } from 'express'
import { authController } from './auth.controller'

const router = Router()

router.post('/api/auth/register', authController.register)

export const authRouter = router
