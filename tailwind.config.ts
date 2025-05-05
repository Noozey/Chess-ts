import animate from 'tailwindcss-animate';
import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: 'true',
      padding: '1.5rem',
    },
    extend: {
      screens: {
        small: '1800px',
      },
      backgroundImage: {
        bg: 'var(--bg-pattern)',
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        chart: {
          1: 'hsl(var(--chart-1))',
          2: 'hsl(var(--chart-2))',
          3: 'hsl(var(--chart-3))',
          4: 'hsl(var(--chart-4))',
          5: 'hsl(var(--chart-5))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      boxShadow: {
        '3d-hover': '5px 5px 0px rgba(0, 0, 0, 0.8)',
        '3d': '4px 4px 0px rgba(0, 0, 0, 0.8)',
        '3d-active': '2px 2px 0px rgba(0, 0, 0, 0.8)',
      },
      keyframes: {
        bubble: {
          '0%': {
            transform: 'scale(1)',
          },
          '13%': {
            transform: 'scale(1.2)',
          },
          '20%': {
            transform: 'scale(1) rotate(0deg)',
          },
          '25%': {
            transform: 'scale(1) rotate(0deg)',
          },
          '50%': {
            transform: 'scale(1) rotate(359deg)',
          },
          '50.001%': {
            transform: 'scale(1) rotate(0deg)',
          },
          '100%': {
            transform: 'scale(1)',
          },
        },
        pointRight: {
          '0%': {
            transform: 'translateX(0)',
          },
          '10%': {
            transform: 'translateX(4px)',
          },
          '20%': {
            transform: 'translateX(-2px)',
          },
          '30%': {
            transform: 'translateX(4px)',
          },
          '40%': {
            transform: 'translateX(-2px)',
          },
          '100%': {
            transform: 'translateX(0)',
          },
        },
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
      },
      animation: {
        pointRight: 'pointRight 2.5s ease-in-out infinite',
        'spin-once': 'spin 0.5s ease-in-out',
        bubble: 'bubble 3s ease-in-out infinite',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [animate],
};

export default config;
