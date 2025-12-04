// src/store/filtersSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
	IFilterActionPayload,
	IFiltersState,
	TDateRange,
} from '../shared/interfaces/models'
import { RootState } from './store'

const initialState: IFiltersState = {
	modalOpen: false,
	values: {
		events: [],
		date: { from: null, to: null },
		typeOfGame: [],
		levelOfPlayers: [],
	},
}

const filtersSlice = createSlice({
	name: 'filters',
	initialState,
	reducers: {
		openFiltersModal(state) {
			state.modalOpen = true
		},
		closeFiltersModal(state) {
			state.modalOpen = false
		},
		setFilter(state, action: PayloadAction<IFilterActionPayload>) {
			const { category, value } = action.payload

			if (
				category === 'events' ||
				category === 'typeOfGame' ||
				category === 'levelOfPlayers'
			) {
				const arr = state.values[category] as string[]
				const val = value as string
				state.values[category] = arr.includes(val)
					? arr.filter(x => x !== val)
					: [...arr, val]
			} else if (category === 'date') {
				state.values.date = value as TDateRange
			}
		},
		clearFilters(state) {
			state.values = initialState.values
		},
	},
})

export const selectFilters = (state: RootState) => state.filters.values

export const filtersSliceActions = filtersSlice.actions
export const filtersSliceReducer = filtersSlice.reducer
