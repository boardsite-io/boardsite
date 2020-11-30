import { red } from '@material-ui/core/colors';
import { createMuiTheme } from '@material-ui/core/styles';

// A custom theme for this app
const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#00D2BE',
    },
    secondary: {
      main: '#000',
    },
    tertiary: {
      main: '#88888888',
      border: '1px solid #00000088'
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#949398',
    },
  },
});

export default theme;
