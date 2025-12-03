interface DatePresetButtonProps {
	label: string
	isActive: boolean
	onClick: () => void
}

export function DatePresetButton({
	label,
	isActive,
	onClick,
}: DatePresetButtonProps) {
	return (
		<button
			type='button'
			className={`px-3 py-1 rounded ${
				isActive ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
			}`}
			onClick={onClick}
		>
			{label}
		</button>
	)
}
