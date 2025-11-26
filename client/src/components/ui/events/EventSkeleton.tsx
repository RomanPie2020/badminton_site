const EventSkeleton = () => {
	return (
		<div className='border rounded-lg shadow-sm p-4 mb-4 animate-pulse bg-white'>
			<div className='h-6 w-2/3 bg-gray-300 rounded mb-3'></div>

			<div className='h-4 w-1/2 bg-gray-300 rounded mb-2'></div>
			<div className='h-4 w-1/3 bg-gray-300 rounded mb-4'></div>

			<div className='h-4 w-full bg-gray-300 rounded mb-2'></div>
			<div className='h-4 w-5/6 bg-gray-300 rounded mb-2'></div>
			<div className='h-4 w-4/6 bg-gray-300 rounded mb-4'></div>

			<div className='flex space-x-2'>
				<div className='h-8 w-20 bg-gray-300 rounded'></div>
				<div className='h-8 w-20 bg-gray-300 rounded'></div>
			</div>
		</div>
	)
}

export default EventSkeleton
