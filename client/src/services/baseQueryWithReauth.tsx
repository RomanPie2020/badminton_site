import {
	BaseQueryFn,
	FetchArgs,
	fetchBaseQuery,
	FetchBaseQueryError,
	FetchBaseQueryMeta,
} from '@reduxjs/toolkit/query/react'
import { apiUrl } from '../configs/url.config'

import { IResponseRefreshToken } from '../shared/interfaces/models'
import { authStatusSliceActions } from '../store/authStatus.slice'

export const baseQueryWithReauth: BaseQueryFn<
	string | FetchArgs,
	unknown,
	FetchBaseQueryError,
	{},
	FetchBaseQueryMeta
> = async (args: any, api: any, extraOptions: any) => {
	// Basic request
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

	// If the token has expired (401 Unauthorized)
	if (result.error?.status === 401) {
		const refreshToken = localStorage.getItem('refresh_token')
		if (refreshToken) {
			//Token Update
			const refreshResult = await baseQuery(
				{
					url: '/api/auth/refresh',
					method: 'POST',
					body: { refreshToken: refreshToken },
				},
				api,
				extraOptions
			)

			if (refreshResult.data) {
				console.log(refreshResult.data)

				const { accessToken: newAccessToken } =
					refreshResult.data as IResponseRefreshToken

				localStorage.setItem('access_token', newAccessToken)

				api.dispatch(authStatusSliceActions.logIn())

				result = await baseQuery(args, api, extraOptions)
			} else {
				localStorage.removeItem('access_token')
				localStorage.removeItem('refresh_token')
				localStorage.setItem('is_Auth', 'false')
				localStorage.setItem('user_id', '')
				api.dispatch(authStatusSliceActions.logOut())
			}
		} else {
			localStorage.removeItem('access_token')
			localStorage.removeItem('refresh_token')
			localStorage.setItem('is_Auth', 'false')
			localStorage.setItem('user_id', '')
			api.dispatch(authStatusSliceActions.logOut())
		}
	}

	return result
}
