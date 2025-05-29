import { z } from 'zod'

export const TitleField = z.string().min(1, 'Заголовок обовʼязковий')
export const DescriptionField = z.string().optional()
export const LocationField = z.string().min(1, 'Локація обовʼязкова')
export const EventDateField = z.string().refine((s: unknown) => {
	if (typeof s !== 'string') return false
	return !isNaN(Date.parse(s))
}, 'Невірна дата')
export const MaxParticipantsField = z.number().int().positive().optional()
