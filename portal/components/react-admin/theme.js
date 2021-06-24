import { defaultTheme } from 'react-admin';
import merge from 'lodash/merge';
import indigo from '@material-ui/core/colors/indigo';
import pink from '@material-ui/core/colors/pink';
import red from '@material-ui/core/colors/red';

const primaryColour = {
    main: '#303765'
}

const darkGrey = {
    main: '#343A40'
}

const heading = {
    main: '#FAFAFAEE',
    light: '#FAFAFAAA'
}

const customTheme = merge({}, defaultTheme, {
    palette: {
        primary: primaryColour,
        heading: heading,
        secondary: pink,
        error: red,
        grey: darkGrey,
        contrastThreshold: 3,
        tonalOffset: 0.2,
    },
    typography: {
        // Use the system font instead of the default Roboto font.
        fontFamily: ['Martel Sans', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Arial', 'sans-serif'].join(','),
        body1: {
            fontSize: '1.4rem'
        },
        h6: {
            fontSize: '1.45rem'
        },
        h5: {
            fontSize: '1.65rem'
        }
    },
    overrides: {
        MuiButton: { // override the styles of all instances of this component
            root: { // Name of the rule
                color: 'white', // Some CSS
            },
        },
        MuiTableCell: { // Replace the font of the list items
            root: {
                fontFamily: 'Martel Sans'
            },
            head: { // Add styling for the heading row in lists
                    color: '#00000058',
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                    borderBottom: '1px solid lavender',
                    textTransform: 'uppercase',
                    backgroundColor: '#F8FAFC'
            }              
        },
        MuiToolbar: {
            regular: {
                minHeight: '10vh',                
            }                       
        },
        MuiFilledInput: {
            root: {
                backgroundColor: '#F8FAFC'
            },
            input: {
                fontSize: '0.9rem',
            }
        },
        MuiMenuItem: {
            root: {
                fontSize: '0.9rem'
            }
        }
    },
});

export default customTheme;