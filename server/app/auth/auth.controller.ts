import { logger } from '@/utils/logger/log'
import { Router } from 'express'
import { AuthService } from './auth.service'

const router = Router()

const authService = new AuthService()

router.post('/', (req, res) => {
	const user = authService.createUser(req.body)
	logger.info(user)

	res.status(201).json(user)
})

export const userRouter = router
