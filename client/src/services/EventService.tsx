// app/services/eventService.ts
import { createApi } from '@reduxjs/toolkit/query/react'
import { EventWithRelations, Filters } from '../shared/interfaces/models'
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
				url: `/api/events/user/${userId}?type=${type}`,
				method: 'GET',
			}),
			providesTags: ['UserEvents'],
		}),

		// Отримати івенти з фільтрами, пошуком та сортуванням
		getFilteredEvents: build.query<
			{
				events: EventWithRelations[]
				total: number
				limit: number
				offset: number
			},
			{
				filters: Filters
				search?: string
				searchField?: 'title' | 'location' | 'creator'
				sortBy?: 'eventDate' | 'title' | 'location'
				sortOrder?: 'asc' | 'desc'
				limit?: number
				offset?: number
			}
		>({
			query: ({
				filters,
				search,
				searchField,
				sortBy,
				sortOrder,
				limit,
				offset,
			}) => {
				const params = new URLSearchParams()

				if (filters.events && filters.events.length > 0) {
					// «events=Турнір,Тренування»
					params.set('events', filters.events.join(','))
				}

				if (filters.date) {
					// «dateFrom=2025-06-01&dateTo=2025-06-07»
					params.set('dateFrom', filters.date.from)
					params.set('dateTo', filters.date.to)
				}

				if (filters.typeOfGame && filters.typeOfGame.length > 0) {
					// «typeOfGame=Одиночна,Парна»
					params.set('typeOfGame', filters.typeOfGame.join(','))
				}

				if (filters.levelOfPlayers && filters.levelOfPlayers.length > 0) {
					// «levelOfPlayers=Новачок,Просунутий»
					params.set('levelOfPlayers', filters.levelOfPlayers.join(','))
				}

				// --- Додаємо пошук (якщо є) ---
				if (search && search.trim() !== '') {
					params.set('search', search.trim())
				}

				// --- Додаємо поле для таргетованого пошуку (якщо є) ---
				if (searchField) {
					params.set('searchField', searchField)
				}

				// --- Додаємо поле для таргетованого пошуку (якщо є) ---
				if (searchField) {
					params.set('searchField', searchField)
				}

				// --- Додаємо сортування (якщо є) ---
				if (sortBy) {
					params.set('sortBy', sortBy)
					params.set('sortOrder', sortOrder || 'asc')
				}

				if (typeof limit === 'number') {
					params.set('limit', String(limit))
				}
				if (typeof offset === 'number') {
					params.set('offset', String(offset))
				}

				const queryString = params.toString()
				// Якщо не задано жодного фільтра, просто повернете '/events'
				return queryString ? `/api/events?${queryString}` : '/api/events'
			},
			providesTags: (
				result,
				error,
				{ filters, search, searchField, sortBy, sortOrder, limit, offset }
			) =>
				result
					? [
							...result.events.map(({ id }) => ({
								type: 'Event' as const,
								id,
							})),
							{
								type: 'Event',
								id: `FILTERED_${JSON.stringify({
									filters,
									search,
									searchField,
									sortBy,
									sortOrder,
									limit,
									offset,
								})}`,
							},
					  ]
					: [
							{
								type: 'Event',
								id: `FILTERED_${JSON.stringify({
									filters,
									search,
									searchField,
									sortBy,
									sortOrder,
									limit,
									offset,
								})}`,
							},
					  ],
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
	useGetFilteredEventsQuery,
	useLazyGetFilteredEventsQuery,
} = eventService
