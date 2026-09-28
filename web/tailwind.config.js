/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: 'var(--bg-canvas)',
        card: 'var(--bg-card)',
        subtle: 'var(--bg-subtle)',
        elevated: 'var(--bg-elevated)',
        'text-main': 'var(--text-main)',
        'text-body': 'var(--text-body)',
        'text-muted': 'var(--text-muted)',
        'border-card': 'var(--border-card)',
        'border-subtle': 'var(--border-subtle)',
        'primary-green': 'var(--primary-green)',
        'primary-hover': 'var(--primary-hover)',
        'primary-light': 'var(--primary-light)',
        cream:  { DEFAULT: '#FDF6E9', card: '#FFFCF5', dark: '#F5EDD6' },
        leaf:   { DEFAULT: '#2E7D32', light: '#4CAF50', dark: '#1B5E20', bg: '#E8F5E9', border: '#A5D6A7' },
        gold:   { DEFAULT: '#E8A93B', light: '#F5C46A', dark: '#D97706', bg: '#FFF8E7', border: '#F6D37A' },
        earth:  { heading: '#2C2416', body: '#5A4F3F', muted: '#8C7B6B', border: '#E8DDD0', divider: '#F0E8D8' },
        amber:  { warn: '#D97706', 'warn-bg': '#FEF3E2', 'warn-border': '#FBBF24' },
        sky:    { DEFAULT: '#0288D1', light: '#E1F5FE', border: '#81D4FA' },
        danger: { DEFAULT: '#C62828', bg: '#FFEBEE', border: '#EF9A9A' },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'xs':  ['13px', { lineHeight: '1.5' }],
        'sm':  ['15px', { lineHeight: '1.5' }],
        'base':['17px', { lineHeight: '1.6' }],
        'lg':  ['19px', { lineHeight: '1.5' }],
        'xl':  ['22px', { lineHeight: '1.4' }],
        '2xl': ['26px', { lineHeight: '1.3' }],
        '3xl': ['30px', { lineHeight: '1.2' }],
        '4xl': ['36px', { lineHeight: '1.1' }],
      },
      boxShadow: {
        'card':    '0 2px 8px 0 rgba(0,0,0,0.08), 0 0 0 1px var(--border-card)',
        'card-lg': '0 4px 20px 0 rgba(0,0,0,0.14), 0 0 0 1px var(--border-card)',
        'btn':     '0 2px 6px 0 rgba(46,125,50,0.25)',
        'btn-gold':'0 2px 6px 0 rgba(232,169,59,0.35)',
      },
      borderRadius: {
        'card': '16px',
        'btn':  '12px',
      },
    },
  },
  plugins: [],
}
