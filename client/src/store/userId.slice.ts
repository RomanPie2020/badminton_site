import { createSlice } from '@reduxjs/toolkit'

const initialState: any = []

export const userIdSlice = createSlice({
	name: 'codeVerify',
	initialState,
	reducers: {
		addUserId: (state, { payload: userId }) => {
			// const isExists = localStorage.getItem('userId')

			localStorage.setItem('userId', userId)
			// if (isExists) {
			// 	localStorage.removeItem('userId')
			// 	localStorage.setItem('userId', userId)
			// 	return console.log('userId was changed')
			// } else {
			// 	localStorage.setItem('userId', userId)
			// 	return console.log('userId wasnt changed')
			// }
		},
	},
})

export const userIdActions = userIdSlice.actions
export const userIdReducer = userIdSlice.reducer
