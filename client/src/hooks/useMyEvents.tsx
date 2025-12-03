import { useEffect, useState } from 'react'
import {
	useDeleteEventMutation,
	useGetUserEventsQuery,
	useJoinEventMutation,
	useLeaveEventMutation,
	useUpdateEventMutation,
} from '../services/EventService'
import { TModalState } from '../shared/interfaces/models'
import { EventInput } from '../shared/validations/event.schema'

export const useMyEvents = (currentUserId: number) => {
	const [editEventId, setEditEventId] = useState<TModalState>(null)
	const [deleteEventId, setDeleteEventId] = useState<TModalState>(null)
	const [showDetailsId, setShowDetailsId] = useState<TModalState>(null)

	const {
		data: createdEvents,
		isLoading: isLoadingCreated,
		isFetching: isFetchingCreated,
		isError: isErrorCreated,
		refetch: refetchCreated,
	} = useGetUserEventsQuery({ userId: currentUserId, type: 'created' })

	const {
		data: attendingEvents,
		isLoading: isLoadingAttending,
		isFetching: isFetchingAttending,
		isError: isErrorAttending,
		refetch: refetchAttending,
	} = useGetUserEventsQuery({ userId: currentUserId, type: 'attending' })

	useEffect(() => {
		refetchCreated()
		refetchAttending()
	}, [])

	const [joinEvent] = useJoinEventMutation()
	const [leaveEvent] = useLeaveEventMutation()
	const [updateEvent] = useUpdateEventMutation()
	const [deleteEvent] = useDeleteEventMutation()

	// --- Handlers ---
	const handleJoin = async (eventId: number) => {
		try {
			if (!eventId) return
			await joinEvent({ eventId }).unwrap()
			await Promise.all([refetchAttending(), refetchCreated()])
		} catch (error) {
			console.error('Error joining event:', error)
		}
	}

	const handleLeave = async (eventId: number) => {
		try {
			await leaveEvent(eventId).unwrap()
			await Promise.all([refetchAttending(), refetchCreated()])

			const wasAttending = attendingEvents?.some(e => e.id === eventId)
			const stillCreated = createdEvents?.some(e => e.id === eventId)

			if (wasAttending && !stillCreated) {
				setShowDetailsId(null)
			}
		} catch (error) {
			console.error('Error exiting event:', error)
		}
	}

	const handleEdit = async (eventId: number, data: EventInput) => {
		try {
			await updateEvent({ eventId, data }).unwrap()
			await Promise.all([refetchCreated(), refetchAttending()])
			setEditEventId(null)
		} catch (error) {
			console.error('Error editing event:', error)
		}
	}

	const handleDelete = async (eventId: number) => {
		try {
			await deleteEvent(eventId).unwrap()
			await Promise.all([refetchCreated(), refetchAttending()])
			setDeleteEventId(null)
		} catch (error) {
			console.error('Error deleting event:', error)
		}
	}

	// Helper to find event data for modals
	const getEventById = (id: number | null) => {
		if (!id) return null
		const allEvents = [...(createdEvents ?? []), ...(attendingEvents ?? [])]
		return allEvents.find(e => e.id === id)
	}

	return {
		// Data
		createdEvents,
		attendingEvents,

		// Loading States
		isLoadingCreated,
		isFetchingCreated,
		isErrorCreated,
		isLoadingAttending,
		isFetchingAttending,
		isErrorAttending,

		// Modal States & Setters
		editEventId,
		setEditEventId,
		deleteEventId,
		setDeleteEventId,
		showDetailsId,
		setShowDetailsId,

		// Actions
		handleJoin,
		handleLeave,
		handleEdit,
		handleDelete,
		refetchCreated,
		refetchAttending,

		// Helpers
		getEventById,
	}
}
