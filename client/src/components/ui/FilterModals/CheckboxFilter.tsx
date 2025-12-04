interface ICheckboxFilterProps {
	options: readonly string[]
	selectedValues: string[]
	onToggle: (value: string) => void
}

export function CheckboxFilter({
	options,
	selectedValues,
	onToggle,
}: ICheckboxFilterProps) {
	return (
		<div className='grid grid-cols-2 gap-3'>
			{options.map(option => (
				<label key={option} className='flex items-center space-x-2'>
					<input
						type='checkbox'
						checked={selectedValues.includes(option)}
						onChange={() => onToggle(option)}
						className='h-4 w-4'
					/>
					<span className='text-sm text-gray-700'>{option}</span>
				</label>
			))}
		</div>
	)
}
