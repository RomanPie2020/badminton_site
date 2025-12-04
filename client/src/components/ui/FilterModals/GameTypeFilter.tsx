import { GAME_TYPE_OPTIONS } from '../../../configs/filterOptions'
import {
	IFilterActionPayload,
	IFiltersState,
} from '../../../shared/interfaces/models'
import { CheckboxFilter } from './CheckboxFilter'

interface IGameTypeFilterProps {
	values: string[]
	category: keyof IFiltersState['values']
	onFilterChange: (payload: IFilterActionPayload) => void
}

export function GameTypeFilter({
	values,
	onFilterChange,
}: IGameTypeFilterProps) {
	const handleToggle = (value: string) => {
		onFilterChange({ category: 'typeOfGame', value })
	}

	return (
		<CheckboxFilter
			options={GAME_TYPE_OPTIONS}
			selectedValues={values}
			onToggle={handleToggle}
		/>
	)
}
