/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './lib/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      /**
       * Palette taken from the reference stylesheet. The source uses translucent
       * white surfaces (rgba(255,255,255,.03/.05/.08/.1)) over a #0e0e0e page -
       * these are the same values pre-composited to hex so Tailwind's opacity
       * modifiers (`bg-card/40`) keep working.
       */
      colors: {
        body: '#0e0e0e',
        fg: '#ffffff',
        card: '#151515', // white 3%
        'card-b': '#212121', // white 8% - card borders
        regular: '#262626', // white 10% - muted button fill
        divider: '#1a1a1a', // white 5%
        'btn-b': '#383838', // .btn border-color
        'btn-h': '#3a3a3a', // .btn:hover background
        accent: '#fc9918',
        'accent-2': '#fbf46d',
        'accent-h': '#fcc04e',
        'accent-2h': '#fcfa90',
        secondary: '#2aabee', // telegram blue
        success: '#34a853',
        danger: '#c21717',
        warning: '#fc9918',
      },
      backgroundImage: {
        // linear-gradient(269.93deg, …) - orange on the right, yellow on the left.
        // Prefixed so the utilities never collide with the `accent` colour.
        'grad-accent': 'linear-gradient(269.93deg, #fc9918 0.06%, #fbf46d 116.31%)',
        'grad-accent-h': 'linear-gradient(269.93deg, #fcc04e 0.06%, #fcfa90 116.31%)',
        'grad-telegram': 'linear-gradient(180deg, #2aabee 0%, #229ed9 99.26%)',
      },
      fontFamily: {
        sans: ['var(--font-geologica)', 'Geologica', 'Arial', 'sans-serif'],
        numeral: ['Arial', 'sans-serif'], // oversized step numerals
      },
      borderRadius: {
        card: '12px',
        btn: '16px',
        pill: '9999px',
      },
      maxWidth: {
        container: '1320px',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'accordion-down': {
          '0%': { height: '0', opacity: '0' },
          '100%': { height: 'var(--accordion-height)', opacity: '1' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        // Slow drift for the hero card. Small on purpose: the point is that the
        // card never quite settles, not that it visibly bobs.
        float: {
          '0%, 100%': { transform: 'translateY(-6px)' },
          '50%': { transform: 'translateY(6px)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s ease-out both',
        marquee: 'marquee 32s linear infinite',
        float: 'float 7s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
