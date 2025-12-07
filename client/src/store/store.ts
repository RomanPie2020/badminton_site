import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { useDispatch, useSelector, useStore } from 'react-redux'
import { authService } from '../services/AuthService'
import { eventService } from '../services/EventService'
import { authStatusSliceReducer } from './authStatus.slice'
import { filtersSliceReducer } from './filtersSlice'

const reducers = combineReducers({
	authStatus: authStatusSliceReducer,
	filters: filtersSliceReducer,
	[authService.reducerPath]: authService.reducer,
	[eventService.reducerPath]: eventService.reducer,
})

export const store = configureStore({
	reducer: reducers,
	devTools: true,
	middleware: getDefaultMiddleware =>
		getDefaultMiddleware().concat([
			authService.middleware,
			eventService.middleware,
		]),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppSelector = useSelector.withTypes<RootState>()
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppStore = useStore.withTypes<typeof store>()
