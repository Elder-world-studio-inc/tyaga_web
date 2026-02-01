/** @type {import('tailwindcss').Config} */
function withOpacity(variableName) {
  return ({ opacityValue }) => {
    if (opacityValue !== undefined) {
      return `rgba(var(${variableName}), ${opacityValue})`
    }
    return `rgb(var(${variableName}))`
  }
}

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: withOpacity('--color-background'),
        surface: withOpacity('--color-surface'),
        primary: {
          DEFAULT: withOpacity('--color-primary'),
          glow: withOpacity('--color-primary-glow'),
          dim: withOpacity('--color-primary-dim')
        },
        text: {
          main: withOpacity('--color-text-main'),
          muted: withOpacity('--color-text-muted')
        }
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
