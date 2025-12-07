import { IFiltersState, TDateRange } from '../../../shared/interfaces/models'

import {
	getNext7Days,
	getNextMonth,
	getThisWeek,
	getToday,
	getTomorrow,
} from '../../../utils/dateUtils'
import { DatePresetButton } from './DatePresetButton'

interface IDateFilterProps {
	values: TDateRange
	onFilterChange: (filter: {
		category: keyof IFiltersState['values']
		value: { from: string | null; to: string | null }
	}) => void
}

export function DateFilter({ values, onFilterChange }: IDateFilterProps) {
	const datePresets = [
		{
			label: 'Сьогодні',
			getValue: () => ({ from: getToday(), to: getToday() }),
		},
		{
			label: 'Завтра',
			getValue: () => ({ from: getTomorrow(), to: getTomorrow() }),
		},
		{ label: 'Цього тижня', getValue: getThisWeek },
		{ label: 'Наступні 7 днів', getValue: getNext7Days },
		{ label: 'Наступний місяць', getValue: getNextMonth },
	]

	const isPresetActive = (preset: (typeof datePresets)[0]) => {
		const presetValue = preset.getValue()
		return values.from === presetValue.from && values.to === presetValue.to
	}

	const handlePresetClick = (preset: (typeof datePresets)[0]) => {
		onFilterChange({ category: 'date', value: preset.getValue() })
	}

	const handleDateChange = (field: 'from' | 'to', value: string) => {
		onFilterChange({
			category: 'date',
			value: { ...values, [field]: value },
		})
	}

	return (
		<div className='space-y-4'>
			{/* Presets */}
			<div className='flex space-x-2 flex-wrap gap-y-2'>
				{datePresets.map(preset => (
					<DatePresetButton
						key={preset.label}
						label={preset.label}
						isActive={isPresetActive(preset)}
						onClick={() => handlePresetClick(preset)}
					/>
				))}
			</div>

			{/* Custom date selection */}
			<div className='flex space-x-4 mt-2'>
				<div className='flex flex-col'>
					<label className='text-sm text-gray-600'>Від:</label>
					<input
						type='date'
						value={values.from || ''}
						onChange={e => handleDateChange('from', e.target.value)}
						className='p-2 border rounded'
					/>
				</div>
				<div className='flex flex-col'>
					<label className='text-sm text-gray-600'>До:</label>
					<input
						type='date'
						value={values.to || ''}
						onChange={e => handleDateChange('to', e.target.value)}
						className='p-2 border rounded'
					/>
				</div>
			</div>
		</div>
	)
}
