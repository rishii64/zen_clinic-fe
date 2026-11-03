/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Material Design 3 Palette
        md: {
          primary: '#0b57d0',            // Google Material Blue
          'on-primary': '#ffffff',
          'primary-container': '#d3e3fd',
          'on-primary-container': '#041e49',
          surface: '#ffffff',
          'surface-dim': '#f8fafd',
          'surface-variant': '#eef2f8',
          'surface-container': '#f0f4f9',
          'surface-container-high': '#e9eef6',
          'on-surface': '#1f1f1f',
          'on-surface-variant': '#444746',
          outline: '#74777f',
          'outline-variant': '#c4c7c5',
          secondary: '#00639b',
          'secondary-container': '#c2e7ff',
          'on-secondary-container': '#001d35',
          tertiary: '#006a6a',
          'tertiary-container': '#6ff7f6',
          error: '#ba1a1a',
          'error-container': '#ffdad6',
          'on-error-container': '#410002',
          success: '#137333',
          'success-container': '#ceead6',
          'on-success-container': '#072711',
          warning: '#b06000',
          'warning-container': '#ffe082',
          'on-warning-container': '#261300',
        }
      },
      fontFamily: {
        sans: ['Roboto', 'Plus Jakarta Sans', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'm3-1': '0px 1px 3px 1px rgba(0, 0, 0, 0.08), 0px 1px 2px 0px rgba(0, 0, 0, 0.12)',
        'm3-2': '0px 2px 6px 2px rgba(0, 0, 0, 0.08), 0px 1px 2px 0px rgba(0, 0, 0, 0.15)',
        'm3-3': '0px 4px 8px 3px rgba(0, 0, 0, 0.08), 0px 1px 3px 0px rgba(0, 0, 0, 0.15)',
        'm3-4': '0px 6px 10px 4px rgba(0, 0, 0, 0.08), 0px 2px 3px 0px rgba(0, 0, 0, 0.15)',
      },
      borderRadius: {
        '4xl': '2rem',
      }
    },
  },
  plugins: [],
}
