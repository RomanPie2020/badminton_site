import { Link } from 'react-router-dom'
import { IBaseButton } from '../../shared/interfaces/models'
import { useAppSelector } from '../../store/store'

const createPasteButtonProps: IBaseButton = {
	title: 'Create',
	styles: 'signup-button',
	to: '',
	type: 'button',
}

function Home() {
	const isAuthenticated = useAppSelector(
		state => state.authStatus.isAuthenticated
	)

	if (!isAuthenticated) {
		return (
			<div className='min-h-screen bg-gradient-to-t from-sky-200 to-indigo-300 py-40 md:px-6'>
				<main className='flex flex-col items-center mt-10'>
					<h1 className='text-7xl sm:text-3xl text-center font-bold mb-4 px-8'>
						Вітаємо на BadmickTogether!
					</h1>
					<p className='my-8 text-2xl sm:text-lg max-w-2xl text-center'>
						Цей сайт створений, щоб допомогти вам легко знаходити однодумців та
						організовувати захоплюючі ігри в бадмінтон. Незалежно від вашого
						рівня майстерності – від початківця до досвідченого гравця – тут ви
						знайдете ідеального партнера чи команду.
					</p>
					<div className='flex space-x-4'>
						<Link
							to='/login'
							className='px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700'
						>
							Увійти
						</Link>
						<Link
							to='/signup'
							className='px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
						>
							Зареєструватися
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
	// #TODO розібратись з медіа запитами
	return (
		<>
			<div className='w-full min-h-screen bg-gradient-to-t from-slate-200 to-indigo-400 py-40'>
				{/* <div className='absolute inset-0'></div> */}
				<div className='flex flex-col items-center justify-center mt-10'>
					<h1 className='text-6xl sm:text-3xl text-center font-bold mb-4 max-w-5xl px-6 sm:px-8'>
						Приєднуйся до подій BadmickTogether та грай бадмінтон релаксуючи!!!
					</h1>
					<div className='mb-8 max-w-5xl m-auto xl:px-8'>
						<p className='text-xl sm:text-lg text-center max-w-2xl mb-8 mt-4'></p>
						<p className='mb-8 text-xl sm:text-lg'>
							Цей сайт створений, щоб допомогти вам легко знаходити однодумців
							та організовувати захоплюючі ігри в бадмінтон. Незалежно від
							вашого рівня майстерності – від початківця до досвідченого гравця
							– тут ви знайдете ідеального партнера чи команду.
						</p>

						<h2 className='mb-8 text-2xl font-bold'>
							Що ви можете робити на сайті?
						</h2>
						<ul className='list-disc'>
							<li>
								<p className='text-xl mb-4'>
									<span className='highlight'>
										<strong className='text-xl'>Створювати події:</strong>
									</span>{' '}
									створюйте події, вказуючи детальний опис до них, щоб полегшити
									приєднання до вашої гри іншим учасникам. Це дасть змогу знайти
									ідеальних партнерів для вашої спільної гри.
								</p>
							</li>
							<li>
								<p className='text-xl mb-4'>
									<span className='highlight'>
										<strong className='text-xl'>
											Приєднуватися до існуючих подій:
										</strong>
									</span>{' '}
									переглядайте список подій, використовуйте фільтри, сортування
									та пошук, знаходьте ті події, що вам до вподоби, та
									приєднуйтесь для участі у них.
								</p>
							</li>
							<li>
								<p className='text-xl mb-4'>
									<span className='highlight'>
										<strong className='text-xl'>
											Комунікувати з іншими учасниками:
										</strong>
									</span>{' '}
									обговорюйте стратегії, діліться враженнями, знайомтесь та
									розширюйте коло своїх знайомств у бадмінтонній спільноті
									завдяки контактам користувачів у їхніх профілях.
								</p>
							</li>
						</ul>

						<p className='mb-8 text-xl sm:text-lg'>
							Долучайтеся до подій вже сьогодні та почніть насолоджуватися грою
							в бадмінтон на повну! Ми віримо, що разом ми зможемо зробити
							бадмінтон ще більш доступним та цікавим для кожного.
						</p>
						<div />
						<div className='flex space-x-4 justify-center'>
							<Link
								to='/events'
								className='px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700'
							>
								Перейти до подій
							</Link>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default Home
