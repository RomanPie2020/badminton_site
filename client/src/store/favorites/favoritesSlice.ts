import { createSlice } from '@reduxjs/toolkit'

const initialState: any = []

export const favoritesSlice = createSlice({
	name: 'favorites',
	initialState,
	reducers: {
		toggleFavorites: (state, { payload: post }) => {
			const isExists = state.some(p => p.id === post.id)

			if (isExists) {
				state = state.filter(p => p.id !== post.id)
			} else {
				state.push(post)
			}
		},
	},
})

export const favoritesActions = favoritesSlice.actions
export const favoritesReducer = favoritesSlice.reducer
