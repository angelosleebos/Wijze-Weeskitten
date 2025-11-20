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
          500: 'rgb(var(--color-primary-rgb, 238 111 160))',
          600: 'rgb(var(--color-primary-rgb, 222 76 127))',
          700: 'rgb(var(--color-primary-rgb, 194 57 100))',
          800: 'rgb(var(--color-primary-rgb, 160 49 83))',
          900: 'rgb(var(--color-primary-rgb, 134 45 73))',
        },
      },
    },
  },
  plugins: [],
}
export default config
