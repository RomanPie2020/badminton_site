// app/services/eventService.ts
import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from './baseQueryWithReauth'

export const eventService = createApi({
	reducerPath: 'event',
	baseQuery: baseQueryWithReauth,
	tagTypes: ['Events', 'Event', 'UserEvents'],
	endpoints: build => ({
		// 1) Список всіх івентів
		getEvents: build.query<any[], void>({
			query: () => ({
				url: '/api/events',
				method: 'GET',
			}),
			providesTags: ['Events'],
		}),

		// 2) Деталі одного івенту
		getEventById: build.query<any, number>({
			query: id => ({
				url: `/api/events/${id}`,
				method: 'GET',
			}),
			providesTags: (result, error, id) => [{ type: 'Event', id }],
		}),

		// 3) Створити івент
		createEvent: build.mutation<any, Partial<any>>({
			query: body => ({
				url: '/api/events',
				method: 'POST',
				body,
			}),
			invalidatesTags: ['Events', 'UserEvents'],
		}),

		// 4) Оновити івент
		updateEvent: build.mutation<any, { eventId: number; data: Partial<any> }>({
			query: ({ eventId, data }) => ({
				url: `/api/events/${eventId}`,
				method: 'PUT',
				body: data,
			}),
			invalidatesTags: (result, error, { eventId }) => [
				'Events',
				{ type: 'Event', id: eventId },
				'UserEvents',
			],
		}),

		// 5) Видалити івент
		deleteEvent: build.mutation<void, number>({
			query: id => ({
				url: `/api/events/${id}`,
				method: 'DELETE',
			}),
			invalidatesTags: (result, error, id) => [
				'Events',
				{ type: 'Event', id },
				'UserEvents',
			],
		}),

		// 6) Приєднатися до івенту
		joinEvent: build.mutation<void, number>({
			query: id => ({
				url: `/api/events/${id}/join`,
				method: 'POST',
			}),
			invalidatesTags: (result, error, id) => [
				'Events',
				{ type: 'Event', id },
				'UserEvents',
			],
		}),

		// 7) Вийти з івенту
		leaveEvent: build.mutation<void, number>({
			query: id => ({
				url: `/api/events/${id}/leave`,
				method: 'POST',
			}),
			invalidatesTags: (result, error, id) => [
				'Events',
				{ type: 'Event', id },
				'UserEvents',
			],
		}),

		// 8) Мої івенти (created або attending)
		getUserEvents: build.query<
			any[],
			{ userId: number; type?: 'created' | 'attending' | 'all' }
		>({
			query: ({ userId, type = 'created' }) => ({
				url: `/api/users/${userId}/events?type=${type}`,
				method: 'GET',
			}),
			providesTags: ['UserEvents'],
		}),
	}),
})

export const {
	useGetEventsQuery,
	useGetEventByIdQuery,
	useCreateEventMutation,
	useUpdateEventMutation,
	useDeleteEventMutation,
	useJoinEventMutation,
	useLeaveEventMutation,
	useGetUserEventsQuery,
} = eventService
