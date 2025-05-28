// validations/profileFields.ts
import { z } from 'zod'

export const NicknameField = z.string().min(1, 'Нікнейм обовʼязковий')

export const AvatarUrlField = z.string().url('Невалідне посилання')

export const AgeField = z.number().int().min(0).max(120).nullable()

export const GenderField = z.enum(['male', 'female', 'other', ''])

export const ExperienceField = z.number().int().min(0)

export const DominantHandField = z.enum(['left', 'right', ''])

export const PreferredFormatField = z.enum(['singles', 'doubles', 'mixed', ''])

export const CommonPlacesField = z.array(z.string())

export const BioField = z.string().max(500)
