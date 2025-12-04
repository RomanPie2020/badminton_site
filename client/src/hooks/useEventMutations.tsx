import { useCallback } from 'react'
import {
	useCreateEventMutation,
	useDeleteEventMutation,
	useJoinEventMutation,
	useLazyGetEventByIdQuery,
	useLeaveEventMutation,
	useUpdateEventMutation,
} from '../services/EventService'
import { TEventInput } from '../shared/validations/event.schema'
type SetItemsType = React.Dispatch<React.SetStateAction<TEventInput[]>>
type SetTotalType = React.Dispatch<React.SetStateAction<number>>

export const useEventMutations = (
	setItems: SetItemsType,
	setTotal: SetTotalType
) => {
	const [getEventById] = useLazyGetEventByIdQuery()
	const [joinEvent] = useJoinEventMutation()
	const [leaveEvent] = useLeaveEventMutation()
	const [createEvent] = useCreateEventMutation()
	const [updateEvent] = useUpdateEventMutation()
	const [deleteEvent] = useDeleteEventMutation()

	const currentUserId = Number(localStorage.getItem('user_id'))

	const handleCreate = useCallback(
		async (data: TEventInput) => {
			try {
				const newEvent = await createEvent(data).unwrap()
				setItems(prev => [newEvent, ...prev])
				setTotal(prev => prev + 1)
			} catch (error) {
				console.error('Error creating event:', error)
				throw error
			}
		},
		[createEvent, setItems, setTotal]
	)

	const handleJoin = useCallback(
		async (eventId: number) => {
			try {
				await joinEvent({ eventId }).unwrap()
				const updatedEvent = await getEventById(eventId).unwrap()
				setItems(prev =>
					prev.map(event => (event.id === eventId ? updatedEvent : event))
				)
			} catch (error) {
				console.error('Error joining:', error)
				throw error
			}
		},
		[joinEvent, getEventById, setItems]
	)

	const handleLeave = useCallback(
		async (eventId: number) => {
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
				console.error('Error leaving:', error)
				throw error
			}
		},
		[leaveEvent, setItems, currentUserId]
	)

	const handleEdit = useCallback(
		async (eventId: number, updatedData: TEventInput) => {
			try {
				await updateEvent({ eventId, data: { ...updatedData } }).unwrap()
				const updatedEvent = await getEventById(eventId).unwrap()
				setItems(prev =>
					prev.map(evt => (evt.id === eventId ? updatedEvent : evt))
				)
			} catch (error) {
				console.error('Error editing:', error)
				throw error
			}
		},
		[updateEvent, getEventById, setItems]
	)

	const handleDelete = useCallback(
		async (eventId: number) => {
			try {
				await deleteEvent(eventId).unwrap()
				setItems(prev => prev.filter(evt => evt.id !== eventId))
				setTotal(prev => prev - 1)
			} catch (error) {
				console.error('Error deleting:', error)
				throw error
			}
		},
		[deleteEvent, setItems, setTotal]
	)

	return {
		handleCreate,
		handleJoin,
		handleLeave,
		handleEdit,
		handleDelete,
	}
}
