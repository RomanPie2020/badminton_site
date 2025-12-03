interface IFetchBaseQueryError {
	status: number | string
	data?: { message?: string } | string
	error?: string
}

export const getErrorMessage = (
	error: unknown,
	defaultMessage: string = 'An unknown error occurred. Try again.',
	status?: Boolean
): string => {
	if (!error) {
		return defaultMessage
	}

	const apiError = error as IFetchBaseQueryError
	const messageContent = (() => {
		if (
			apiError.data &&
			typeof apiError.data === 'object' &&
			'message' in apiError.data
		) {
			return apiError.data.message || defaultMessage
		}

		if (apiError.data && typeof apiError.data === 'string') {
			return apiError.data
		}

		if (apiError.error) {
			return apiError.error
		}

		if (error instanceof Error) {
			return error.message
		}
	})()

	if (status && apiError.status && apiError.status !== 'FETCH_ERROR') {
		return `[Error ${apiError.status}] ${messageContent}`
	}

	return messageContent || defaultMessage
}
