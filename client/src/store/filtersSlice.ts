// src/store/filtersSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from './store'

interface DateRange {
	from: string | null
	to: string | null
}

export interface FiltersState {
	modalOpen: boolean
	values: {
		events: string[]
		date: DateRange
		typeOfGame: string[]
		levelOfPlayers: string[]
	}
}

const initialState: FiltersState = {
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
		setFilter(
			state,
			action: PayloadAction<{
				category: keyof FiltersState['values']
				value: any
			}>
		) {
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
				state.values.date = value as DateRange
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
