import { SubmitHandler } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { useCreatePasteMutation } from '../../services/PasteService'
import { ILogButton, IRequestCreatePaste } from '../../shared/interfaces/models'
import { useAppSelector } from '../../store/store'

const createPasteButtonProps: ILogButton = {
	title: 'Create',
	styles: 'signup-button',
	to: '',
	type: 'button',
}

function Home() {
	const isAuthenticated = useAppSelector(
		state => state.authStatus.isAuthenticated
	)
	// getting pastes
	// const { data: pastes, error, isLoading, refetch } = useGetUserPastesQuery()

	// useEffect(() => {
	// 	// Додаткові дії після завантаження даних, якщо необхідно
	// 	if (pastes) {
	// 		console.log('Pastes loaded:', pastes)
	// 	}
	// }, [pastes])

	// create paste

	const [createPaste] = useCreatePasteMutation()
	const createPasteFunc: SubmitHandler<IRequestCreatePaste> = async req => {
		// Видаляємо пусті поля
		const filteredReq = { ...req }
		if (!filteredReq.syntax) {
			delete filteredReq.syntax
		}
		if (!filteredReq.password) {
			delete filteredReq.password
		}

		try {
			const data = await createPaste(filteredReq)
			console.log('ok', data)
			// refetch()
		} catch (error) {
			console.log('Failed to create paste:', error)
		}
	}

	if (!isAuthenticated) {
		return (
			<div className='bg-gray-300 py-40 md:px-10'>
				<main className='flex flex-col items-center mt-10'>
					<h1 className='text-7xl sm:text-4xl text-center font-bold mb-4 '>
						Welcome to QuickPaste!
					</h1>
					<p className='text-xl sm:text-lg text-center max-w-2xl mb-8'>
						QuickPaste is a simple and efficient tool for creating, sharing, and
						managing text notes. Whether you need to save your information,
						notes, or any other text, QuickPaste makes it easy. Log in or sign
						up to start creating and sharing your pastes today!
					</p>
					<div className='flex space-x-4'>
						<Link
							to='/login'
							className='px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700'
						>
							Log In
						</Link>
						<Link
							to='/signup'
							className='px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
						>
							Sign Up
						</Link>
					</div>
				</main>
			</div>
		)
	}

	// if (isLoading) {
	// 	return <div className='mt-28'>Loading...</div>
	// }

	// if (error) {
	// 	return <div className='mt-28'>Error: {error.message}</div>
	// }

	return (
		<>
			<div className='mt-28'>
				{/* <PasteForm
					submitFunc={createPasteFunc}
					submitButton={createPasteButtonProps}
				/>
				<h1 className='text-7xl sm:text-4xl mt-16 text-center'>Pastes</h1>
				<ul>
					{pastes && pastes.length > 0 ? (
						pastes.map(paste => (
							<PasteItem key={paste.id} paste={paste} refetch={refetch} />
						))
					) : (
						<p className='text-center mt-4 mb-8 text-gray-600'>
							No pastes available.
						</p>
					)}
				</ul> */}
			</div>
		</>
	)
}

export default Home
