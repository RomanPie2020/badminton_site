import {
	FieldValues,
	Path,
	RegisterOptions,
	UseFormSetError,
} from 'react-hook-form'

// topBar
export interface IBaseButton {
	title: string
	styles: any
	to: string
	type?: 'a' | 'button'
	onButtonClick?: (codeData: ICodeSendAgain | any) => void
}

// FormInput
export interface IFormInput<T extends FieldValues> {
	name: Path<T>
	label?: string
	type?: React.HTMLInputTypeAttribute
	placeholder?: string
	rules?: RegisterOptions<T, Path<T>>
	validateWith?: Path<T> //  for a secure password of the user
}

// FormBuilder
export type TFormBuilderSubmitHandler<T extends FieldValues> = (
	data: T,
	helpers?: { setError: UseFormSetError<T> }
) => void | Promise<void>

// LogInForm
export interface ILogInData {
	email: string
	password: string
}
export interface ILogInFormProps {
	onSubmit: (userData: ILogInData) => void
	// errorMessage?: string | null
}

// SignUpForm
export interface ISignUpData {
	email: string
	username: string
	password: string
	passwordConfirmation: string
}
export interface ISignUpFormProps {
	onSubmit: TFormBuilderSubmitHandler<ISignUpData>
	errorMessage?: string
}

// Code verification
export interface ICodeVerifyData {
	user_id: string | number
	code: string
}

export interface ICodeSendAgain {
	user_id: string | number
}

export interface ICodeVerifyFormProps {
	onSubmit: (codeData: ICodeVerifyData) => void
	onSendCodeAgain: (codeData: ICodeSendAgain | null) => void
}

// Auth service
// SignUp
export interface IResponseSignUp {
	id: number
	email: string
	username: string
	first_name: string
	last_name: string
	password: string
}

export interface IRequestSignUp {
	email: string
	username: string
	password: string
}

// LogIn
export interface IResponseLogIn {
	access: string
	refresh: string
}

export interface IRefreshTokenResponse {
	accessToken: string
}

// Auth state
export interface IAuthState {
	isAuthenticated: boolean
}

// Profile
export interface IRequestChangeUsername {
	username: string
}

export interface IProfileFormData {
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

export type TProfileFieldType = 'text' | 'number' | 'email' | 'tel' | 'password'

// Enter email
export interface IEnterEmailData {
	email: string
}

export interface IEnterEmailFormProps {
	onSubmit: (userData: IEnterEmailData) => void
}

// Reset password
export interface IResetPasswordData {
	newPassword: string
	confirmPassword: string
}

export interface IResetPasswordFormProps {
	onSubmit: (userData: IResetPasswordData) => void
}

export interface IResetPasswordRequest {
	token: string
	body: {
		newPassword: string
		confirmPassword: string
	}
}

// Events
// export interface EventWithRelations {
// 	id: number
// 	title: string
// 	location: string
// 	eventDate: string
// 	creator: { id: number; username: string; profile?: { nickname: string } }
// 	maxParticipants?: number
// 	participants: { id: number }[]
// }
export interface IParticipant {
	id: number
	profile: { nickname: string }
	nickname: string
	username: string
	avatarUrl?: string | null
}

// EventList
export type TSearchField = 'title' | 'location' | 'creator'
export type TSortBy = 'eventDate' | 'title' | 'location'
export type TSortOrder = 'asc' | 'desc'
export type TModalState = number | null

// Date
export type TDateRange = {
	from: string | null
	to: string | null
}

// user profile
export interface UserProfile {
	id: number
	userId: number
	username: string
	email?: string
	nickname: string
	avatarUrl?: string | null
	city?: string | null
	age?: number | null
	gender?: 'male' | 'female' | 'other' | null

	level?: string | null
	experienceMonths?: number | null
	dominantHand?: 'left' | 'right' | null
	preferredFormat?: 'singles' | 'doubles' | 'mixed' | null
	playFrequency?: string | null
	commonPlaces?: string[] | null
	playTime?: string | null

	bio?: string | null
	contact?: string | null

	rating: number
	reviewsCount: number

	createdAt: string
	updatedAt: string
}

// IFilters
export interface IFilters {
	events?: string[]
	date?: TDateRange
	typeOfGame?: string[]
	levelOfPlayers?: string[]
}

export interface IFiltersState {
	modalOpen: boolean
	values: {
		events: string[]
		date: TDateRange
		typeOfGame: string[]
		levelOfPlayers: string[]
	}
}
export interface IFilterActionPayload {
	category: keyof IFiltersState['values']
	value: string | TDateRange
}
