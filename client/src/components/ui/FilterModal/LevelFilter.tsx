import { LEVEL_OPTIONS } from '../../../configs/filterOptions'
import { CheckboxFilter } from './CheckboxFilter'

interface LevelFilterProps {
	values: string[]
	onFilterChange: (filter: { category: string; value: string }) => void
}

export function LevelFilter({ values, onFilterChange }: LevelFilterProps) {
	const handleToggle = (value: string) => {
		onFilterChange({ category: 'levelOfPlayers', value })
	}

	return (
		<CheckboxFilter
			options={LEVEL_OPTIONS}
			selectedValues={values}
			onToggle={handleToggle}
		/>
	)
}
