import * as z from 'zod'
import {
	Creator,
	DescriptionField,
	EventDateField,
	EventTypeField,
	GameTypeField,
	Id,
	LevelOfPlayersField,
	LocationField,
	MaxParticipantsField,
	Participants,
	TitleField,
} from './eventFields'

export const eventSchema = z.object({
	id: Id,
	title: TitleField,
	description: DescriptionField,
	location: LocationField,
	eventDate: EventDateField,
	maxParticipants: MaxParticipantsField,
	eventType: EventTypeField,
	gameType: GameTypeField,
	levelOfPlayers: LevelOfPlayersField,
	creator: Creator,
	participants: Participants,
})

export type TEventInput = z.infer<typeof eventSchema>
