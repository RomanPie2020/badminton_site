import { LEVEL_OPTIONS } from '../../../configs/filterOptions'
import { IFiltersState } from '../../../shared/interfaces/models'
import { CheckboxFilter } from './CheckboxFilter'

interface ILevelFilterProps {
	values: string[]
	onFilterChange: (filter: {
		category: keyof IFiltersState['values']
		value: string
	}) => void
}

export function LevelFilter({ values, onFilterChange }: ILevelFilterProps) {
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
