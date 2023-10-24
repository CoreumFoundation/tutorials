// theme.js or theme.ts
import { createTheme } from '@mui/material/styles';
import { Theme } from '@mui/material/styles';

export const COLORS = {
  background: '#272727',
  primary: '#A6E69E',
  secondary: '#A59EE6',
  lightGrey: '#c4c0c0',
  white: '#fff',
};

const BASE_SPACING = 1.688; // 27px based on 18px font size line-height

export const SIZES = {
  lineHeight: BASE_SPACING,
  borderRadius: {
    sm: 0.5,
    md: 1,
    lg: 1.25,
    xl: 1.688,
  },
};

const theme: Theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: COLORS['background'],
    },
    primary: {
      main: COLORS['primary'],
    },
    secondary: {
      main: COLORS['secondary'],
    },
  },
  typography: {
    fontFamily: '"Space Grotesk","Roboto","Helvetica", "Arial", sans-serif',
  },

  components: {
    MuiLink: {
      styleOverrides: {
        root: {
          color: COLORS['white'],
          textDecoration: 'none',
          '&:hover': {
            textDecoration: 'underline',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: `${SIZES['borderRadius']['md']}rem`,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          minWidth: '15.625rem',
          borderRadius: `${SIZES['borderRadius']['xl']}rem`,
          padding: `0.5rem ${SIZES['lineHeight']}rem`,
          fontWeight: 'bold',
          fontSize: '1.125rem',
          textTransform: 'none',
          '&:first-letter': {
            textTransform: 'capitalize',
          },
        },
        outlined: {
          color: '#fff',
        },
      },
    },

    MuiTypography: {
      styleOverrides: {
        h1: {
          fontSize: '5.625rem',
          fontStyle: 'normal',
          fontWeight: '700',
          lineHeight: '6rem',
          letterSpacing: '-0.3375rem',
        },
        h2: {
          fontSize: '4rem',
          fontStyle: 'normal',
          fontWeight: '700',
          lineHeight: '4.4rem',
          letterSpacing: '-0.24rem',
        },
        h3: {
          fontSize: '2.8125rem',
          fontStyle: 'normal',
          fontWeight: '700',
          lineHeight: '2.8125rem',
          letterSpacing: '0.15625rem',
          textTransform: 'uppercase',
        },
        h4: {
          fontSize: '2rem',
          fontStyle: 'normal',
          fontWeight: '700',
          lineHeight: '1.875rem',
          letterSpacing: '0.15625rem',
          textTransform: 'uppercase',
        },
        h5: {
          fontSize: '1.375rem',
          fontStyle: 'normal',
          fontWeight: '700',
          lineHeight: '1.3125rem',
          letterSpacing: '0.15625rem',
          textTransform: 'uppercase',
        },
        h6: {
          fontSize: '1rem',
          fontStyle: 'normal',
          fontWeight: '700',
          lineHeight: 'normal',
          letterSpacing: '0.03125rem',
        },
        body1: {
          fontFamily: 'Almarai',
          fontSize: '1.125rem',
          fontStyle: 'normal',
          fontWeight: '400',
          lineHeight: `${SIZES['lineHeight']}rem`,
        },
        body2: {
          fontFamily: 'Almarai',
          fontSize: '1m',
          fontStyle: 'normal',
          fontWeight: '400',
          lineHeight: `${SIZES['lineHeight']}rem`,
        },
      },
    },
  },
});

export default theme;
