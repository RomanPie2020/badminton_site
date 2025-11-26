const ProfileSkeleton = () => {
	return (
		<div className='mt-20 flex flex-col items-center'>
			<div className='w-32 h-32 rounded-full bg-gray-300 animate-pulse mb-6'></div>
			<div className='w-64 h-6 bg-gray-300 animate-pulse mb-4'></div>
			<div className='w-48 h-6 bg-gray-300 animate-pulse mb-4'></div>
			<div className='w-72 h-6 bg-gray-300 animate-pulse'></div>
		</div>
	)
}
export default ProfileSkeleton
