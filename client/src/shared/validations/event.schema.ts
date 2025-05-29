import { z } from 'zod'
import {
	DescriptionField,
	EventDateField,
	LocationField,
	MaxParticipantsField,
	TitleField,
} from './eventFields'

export const eventSchema = z.object({
	title: TitleField,
	description: DescriptionField,
	location: LocationField,
	eventDate: EventDateField,
	maxParticipants: MaxParticipantsField,
})

export type EventInput = z.infer<typeof eventSchema>
