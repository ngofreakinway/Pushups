export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#000000',
        'surface-1': '#13131a',
        'surface-2': '#1c1c24',
        'surface-3': '#25252f',
        ink: '#ffffff',
        'ink-muted': '#b2b6bd',
        'ink-subtle': '#656a76',
        hairline: 'rgba(178,182,189,0.1)',
        'hairline-soft': 'rgba(178,182,189,0.06)',
        'accent-blue': '#0091ff',
        'product-terraform': '#844fba',
        'product-vault': '#ffd814',
        'product-consul': '#e03875',
        'product-waypoint': '#14c6cb',
        'product-nomad': '#00bc7f',
        'product-vagrant': '#1868f2',
        'product-boundary': '#f04e57',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'helvetica', 'arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
