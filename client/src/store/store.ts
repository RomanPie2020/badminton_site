import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { useDispatch, useSelector, useStore } from 'react-redux'
import { authService } from '../services/AuthService'
import { pasteService } from '../services/PasteService'
import { authStatusSliceReducer } from './authStatus.slice'
import { favoritesReducer } from './favorites/favoritesSlice'
import { userIdReducer } from './userId.slice'

const reducers = combineReducers({
	code: userIdReducer,
	favorites: favoritesReducer,
	authStatus: authStatusSliceReducer,
	[authService.reducerPath]: authService.reducer,
	[pasteService.reducerPath]: pasteService.reducer,
})

export const store = configureStore({
	reducer: reducers,
	devTools: true,
	middleware: getDefaultMiddleware =>
		getDefaultMiddleware().concat([
			authService.middleware,
			pasteService.middleware,
		]),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppSelector = useSelector.withTypes<RootState>()
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppStore = useStore.withTypes<typeof store>()
