import { createApi } from '@reduxjs/toolkit/query/react'
import {
	IRequestForgotPassword,
	IRequestLogIn,
	IRequestLogOut,
	IRequestRefreshToken,
	IRequestSignUp,
	IRequestUpdateProfile,
	IResetPasswordRequest,
	IResponseGetProfile,
	IResponseGetUsers,
	IResponseLogIn,
	IResponseLogOut,
	IResponseRefreshToken,
	IResponseSignUp,
	TResponseConfirmRegistration,
	TResponseForgotPassword,
	TResponseResetPassword,
} from '../shared/interfaces/models'
import { baseQueryWithReauth } from './baseQueryWithReauth'

export const authService = createApi({
	reducerPath: 'auth',
	baseQuery: baseQueryWithReauth,
	tagTypes: ['UserProfile'],
	endpoints: build => ({
		register: build.mutation<IResponseSignUp, IRequestSignUp>({
			query: body => ({
				url: '/api/auth/register',
				method: 'POST',
				body,
			}),
		}),
		confirmRegistration: build.query<TResponseConfirmRegistration, string>({
			query: (token: string) => ({
				url: `/api/auth/confirm?token=${token}`,
				method: 'GET',
			}),
		}),
		loginUser: build.mutation<IResponseLogIn, IRequestLogIn>({
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
		refresh: build.mutation<IResponseRefreshToken, IRequestRefreshToken>({
			query: body => ({
				url: '/api/auth/refresh',
				method: 'POST',
				body,
			}),
		}),
		logOut: build.mutation<IResponseLogOut, IRequestLogOut>({
			query: body => ({
				url: '/api/auth/logout',
				method: 'DELETE',
				body,
			}),
		}),
		getUsers: build.query<IResponseGetUsers, void>({
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
		forgotPassword: build.mutation<
			TResponseForgotPassword,
			IRequestForgotPassword
		>({
			query: body => ({
				url: '/api/auth/forgot-password',
				method: 'POST',
				body,
			}),
		}),
		resetPassword: build.mutation<
			TResponseResetPassword,
			IResetPasswordRequest
		>({
			query: ({ token, body }) => ({
				url: `/api/auth/reset-password?token=${token}`,
				method: 'PATCH',
				body,
			}),
		}),

		// Profile
		getProfile: build.query<IResponseGetProfile, void>({
			query: () => ({
				url: '/api/profile',
				method: 'GET',
			}),
			providesTags: ['UserProfile'],
		}),
		updateProfile: build.mutation<IResponseGetProfile, IRequestUpdateProfile>({
			query: body => ({
				url: '/api/profile',
				method: 'PUT',
				body,
			}),
			invalidatesTags: ['UserProfile'],
		}),
		getUserProfileById: build.query<IResponseGetProfile, number>({
			query: id => ({
				url: `/api/users/${id}/profile`,
				method: 'GET',
			}),
			providesTags: (result, error, id) => [{ type: 'UserProfile', id }],
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
	useGetUserProfileByIdQuery,
} = authService
