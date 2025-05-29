// src/store/filtersSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from './store'

interface RangeFilter {
	min: number | null
	max: number | null
}

export interface FiltersState {
	modalOpen: boolean
	values: {
		style: string[]
		productType: string[]
		size: string[]
		colour: string[]
		range: RangeFilter
		brand: string[]
	}
}

const initialState: FiltersState = {
	modalOpen: false,
	values: {
		style: [],
		productType: [],
		size: [],
		colour: [],
		range: { min: null, max: null },
		brand: [],
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

			// For array-based filters we toggle the item
			if (Array.isArray(state.values[category])) {
				const arr = state.values[category] as string[]
				const val = value as string
				state.values[category] = arr.includes(val)
					? arr.filter(x => x !== val)
					: [...arr, val]
			}
			// For the range filter we replace the whole object
			else if (category === 'range') {
				state.values.range = value as RangeFilter
			}
			// (If you add other single-value filters, handle them here)
		},
		clearFilters(state) {
			state.values = initialState.values
		},
	},
})

export const selectFilters = (state: RootState) => state.filters.values

export const filtersSliceActions = filtersSlice.actions
export const filtersSliceReducer = filtersSlice.reducer
