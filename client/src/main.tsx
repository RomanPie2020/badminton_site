import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import TopBar from './components/layout/TopBar/TopBar'
import EnterEmail from './components/screens/EnterEmail'
import { ErrorPage } from './components/screens/ErrorPage'
import GoogleSuccess from './components/screens/GoogleSuccess'
import Home from './components/screens/Home'
import LogIn from './components/screens/LogIn'
import ProfileForm from './components/screens/ProfileForm'
import { RegisterConfirm } from './components/screens/RegisterConfirm'
import ResetPassword from './components/screens/ResetPassword'
import SignUp from './components/screens/SignUp'
import './index.css'
import { store } from './store/store'

// #todo додати quizet ,для утримання одного елементу на усіх ендпоінтах
const router = createBrowserRouter([
	{
		path: '/',
		element: <TopBar />,
		errorElement: <ErrorPage />,
		children: [
			{
				index: true,
				element: <Home />,
			},
			{
				path: '/login',
				element: <LogIn />,
			},
			{
				path: '/signup',
				element: <SignUp />,
			},
			{
				path: '/auth/confirm',
				element: <RegisterConfirm />,
			},
			// {
			// 	path: '/codeverification',
			// 	element: <CodeVerificationPage />,
			// },
			{
				path: '/profile',
				element: <ProfileForm />,
			},
			// {
			// 	path: '/paste/:url',
			// 	element: <Paste />,
			// },
			{
				path: '/google/success',
				element: <GoogleSuccess />,
			},
			{
				path: '/enter-email',
				element: <EnterEmail />,
			},
			{
				path: '/auth/reset-password',
				element: <ResetPassword />,
			},
		],
	},
])

// const root = ReactDOM.createRoot(
//   document.getElementById('root') as HTMLElement
// )
//
// root.render(
//   <RouterProvider router={router}/>
// )

ReactDOM.createRoot(document.getElementById('root')!).render(
	<Provider store={store}>
		<RouterProvider router={router} />
	</Provider>
)
