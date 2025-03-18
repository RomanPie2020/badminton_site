import {
	BaseQueryFn,
	FetchArgs,
	fetchBaseQuery,
	FetchBaseQueryError,
	FetchBaseQueryMeta,
} from '@reduxjs/toolkit/query/react'
import { apiUrl } from '../configs/url.config'
import { IRefreshTokenResponse } from '../shared/interfaces/models'
import { authStatusSliceActions } from '../store/authStatus.slice'

export const baseQueryWithReauth: BaseQueryFn<
	string | FetchArgs, // Аргументи (URL або об'єкт запиту)
	unknown, // Тип даних, які повертаються
	FetchBaseQueryError, // Тип помилки
	{}, // Опціональні додаткові опції
	FetchBaseQueryMeta // Метадані
> = async (args: any, api: any, extraOptions: any) => {
	// Базовий запит
	const baseQuery = fetchBaseQuery({
		baseUrl: apiUrl,
		prepareHeaders: headers => {
			const token = localStorage.getItem('access_token')
			if (token) {
				headers.set('Authorization', `Bearer ${token}`)
			}
			return headers
		},
	})

	let result = await baseQuery(args, api, extraOptions)

	// Якщо токен протермінувався (401 Unauthorized)
	if (result.error?.status === 401) {
		const refreshToken = localStorage.getItem('refresh_token')
		if (refreshToken) {
			// Оновлення токена
			const refreshResult = await baseQuery(
				{
					url: 'api/auth/token/refresh/',
					method: 'POST',
					body: { refresh: refreshToken },
				},
				api,
				extraOptions
			)

			if (refreshResult.data) {
				const { access: newAccessToken } =
					refreshResult.data as IRefreshTokenResponse

				// Збереження нового токена
				localStorage.setItem('access_token', newAccessToken)

				api.dispatch(authStatusSliceActions.logIn())

				// Повторний запит із новим токеном
				result = await baseQuery(args, api, extraOptions)
			} else {
				// Якщо оновлення не вдалося, очищуємо локальні токени
				localStorage.removeItem('access_token')
				localStorage.removeItem('refresh_token')
				api.dispatch(authStatusSliceActions.logOut())
			}
		} else {
			// Якщо немає refresh токена, робимо логаут
			localStorage.removeItem('access_token')
			localStorage.removeItem('refresh_token')
			api.dispatch(authStatusSliceActions.logOut())
		}
	}

	return result
}
