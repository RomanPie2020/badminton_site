import { EVENT_OPTIONS } from '../../../configs/filterOptions'
import { CheckboxFilter } from './CheckboxFilter'

interface EventsFilterProps {
	values: string[]
	onFilterChange: (filter: { category: string; value: string }) => void
}

export function EventsFilter({ values, onFilterChange }: EventsFilterProps) {
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
