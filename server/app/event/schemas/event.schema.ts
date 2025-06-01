// src/shared/validations/event.schema.ts
import { z } from 'zod'
import {
	DescriptionField,
	EventDateField,
	EventTypeField,
	GameTypeField,
	LevelOfPlayersField,
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
	eventType: EventTypeField,
	gameType: GameTypeField,
	levelOfPlayers: LevelOfPlayersField,
})

export type EventInput = z.infer<typeof eventSchema>
