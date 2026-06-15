/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Authentic Amazon palette
        amazon: {
          // Header / Nav
          navy: '#131921',
          navylight: '#232F3E',
          navyxlight: '#37475A',
          // Orange logo & links
          orange: '#FF9900',
          orangelight: '#FFA41C',
          orangedark: '#FEBD69',
          // CTAs
          yellow: '#FFD814',
          yellowHover: '#F7CA00',
          buy: '#FFA41C',
          buyHover: '#FA8900',
          // Surfaces
          bg: '#EAEDED',
          panel: '#F7F8F8',
          border: '#DDD',
          borderDark: '#C1C1C1',
          // Text
          text: '#0F1111',
          textMuted: '#565959',
          link: '#007185',
          linkHover: '#C7511F',
          // States
          deal: '#CC0C39',
          prime: '#00A8E1',
          green: '#067D62',
          greenDark: '#007600',
          red: '#B12704',
          // Stars
          star: '#FFA41C',
        },
      },
      fontFamily: {
        amazon: ['"Amazon Ember"', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(0,0,0,0.08), 0 1px 1px rgba(0,0,0,0.04)',
        cardHover: '0 4px 14px rgba(0,0,0,0.12)',
        header: '0 2px 4px rgba(0,0,0,0.2)',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulseRing: {
          '0%': { boxShadow: '0 0 0 0 rgba(255,153,0,.6)' },
          '70%': { boxShadow: '0 0 0 12px rgba(255,153,0,0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(255,153,0,0)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        shimmer: 'shimmer 2s linear infinite',
        fadeIn: 'fadeIn .35s ease-out both',
        slideDown: 'slideDown .25s ease-out both',
        scaleIn: 'scaleIn .2s ease-out both',
        pulseRing: 'pulseRing 1.6s cubic-bezier(0.4,0,0.6,1) infinite',
        marquee: 'marquee 30s linear infinite',
      },
    },
  },
  plugins: [],
};
