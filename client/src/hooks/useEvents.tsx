import { useCallback, useEffect, useRef, useState } from 'react'
import { useLazyGetFilteredEventsQuery } from '../services/EventService'
import {
	TSearchField,
	TSortBy,
	TSortOrder,
	TTypeOfLoadingEvents,
} from '../shared/interfaces/models'
import { TEventInput } from '../shared/validations/event.schema'
import { useEventMutations } from './useEventMutations'

const PAGE_SIZE = 10

export const useEvents = (
	filters: any,
	searchText: string,
	searchField: TSearchField,
	sortBy: TSortBy,
	sortOrder: TSortOrder,
	bottomRef: React.MutableRefObject<HTMLDivElement | null>
) => {
	const [items, setItems] = useState<TEventInput[]>([])
	const [total, setTotal] = useState<number>(0)
	const [hasMore, setHasMore] = useState<boolean>(true)
	const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false)
	const [isMounting, setIsMounting] = useState<boolean>(true)
	const [isSearching, setIsSearching] = useState<boolean>(false)
	const [currentOffset, setCurrentOffset] = useState<number>(0)

	const { handleCreate, handleDelete, handleEdit, handleJoin, handleLeave } =
		useEventMutations(setItems, setTotal)

	const [trigger, { isFetching, isError }] = useLazyGetFilteredEventsQuery()

	const observerRef = useRef<IntersectionObserver | null>(null)
	const isFirstRender = useRef<boolean>(true)

	// Ref to access up-to-date status inside event listeners/timeouts
	const stateRef = useRef({
		isLoadingMore,
		isFetching,
		isMounting,
		hasMore,
		currentOffset,
		total,
		isSearching,
	})

	useEffect(() => {
		stateRef.current = {
			isLoadingMore,
			isFetching,
			isMounting,
			hasMore,
			currentOffset,
			total,
			isSearching,
		}
	}, [
		isLoadingMore,
		isFetching,
		isMounting,
		hasMore,
		currentOffset,
		total,
		isSearching,
	])

	// --- MAIN LOAD FUNCTION ---
	const loadEvents = useCallback(
		async (offset: number, type: TTypeOfLoadingEvents) => {
			try {
				if (type === 'mount') setIsMounting(true)
				if (type === 'search') setIsSearching(true)
				if (type === 'pagination') setIsLoadingMore(true)

				const result = await trigger({
					filters,
					search: searchText.trim(),
					searchField,
					sortBy,
					sortOrder,
					limit: PAGE_SIZE,
					offset,
				}).unwrap()
				// console.log(JSON.stringify(result, null, 2))
				console.log(result)

				const { events: newEvents, total: newTotal } = result

				if (type === 'mount' || type === 'search') {
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
				console.error('Event loading error:', error)
			} finally {
				setIsMounting(false)
				setIsSearching(false)
				setIsLoadingMore(false)
			}
		},

		[
			trigger,

			JSON.stringify(filters),
			searchText,
			searchField,
			sortBy,
			sortOrder,
		]
	)

	const resetAndLoad = useCallback(() => {
		setItems([])
		setCurrentOffset(0)
		setTotal(0)
		setHasMore(true)
		loadEvents(0, 'search')
	}, [loadEvents])

	const loadNextPage = useCallback(() => {
		const state = stateRef.current
		if (
			!state.isLoadingMore &&
			!state.isFetching &&
			!state.isSearching &&
			!state.isMounting &&
			state.hasMore &&
			state.currentOffset < state.total
		) {
			loadEvents(state.currentOffset, 'pagination')
		}
	}, [loadEvents])

	useEffect(() => {
		if (isFirstRender.current) {
			isFirstRender.current = false
			loadEvents(0, 'mount')
		} else {
			resetAndLoad()
		}
	}, [
		JSON.stringify(filters),
		searchText,
		searchField,
		sortBy,
		sortOrder,
		loadEvents,
		resetAndLoad,
	])

	// Observer Logic
	useEffect(() => {
		if (!hasMore || isLoadingMore || isFetching || isMounting || isSearching)
			return

		if (observerRef.current) observerRef.current.disconnect()

		observerRef.current = new IntersectionObserver(
			entries => {
				if (entries[0].isIntersecting) {
					loadNextPage()
				}
			},
			{ rootMargin: '100px' }
		)

		if (bottomRef.current) {
			observerRef.current.observe(bottomRef.current)
		}

		return () => {
			observerRef.current?.disconnect()
		}
	}, [
		loadNextPage,
		hasMore,
		isLoadingMore,
		isFetching,
		isMounting,
		isSearching,
		bottomRef,
	])

	return {
		items,
		total,
		hasMore,
		isFetching,
		isMounting,
		isSearching,
		isLoadingMore,
		isError,
		resetAndLoad,
		handleCreate,
		handleJoin,
		handleLeave,
		handleEdit,
		handleDelete,
	}
}
