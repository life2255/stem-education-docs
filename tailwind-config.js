/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue',
    './content/**/*.md'
  ],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '70ch',
            color: 'rgb(var(--color-gray-700))',
            a: {
              color: 'rgb(var(--color-primary-500))',
              '&:hover': {
                color: 'rgb(var(--color-primary-600))',
              },
            },
            'h1, h2, h3, h4': {
              color: 'rgb(var(--color-gray-900))',
            },
            code: {
              backgroundColor: 'rgb(var(--color-gray-100))',
              padding: '0.25rem 0.375rem',
              borderRadius: '0.25rem',
              fontWeight: '400',
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
            pre: {
              backgroundColor: 'rgb(var(--color-gray-900))',
            },
            blockquote: {
              borderLeftColor: 'rgb(var(--color-primary-500))',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}