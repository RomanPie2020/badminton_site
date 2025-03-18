import { createSlice } from '@reduxjs/toolkit'
import { IAuthState } from '../shared/interfaces/models'

const initialState: IAuthState = {
	isAuthenticated: !!localStorage.getItem('access_token'), // Перевірка токена під час першого завантаження
}

const authStatusSlice = createSlice({
	name: 'authStatus',
	initialState,
	reducers: {
		logIn(state) {
			state.isAuthenticated = true
		},
		logOut(state) {
			state.isAuthenticated = false
		},
	},
})

export const authStatusSliceActions = authStatusSlice.actions
export const authStatusSliceReducer = authStatusSlice.reducer
