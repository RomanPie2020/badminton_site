import { EVENT_OPTIONS } from '../../../configs/filterOptions'
import { IFiltersState } from '../../../shared/interfaces/models'
import { CheckboxFilter } from './CheckboxFilter'

interface IEventsFilterProps {
	values: string[]
	onFilterChange: (filter: {
		category: keyof IFiltersState['values']
		value: string
	}) => void
}

export function EventsFilter({ values, onFilterChange }: IEventsFilterProps) {
	const handleToggle = (value: string) => {
		onFilterChange({ category: 'events', value })
	}

	return (
		<CheckboxFilter
			options={EVENT_OPTIONS}
			selectedValues={values}
			onToggle={handleToggle}
		/>
	)
}
