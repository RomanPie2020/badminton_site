import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import {
	useGetProfileQuery,
	useUpdateProfileMutation,
} from '../services/AuthService'
import { IProfileFormData } from '../shared/interfaces/models'

export const useMyProfileForm = () => {
	const { data: profile, isLoading, isError, error } = useGetProfileQuery()
	const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation()

	const [isEditing, setIsEditing] = useState<boolean>(false)
	const [successMessage, setSuccessMessage] = useState<string>('')
	const [errorMessage, setErrorMessage] = useState<string>('')

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<IProfileFormData>()

	useEffect(() => {
		if (profile) {
			reset(profile)
		}
	}, [profile, reset])

	const onSubmit = async (data: IProfileFormData) => {
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
