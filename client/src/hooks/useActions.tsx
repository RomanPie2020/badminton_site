import { bindActionCreators } from '@reduxjs/toolkit'
import { useMemo } from 'react'
import { authStatusSliceActions } from '../store/authStatus.slice'
import { filtersSliceActions } from '../store/filtersSlice'
import { useAppDispatch } from '../store/store'
import { userIdActions } from '../store/userId.slice'

const rootActions = {
	...userIdActions,
	...authStatusSliceActions,
	...filtersSliceActions,
}

export const useActions = () => {
	const dispatch = useAppDispatch()

	return useMemo(() => bindActionCreators(rootActions, dispatch), [dispatch])
}
