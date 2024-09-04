import { createTheme, Theme } from '@mui/material/styles';
import colors from '../../colors';

export const lightTheme: Theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    background: {
      default: colors.White,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          color: colors.White,
        },
      },
    },
  },
});

export const darkTheme: Theme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#90caf9',
      },
      background: {
        default: colors.MineShaft,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            color: colors.White,
          },
        },
      },
    },
  });