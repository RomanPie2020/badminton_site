import { z } from 'zod'
import {
	AgeField,
	AvatarUrlField,
	BioField,
	DominantHandField,
	ExperienceField,
	GenderField,
	NicknameField,
	PreferredFormatField,
} from './profileFields'

export const updateProfileSchema = z.object({
	nickname: NicknameField.optional(),
	avatarUrl: AvatarUrlField.optional(),
	city: z.string().optional(),
	age: AgeField.optional(),
	gender: GenderField.optional(),

	level: z.string().optional(),
	experienceMonths: ExperienceField.optional().nullable(),
	dominantHand: DominantHandField.optional(),
	preferredFormat: PreferredFormatField.optional(),
	playFrequency: z.string().optional(),
	commonPlaces: z.preprocess((val: any) => {
		// якщо рядок — розбиваємо по комі
		if (typeof val === 'string') {
			return val === ''
				? [] // порожній рядок → порожній масив
				: val
						.split(',')
						.map(s => s.trim())
						.filter(Boolean)
		}
		// якщо масив вже, повертаємо його
		if (Array.isArray(val)) {
			return val
				.map(String)
				.map(s => s.trim())
				.filter(Boolean)
		}
		// інакше — undefined (завдяки .optional())
		return undefined
	}, z.array(z.string()).optional()),
	playTime: z.string().optional(),

	bio: BioField.optional(),
	contact: z.string().optional(),
})

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>
