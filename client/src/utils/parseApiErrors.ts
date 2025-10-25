import { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { FieldValues, Path, UseFormSetError } from 'react-hook-form'

interface ApiErrorResponse {
	errors?: Record<string, string[]>
	message?: string
}

export function parseApiError<T extends FieldValues>(
	error: unknown,
	setError?: UseFormSetError<T>,
	setErrorMessage?: (msg: string) => void
) {
	// RTK Query помилка
	if (typeof error === 'object' && error !== null && 'status' in error) {
		const apiError = (error as FetchBaseQueryError).data as ApiErrorResponse

		if (apiError?.errors) {
			Object.entries(apiError.errors).forEach(([field, messages]) => {
				if (Array.isArray(messages) && messages.length > 0) {
					setError?.(field as Path<T>, {
						type: 'server',
						message: messages[0],
					})
				}
			})

			return
		}

		if (apiError?.message) {
			setErrorMessage?.(apiError.message)
			return
		}
	}

	// Фолбек для будь-яких інших помилок
	setErrorMessage?.('Сталася невідома помилка. Спробуйте ще раз.')
}
