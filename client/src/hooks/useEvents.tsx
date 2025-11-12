import { useCallback, useEffect, useRef, useState } from 'react'
import {
	useCreateEventMutation,
	useDeleteEventMutation,
	useJoinEventMutation,
	useLazyGetEventByIdQuery,
	useLazyGetFilteredEventsQuery,
	useLeaveEventMutation,
	useUpdateEventMutation,
} from '../services/EventService'
import { EventInput } from '../shared/validations/event.schema'

const PAGE_SIZE = 10

export const useEvents = (
	filters: any,
	searchText: string,
	searchField: 'title' | 'location' | 'creator',
	sortBy: 'eventDate' | 'title' | 'location',
	sortOrder: 'asc' | 'desc'
	// observerRef: React.MutableRefObject<IntersectionObserver | null>
) => {
	const [items, setItems] = useState<EventInput[]>([])
	const [currentOffset, setCurrentOffset] = useState(0)
	const [total, setTotal] = useState(0)
	const [hasMore, setHasMore] = useState(true)
	const [isLoadingMore, setIsLoadingMore] = useState(false)
	const [isInitialLoad, setIsInitialLoad] = useState(true)

	const [trigger, { isFetching, isError }] = useLazyGetFilteredEventsQuery()
	const [getEventById] = useLazyGetEventByIdQuery()
	const [joinEvent] = useJoinEventMutation()
	const [leaveEvent] = useLeaveEventMutation()
	const [createEvent] = useCreateEventMutation()
	const [updateEvent] = useUpdateEventMutation()
	const [deleteEvent] = useDeleteEventMutation()

	const observerRef = useRef<IntersectionObserver | null>(null)
	const bottomRef = useRef<HTMLDivElement | null>(null)
	const currentUserId = Number(localStorage.getItem('user_id'))

	const loadEvents = useCallback(
		async (offset: number, isNewSearch: boolean = false) => {
			try {
				if (isNewSearch) {
					setIsInitialLoad(true)
				} else {
					setIsLoadingMore(true)
				}

				const result = await trigger({
					filters,
					search: searchText.trim(),
					searchField,
					sortBy,
					sortOrder,
					limit: PAGE_SIZE,
					offset,
				}).unwrap()

				const { events: newEvents, total: newTotal } = result

				if (isNewSearch) {
					setItems(newEvents || [])
					setCurrentOffset(newEvents?.length || 0)
				} else {
					setItems(prev => {
						const existingIds = new Set(prev.map(e => e.id))
						const uniqueEvents = (newEvents || []).filter(
							e => !existingIds.has(e.id)
						)
						return [...prev, ...uniqueEvents]
					})
					setCurrentOffset(prev => prev + (newEvents?.length || 0))
				}

				setTotal(newTotal || 0)
				setHasMore(
					(newEvents?.length || 0) === PAGE_SIZE &&
						offset + (newEvents?.length || 0) < (newTotal || 0)
				)
			} catch (error) {
				console.error('Помилка завантаження подій:', error)
			} finally {
				setIsInitialLoad(false)
				setIsLoadingMore(false)
			}
		},
		[trigger, filters, searchText, searchField, sortBy, sortOrder]
	)

	const resetAndLoad = useCallback(() => {
		setItems([])
		setCurrentOffset(0)
		setTotal(0)
		setHasMore(true)
		loadEvents(0, true)
	}, [loadEvents])

	const loadNextPage = useCallback(() => {
		if (!isLoadingMore && !isFetching && hasMore && currentOffset < total) {
			loadEvents(currentOffset, false)
		}
	}, [loadEvents, isLoadingMore, isFetching, hasMore, currentOffset, total])

	useEffect(() => {
		if (observerRef.current) {
			observerRef.current.disconnect()
		}

		resetAndLoad()
	}, [filters, searchText, searchField, sortBy, sortOrder])

	useEffect(() => {
		if (!hasMore || isLoadingMore || isFetching || isInitialLoad) {
			return
		}

		if (observerRef.current) {
			observerRef.current.disconnect()
		}

		observerRef.current = new IntersectionObserver(
			entries => {
				if (entries[0].isIntersecting) {
					loadNextPage()
				}
			},
			{
				rootMargin: '100px',
			}
		)

		if (bottomRef.current) {
			observerRef.current.observe(bottomRef.current)
		}

		return () => {
			observerRef.current?.disconnect()
		}
	}, [loadNextPage, hasMore, isLoadingMore, isFetching, isInitialLoad])

	const handleCreate = async (data: EventInput) => {
		try {
			const newEvent = await createEvent(data).unwrap()
			setItems(prev => [newEvent, ...prev])
		} catch (error) {
			console.error('Error creating event:', error)
		}
	}

	const handleJoin = async (eventId: number) => {
		try {
			await joinEvent({ eventId }).unwrap()

			const updatedEvent = await getEventById(eventId).unwrap()
			setItems(prev =>
				prev.map(event => (event.id === eventId ? updatedEvent : event))
			)
		} catch (error) {
			console.error('Error joining to the event:', error)
		}
	}

	const handleLeave = async (eventId: number) => {
		try {
			await leaveEvent(eventId).unwrap()
			setItems(prev =>
				prev.map(event =>
					event.id === eventId
						? {
								...event,
								participants: (event.participants || []).filter(
									p => p.id !== currentUserId
								),
						  }
						: event
				)
			)
		} catch (error) {
			console.error('Error during leaving the event:', error)
		}
	}
	const handleEdit = async (eventId: number, updatedData: EventInput) => {
		console.log('Submitting updated data:', updatedData)
		console.log('Event ID:', { eventId, data: { ...updatedData } })

		await updateEvent({ eventId, data: { ...updatedData } }).unwrap()
		const updatedEvent = await getEventById(eventId).unwrap()
		setItems(prev => prev.map(evt => (evt.id === eventId ? updatedEvent : evt)))
	}
	const handleDelete = async (eventId: number) => {
		try {
			await deleteEvent(eventId).unwrap()
			setItems(prev => prev.filter(evt => evt.id !== eventId))
		} catch (error) {
			console.error('Error during deleting the event:', error)
		}
	}

	return {
		items,
		isFetching,
		isError,
		hasMore,
		isLoadingMore,
		isInitialLoad,
		currentOffset,
		total,
		loadEvents,
		resetAndLoad,
		loadNextPage,
		bottomRef,
		handleCreate,
		handleJoin,
		handleLeave,
		handleEdit,
		handleDelete,
	}
}
