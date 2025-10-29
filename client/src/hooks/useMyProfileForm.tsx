import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import {
	useGetProfileQuery,
	useUpdateProfileMutation,
} from '../services/AuthService'

export interface ProfileFormData {
	nickname?: string
	avatarUrl?: string
	city?: string
	age?: number
	gender?: string
	level?: string
	experienceMonths?: number
	dominantHand?: string
	preferredFormat?: string
	playFrequency?: string
	commonPlaces?: string[]
	playTime?: string
	bio?: string
	contact?: string
}

export const useMyProfileForm = () => {
	const { data: profile, isLoading, isError, error } = useGetProfileQuery()
	const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation()

	const [isEditing, setIsEditing] = useState(false)
	const [successMessage, setSuccessMessage] = useState('')
	const [errorMessage, setErrorMessage] = useState('')

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<ProfileFormData>()

	useEffect(() => {
		if (profile) {
			reset(profile)
		}
	}, [profile, reset])

	const onSubmit = async (data: ProfileFormData) => {
		try {
			setSuccessMessage('')
			setErrorMessage('')
			const cleaned = Object.fromEntries(
				Object.entries(data).filter(([, v]) => v !== undefined && v !== null)
			)
			const updated = await updateProfile(cleaned).unwrap()
			reset(updated)
			setIsEditing(false)
			setSuccessMessage('Профіль успішно оновлено ✅')
		} catch (err: any) {
			const msg =
				err?.data?.message || err?.error || 'Не вдалося оновити профіль'
			setErrorMessage(msg)
		}
	}

	const handleEditClick = () => {
		setIsEditing(true)
		setSuccessMessage('')
		setErrorMessage('')
	}

	const handleCancelClick = () => {
		reset(profile)
		setIsEditing(false)
	}

	return {
		profile,
		isLoading,
		isError,
		error,
		isUpdating,
		isEditing,
		successMessage,
		errorMessage,
		register,
		handleSubmit,
		errors,
		onSubmit,
		handleEditClick,
		handleCancelClick,
	}
}
