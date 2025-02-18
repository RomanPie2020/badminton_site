import { createApi } from '@reduxjs/toolkit/query/react'
import {
	IRequestCreatePaste,
	IRequestDeletePasteById,
} from '../shared/interfaces/models'
import { baseQueryWithReauth } from './baseQueryWithReauth'

export const pasteService = createApi({
	reducerPath: 'paste',
	baseQuery: baseQueryWithReauth,
	endpoints: build => ({
		getUserPastes: build.query<any, void>({
			query: () => ({
				url: 'api/paste/my',
				method: 'GET',
			}),
			transformResponse: res => {
				return res
			},
		}),
		createPaste: build.mutation<any, IRequestCreatePaste>({
			query: body => ({
				url: 'api/paste/create',
				method: 'POST',
				body,
			}),
			transformResponse: res => {
				return res
			},
		}),
		updatePasteById: build.mutation<any, any>({
			query: ({ id, ...data }) => ({
				url: `api/paste/update-by-id/${id}`,
				method: 'PATCH',
				body: data,
			}),
			transformResponse: res => {
				return res
			},
		}),
		// updatePasteByUrl: build.mutation<any, any>({
		// 	query: ({ url }) => ({
		// 		url: `api/paste/update/${url}`,
		// 		method: 'PATCH',
		// 	}),
		// 	transformResponse: res => {
		// 		return res
		// 	},
		// }),
		deletePasteById: build.mutation<any, IRequestDeletePasteById>({
			query: ({ id }) => ({
				url: `api/paste/delete/${id}`,
				method: 'DELETE',
			}),
			transformResponse: res => {
				return res
			},
		}),
		getPublicPasteByUrl: build.query<any, any>({
			query: url => ({
				url: `api/paste/${url}`,
				method: 'GET',
			}),
		}),
		getPrivatePasteByUrl: build.mutation<any, any>({
			query: ({ url, password }) => ({
				url: `api/paste/${url}`,
				method: 'POST',
				body: { password },
			}),
			transformResponse: res => {
				return res
			},
		}),
	}),
})

export const {
	useGetUserPastesQuery,
	useCreatePasteMutation,
	useUpdatePasteByIdMutation,
	// useUpdatePasteByUrlMutation,
	useDeletePasteByIdMutation,
	useGetPublicPasteByUrlQuery,
	useGetPrivatePasteByUrlMutation,
} = pasteService
