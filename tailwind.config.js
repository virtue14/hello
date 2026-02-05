const defaultTheme = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app.pug', './index.pug', './views/**/*.pug', './assets/**/*.pug'],
  darkMode: 'class',
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1100px',
      xl: '1400px',
      '2xl': '1820px'
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      h: {
        100: '#ffffff',
        200: '#f4f4f6',
        300: '#e6e6e9',
        400: '#9999a1',
        500: '#66666e',
        600: '#353638',
        700: '#292a2d',
        800: '#1e1f21',
        900: '#000000',
        blue: '#5db0d7',
        orange: '#ff5544'
      }
    },
    extend: {
      spacing: {
        idx: 'var(--h-idx)',
        pem: 'var(--h-pem)',
        s: 'var(--h-s)',
        c: 'var(--h-c)',
        h: 'var(--h-h)'
      },
      fontSize: {
        '2xs': '0.625rem'
      },
      minHeight: {
        h: 'var(--h-h)'
      },
      keyframes: {
        loading: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        }
      },
      animation: {
        loading: 'loading 1s linear infinite'
      },
      fontFamily: {
        sans: [
          'SUIT',
          'ui-sans-serif', 'system-ui', 'sans-serif', '"Apple Color Emoji"', '"Segoe UI Emoji"', '"Segoe UI Symbol"', '"Noto Color Emoji"'
        ],
        mono: [
          '"Source Code Pro"',
          ...defaultTheme.fontFamily.mono
        ]
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: 'inherit',
            a: { color: '#5db0d7', textDecoration: 'none' },
            'h1, h3, h4, h5, h6': { color: 'inherit', fontWeight: '700', borderBottom: 'none' },
            h2: { marginTop: '2rem', borderBottom: '1px solid #e6e6e9', paddingBottom: '0.5rem' },
            h3: { marginTop: '1.5rem' },
            strong: { color: 'inherit' },
            code: { color: '#5db0d7', backgroundColor: '#f4f4f6', padding: '0.2rem 0.4rem', borderRadius: '0.25rem' },
            'code::before': { content: 'none' },
            'code::after': { content: 'none' },
            pre: { backgroundColor: '#282c34' },
            blockquote: { borderLeftColor: '#5db0d7', color: 'inherit' },
            'ul > li::marker': { color: '#5db0d7' },
            'ol > li::marker': { color: '#5db0d7' },
            table: {
              width: '100%',
              borderCollapse: 'collapse',
              borderRadius: '0.5rem',
              overflow: 'hidden',
              border: '1px solid #e6e6e9'
            },
            thead: { backgroundColor: '#f4f4f6' },
            th: {
              padding: '0.75rem 1rem',
              textAlign: 'left',
              fontWeight: '600',
              borderBottom: '2px solid #e6e6e9',
              borderRight: '1px solid #e6e6e9'
            },
            'th:last-child': { borderRight: 'none' },
            td: {
              padding: '0.75rem 1rem',
              borderBottom: '1px solid #e6e6e9',
              borderRight: '1px solid #e6e6e9'
            },
            'td:last-child': { borderRight: 'none' },
            'tbody tr:hover': { backgroundColor: '#fafafa' },
            'tbody tr:last-child td': { borderBottom: 'none' }
          }
        },
        invert: {
          css: {
            h2: { borderBottomColor: '#353638' },
            table: { borderColor: '#353638' },
            thead: { backgroundColor: '#292a2d' },
            th: { borderBottomColor: '#66666e', borderRightColor: '#353638' },
            td: { borderBottomColor: '#353638', borderRightColor: '#353638' },
            'tbody tr:hover': { backgroundColor: '#1e1f21' },
            code: { backgroundColor: '#353638' },
          }
        }
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography')
  ]
}
