// topBar
export interface ILogButton {
	title: string
	styles: any
	to: string
	type?: 'a' | 'button'
	onButtonClick?: (codeData: ICodeSendAgain | any) => void
}

// LogInForm
export interface ILogInData {
	email: string
	password: string
}
export interface ILogInFormProps {
	onSubmit: (userData: ILogInData) => void
}

// SignUpForm
export interface ISignUpData {
	email: string
	username: string
	password: string
	passwordConfirmation: string
}
export interface ISignUpFormProps {
	onSubmit: (userData: ISignUpData) => void
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
	access: string // Новий access-токен
}

// Auth state
export interface IAuthState {
	isAuthenticated: boolean
}

// Profile
export interface IRequestChangeUsername {
	username: string
}

// Paste service
// create paste
export interface IRequestCreatePaste {
	title: string
	syntax?: string
	text: string
	password?: string
	is_public: Boolean
}
export interface IRequestDeletePasteById {
	id: string
}
