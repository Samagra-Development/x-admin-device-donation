import { defaultTheme } from 'react-admin';
import merge from 'lodash/merge';
import indigo from '@material-ui/core/colors/indigo';
import pink from '@material-ui/core/colors/pink';
import red from '@material-ui/core/colors/red';

const customTheme = merge({}, defaultTheme, {
    palette: {
        primary: indigo,
        secondary: pink,
        error: red,
        contrastThreshold: 3,
        tonalOffset: 0.2,
    },
    typography: {
        // Use the system font instead of the default Roboto font.
        fontFamily: ['Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Arial', 'sans-serif'].join(','),
    },
    overrides: {
        MuiButton: { // override the styles of all instances of this component
            root: { // Name of the rule
                color: 'white', // Some CSS
            },
        },
        MuiTableCell: {
            root: {
                fontFamily: 'Martel Sans'
            },
            head: {
                    color: '#00000058',
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                    borderBottom: '1px solid lavender',
                    textTransform: 'uppercase',
                    backgroundColor: '#F8FAFC'
            }              
        },
    },
});

export default customTheme;