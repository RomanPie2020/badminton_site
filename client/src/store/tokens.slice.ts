// // зберігається в локалсторедж, можна видалити
// import { createSlice } from '@reduxjs/toolkit'

// const authSlice = createSlice({
// 	name: 'auth',
// 	initialState: {
// 		accessToken: null,
// 		refreshToken: null,
// 		isAuth: false,
// 	},
// 	reducers: {
// 		setTokens(state, action) {
// 			state.accessToken = action.payload.accessToken
// 			state.refreshToken = action.payload.refreshToken
// 			state.isAuth = action.payload.isAuth
// 		},
// 		clearTokens(state) {
// 			state.accessToken = null
// 			state.refreshToken = null
// 			state.isAuth = false
// 		},
// 	},
// })

// export const { setTokens, clearTokens } = authSlice.actions
