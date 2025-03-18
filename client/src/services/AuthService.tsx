import { createApi } from '@reduxjs/toolkit/query/react'
import {
	IRequestSignUp,
	IResponseLogIn,
	IResponseSignUp,
} from '../shared/interfaces/models'
import { baseQueryWithReauth } from './baseQueryWithReauth'

export const authService = createApi({
	reducerPath: 'auth',
	baseQuery: baseQueryWithReauth,
	endpoints: build => ({
		logInUser: build.mutation<any, any>({
			query: body => ({
				url: 'api/auth/token/',
				method: 'POST',
				body,
			}),
			transformResponse: (res: IResponseLogIn) => {
				localStorage.setItem('access_token', res.access)
				localStorage.setItem('refresh_token', res.refresh)
				localStorage.setItem('is_Auth', 'true')
				return res
			},
		}),
		signUp: build.mutation<IResponseSignUp, IRequestSignUp>({
			query: body => ({
				url: 'api/user/register',
				method: 'POST',
				body,
			}),
			// transformResponse: res => {
			// 	return res
			// },
		}),
		codeVerification: build.mutation<any, any>({
			query: body => ({
				url: 'api/user/verify',
				method: 'POST',
				body,
			}),
			transformResponse: res => {
				return res
			},
		}),
		sendCodeAgain: build.mutation<any, any>({
			query: body => ({
				url: 'api/user/send_code_again',
				method: 'POST',
				body,
			}),
			transformResponse: res => {
				return res
			},
		}),
		updateUser: build.mutation<any, any>({
			query: body => ({
				url: 'api/user/update',
				method: 'PATCH',
				body,
			}),
		}),
		deleteUser: build.mutation<any, any>({
			query: body => ({
				url: 'api/user/delete',
				method: 'DELETE',
				body,
			}),
		}),
	}),
})

export const {
	useUpdateUserMutation,
	useLogInUserMutation,
	useSignUpMutation,
	useCodeVerificationMutation,
	useSendCodeAgainMutation,
	useDeleteUserMutation,
} = authService
