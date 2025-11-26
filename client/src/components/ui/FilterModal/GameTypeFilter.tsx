import { GAME_TYPE_OPTIONS } from '../../../configs/filterOptions'
import { CheckboxFilter } from './CheckboxFilter'

interface GameTypeFilterProps {
	values: string[]
	onFilterChange: (filter: { category: string; value: string }) => void
}

export function GameTypeFilter({
	values,
	onFilterChange,
}: GameTypeFilterProps) {
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
