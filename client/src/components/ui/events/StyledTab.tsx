import { Tab } from '@headlessui/react'

interface IStyledTabProps {
	children: React.ReactNode
}

const StyledTab = ({ children }: IStyledTabProps) => {
	return (
		<Tab
			className={({ selected }) =>
				`px-4 py-2 text-sm font-medium rounded-t focus:outline-none transition-colors ${
					selected
						? 'bg-blue-600 text-white shadow-md'
						: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
				}`
			}
		>
			{children}
		</Tab>
	)
}

export default StyledTab
