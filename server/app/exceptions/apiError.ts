class ApiError extends Error {
	status: number
	errors: any[]

	constructor(status: number, message: string, errors: any[] = []) {
		super(message)
		this.status = status
		this.errors = errors
		Object.setPrototypeOf(this, ApiError.prototype)
	}

	static BadRequest(message: string, errors: any[] = []) {
		return new ApiError(400, message, errors)
	}
	static UnauthorizedError() {
		return new ApiError(401, 'Повноваження не авторизовані')
	}
	static Forbidden(message: string, errors: any[] = []) {
		return new ApiError(403, message, errors)
	}
	static NotFound(message: string, errors: any[] = []) {
		return new ApiError(404, message, errors)
	}
}

export default ApiError
