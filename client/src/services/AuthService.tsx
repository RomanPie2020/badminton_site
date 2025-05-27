import { createApi } from '@reduxjs/toolkit/query/react'
import {
	IRequestSignUp,
	IResetPasswordRequest,
	IResponseLogIn,
	IResponseSignUp,
} from '../shared/interfaces/models'
import { baseQueryWithReauth } from './baseQueryWithReauth'

export const authService = createApi({
	reducerPath: 'auth',
	baseQuery: baseQueryWithReauth,
	endpoints: build => ({
		register: build.mutation<IResponseSignUp, IRequestSignUp>({
			query: body => ({
				url: '/api/auth/register',
				method: 'POST',
				body,
			}),
			// transformResponse: res => {
			// 	return res
			// },
		}),
		confirmRegistration: build.query<any, string>({
			query: (token: string) => ({
				url: `/api/auth/confirm?token=${token}`,
				method: 'GET',
			}),
			transformResponse: res => res,
		}),

		loginUser: build.mutation<any, any>({
			query: body => ({
				url: '/api/auth/login',
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
		refresh: build.mutation<any, any>({
			query: body => ({
				url: '/api/auth/refresh',
				method: 'POST',
				body,
			}),
		}),
		logOut: build.mutation<any, any>({
			query: body => ({
				url: '/api/auth/logout',
				method: 'DELETE',
				body,
			}),
		}),
		getUsers: build.query<any, any>({
			query: () => ({
				url: '/api/auth/users',
			}),
		}),
		// sendCodeAgain: build.mutation<any, any>({
		// 	query: body => ({
		// 		url: 'api/user/send_code_again',
		// 		method: 'POST',
		// 		body,
		// 	}),
		// 	transformResponse: res => {
		// 		return res
		// 	},
		// }),
		// updateUser: build.mutation<any, any>({
		// 	query: body => ({
		// 		url: 'api/user/update',
		// 		method: 'PATCH',
		// 		body,
		// 	}),
		// }),
		// deleteUser: build.mutation<any, any>({
		// 	query: body => ({
		// 		url: 'api/user/delete',
		// 		method: 'DELETE',
		// 		body,
		// 	}),
		// }),
		forgotPassword: build.mutation<any, any>({
			query: body => ({
				url: '/api/auth/forgot-password',
				method: 'POST',
				body,
			}),
		}),
		resetPassword: build.mutation<any, IResetPasswordRequest>({
			query: ({ token, body }) => ({
				url: `/api/auth/reset-password?token=${token}`,
				method: 'PATCH',
				body,
			}),
		}),
		// Profile
		getProfile: build.query<any, void>({
			query: () => ({
				url: '/api/profile',
				method: 'GET',
			}),
		}),

		updateProfile: build.mutation<
			any,
			// Partial<UpdateProfileInput>
			any
		>({
			query: body => ({
				url: '/api/profile',
				method: 'PUT',
				body,
			}),
		}),
	}),
})

export const {
	useRegisterMutation,
	useConfirmRegistrationQuery,
	useLoginUserMutation,
	useRefreshMutation,
	useLogOutMutation,
	useGetUsersQuery,
	// useSendCodeAgainMutation,
	// useUpdateUserMutation,
	// useDeleteUserMutation,
	useForgotPasswordMutation,
	useResetPasswordMutation,
	useGetProfileQuery,
	useUpdateProfileMutation,
} = authService
