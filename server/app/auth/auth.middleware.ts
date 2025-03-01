// const authenticateToken = (req, res, next) => {
// 	const authHeader = req.headers['authorization']
// 	const token = authHeader && authHeader.split(' ')[1]

// 	if (!token)
// 		return res.status(401).json({ message: 'Необхідно авторизуватися' })

// 	jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
// 		if (err)
// 			return res
// 				.status(403)
// 				.json({ message: 'Недійсний або прострочений токен' })
// 		req.user = user
// 		next()
// 	})
// }
