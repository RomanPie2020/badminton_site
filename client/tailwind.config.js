/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			backgroundImage: theme => ({
				logo: "url('./assets/images/logo.png')",
				gradient_grey: 'linear-gradient(to right, #f0f0f0, #cccccc)',
				gradient_grey_blue: 'linear-gradient(to right, #f0f4f8, #cfd9df)',
			}),
			screens: {
				sm: { max: '640px' },
				md: { max: '768px' },
				lg: { max: '1024px' },
				xl: { max: '1280px' },
				xl2: { max: '1536px' },
			},
		},
	},
	plugins: [],
}
