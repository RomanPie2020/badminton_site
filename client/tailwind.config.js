/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			backgroundImage: theme => ({
				// logo: "url('./assets/images/logo.png')",
				shuttlecock_badminton_icon:
					"url('./assets/images/shuttlecock-badminton-icon.png')",
				shuttlecock_icon: "url('./assets/images/shuttlecock-icon.svg')",
				topbar_logo: "url('./assets/images/topbar_logo.png')",
				gradient_grey: 'linear-gradient(to right, #f0f0f0, #cccccc)',
				gradient_grey_blue: 'linear-gradient(to right, #f0f4f8, #cfd9df)',
			}),
			screens: {
				xs: { min: '0px', max: '424px' },
				sm: { min: '425px', max: '639px' },
				md: { min: '640px', max: '767px' },
				lg: { min: '768px', max: '1023px' },
				xl: { min: '1024px', max: '1279px' },
				xl2: { min: '1280px', max: '1535px' },
			},
		},
	},
	plugins: [],
}
