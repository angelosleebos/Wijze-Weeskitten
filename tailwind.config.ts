import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef6f9',
          100: '#feeef5',
          200: '#fdd9e8',
          300: '#fcbad6',
          400: '#f78fb8',
          500: '#ee6fa0',
          600: '#de4c7f',
          700: '#c23964',
          800: '#a03153',
          900: '#862d49',
        },
      },
    },
  },
  plugins: [],
}
export default config
