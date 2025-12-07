import { GAME_TYPE_OPTIONS } from '../../../configs/filterOptions'
import { IFilterActionPayload } from '../../../shared/interfaces/models'
import { CheckboxFilter } from './CheckboxFilter'

interface IGameTypeFilterProps {
	values: string[]
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
