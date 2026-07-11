/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#D4AF37',
          gold: '#D4AF37',
          highlight: '#F2C14E',
          dark: '#06111E',
        },
        navy: {
          950: '#06111E',
          900: '#0D1B2A',
          800: '#13283D',
        },
        products: {
          answerbrief: '#2563EB',
          mixpilot: '#A855F7',
          taxBuddy: '#10B981',
          taxAppeal: '#06B6D4',
          interviewCoach: '#F97316',
          workforceStudy: '#FBBF24',
          platform: '#6366F1',
        },
        accent: '#14B8A6',
        success: '#34D399',
        warning: '#FBBF24',
        error: '#FB7185',
        neutral: {
          light: '#F3F4F6',
          medium: '#D1D5DB',
          dark: '#6B7280',
        },
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        '2xl': '48px',
        '3xl': '64px',
        '4xl': '96px',
        '5xl': '128px',
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '18px',
        xl: '24px',
        '2xl': '28px',
      },
      boxShadow: {
        xs: '0 1px 2px rgba(0, 0, 0, 0.05)',
        sm: '0 8px 18px rgba(0, 0, 0, 0.14)',
        md: '0 18px 44px rgba(0, 0, 0, 0.2)',
        lg: '0 24px 80px rgba(0, 0, 0, 0.28)',
        gold: '0 24px 80px rgba(212, 175, 55, 0.12)',
      },
      fontSize: {
        display: ['72px', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '800' }],
        h1: ['56px', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '700' }],
        h2: ['40px', { lineHeight: '1.3', letterSpacing: '0em', fontWeight: '700' }],
        h3: ['28px', { lineHeight: '1.4', letterSpacing: '0em', fontWeight: '600' }],
        'body-lg': ['18px', { lineHeight: '1.6', letterSpacing: '0em', fontWeight: '400' }],
        base: ['16px', { lineHeight: '1.6', letterSpacing: '0em', fontWeight: '400' }],
        sm: ['14px', { lineHeight: '1.5', letterSpacing: '0em', fontWeight: '400' }],
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['Fira Code', 'Monaco', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'pulse-subtle': 'pulseSubtle 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
      },
      transitionDuration: {
        150: '150ms',
        200: '200ms',
        300: '300ms',
      },
    },
  },
  plugins: [
    function ({ addBase }) {
      addBase({
        'html': {
          scrollBehavior: 'smooth',
        },
        '@media (prefers-reduced-motion: reduce)': {
          'html': {
            scrollBehavior: 'auto',
          },
          '*': {
            animation: 'none !important',
            transition: 'none !important',
          },
        },
      });
    },
  ],
};
