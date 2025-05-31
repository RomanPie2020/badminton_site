// src/store/filtersSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from './store'

interface DateRange {
	from: string | null // рядок у форматі "YYYY-MM-DD"
	to: string | null // рядок у форматі "YYYY-MM-DD"
}

export interface FiltersState {
	modalOpen: boolean
	values: {
		// категорії мають відповідати саме цим ключам:
		events: string[] // напр., ['Турнір', 'Тренування']
		date: DateRange // { from: '2025-06-01', to: '2025-06-07' }
		typeOfGame: string[] // напр., ['Одиночна', 'Парна']
		levelOfPlayers: string[] // напр., ['Новачок', 'Просунутий']
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
		// Обробляємо чотири типи фільтрів:
		setFilter(
			state,
			action: PayloadAction<{
				category: keyof FiltersState['values']
				value: any
			}>
		) {
			const { category, value } = action.payload

			// 1) Масивні фільтри (чекбокси) → events, typeOfGame, levelOfPlayers
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
			}
			// 2) Фільтр date (dateRange) → власний об’єкт
			else if (category === 'date') {
				state.values.date = value as DateRange
			}
		},
		// Якщо треба швидко скидати всі фільтри:
		clearFilters(state) {
			state.values = initialState.values
		},
	},
})

export const selectFilters = (state: RootState) => state.filters.values

export const filtersSliceActions = filtersSlice.actions
export const filtersSliceReducer = filtersSlice.reducer
