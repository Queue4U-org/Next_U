/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#0A0B1C',
          900: '#0F1125',
          800: '#151832',
        },
        // Cyberpunk color palette
        cyber: {
          primary: '#6e00ff',
          secondary: '#00d0ff',
          face: '#1a1a2e',
          hud: '#00d0ff',
        }
      },
      // Custom shadows for cyberpunk effects
      boxShadow: {
        'cyber-face': 'inset 0 0 30px rgba(110, 0, 255, 0.3), 0 0 50px rgba(110, 0, 255, 0.5), 0 0 100px rgba(0, 208, 255, 0.3)',
        'cyber-eye': 'inset 0 0 20px rgba(110, 0, 255, 0.5), 0 0 30px rgba(110, 0, 255, 0.7)',
        'cyber-pupil': '0 0 20px #00d0ff, inset 0 0 10px rgba(0, 208, 255, 0.5)',
        'cyber-mouth': 'inset 0 -10px 20px rgba(110, 0, 255, 0.5), 0 0 20px rgba(110, 0, 255, 0.5)',
        'cyber-tooth': '0 0 5px #00d0ff',
      },
      // Custom border radius for the face shape
      borderRadius: {
        'cyber-face': '50% 50% 45% 45% / 60% 60% 40% 40%',
        'cyber-mouth': '0 0 50% 50% / 0 0 100% 100%',
      },
      // Custom background images for eye grid
      backgroundImage: {
        'eye-grid': 'linear-gradient(rgba(0, 208, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 208, 255, 0.1) 1px, transparent 1px)',
      },
      backgroundSize: {
        'grid-10': '10px 10px',
      },
      // Custom keyframes for glitch effect
      keyframes: {
        glitch: {
          '0%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
          '100%': { transform: 'translate(0)' },
        }
      },
      animation: {
        glitch: 'glitch 0.2s linear',
      },
    },
  },
  plugins: [],
};
