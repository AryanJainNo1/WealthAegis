import { createTheme } from '@mui/material/styles';
// Main palette from your image:
// #FFFFFF, #242424, #5C7C89, #1F4959, #011425
const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#1F4959', // main accent (buttons, icons, etc)
            contrastText: '#FFFFFF',
            dark: '#011425',
            light: '#5C7C89',
        },
        secondary: {
            main: '#5C7C89', // secondary accent
            contrastText: '#FFFFFF',
        },
        background: {
            default: '#FFFFFF', // overall background
            paper: '#FFFFFF', // cards and sheets
        },
        text: {
            primary: '#242424',
            secondary: '#5C7C89',
        },
        divider: '#5C7C89',
        info: {
            main: '#011425',
            contrastText: '#FFFFFF',
        },
        warning: {
            main: '#fab005',
        },
        success: {
            main: '#1F4959',
        },
        error: {
            main: '#b00020',
        },
    },
    components: {
        MuiAppBar: {
            styleOverrides: {
                root: {
                    background: '#011425',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                containedPrimary: {
                    background: 'linear-gradient(90deg,#1F4959 80%,#5C7C89 100%)',
                    color: '#FFFFFF',
                    '&:hover': {
                        background: '#5C7C89',
                    },
                },
                outlined: {
                    borderColor: '#5C7C89',
                    color: '#1F4959',
                    '&:hover': {
                        background: '#e3eaf0',
                        borderColor: '#1F4959',
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    background: '#FFFFFF',
                },
            },
        },
        MuiTabs: {
            styleOverrides: {
                indicator: {
                    backgroundColor: '#1F4959',
                },
            },
        },
        MuiTab: {
            styleOverrides: {
                root: {
                    color: '#5C7C89',
                    '&.Mui-selected': {
                        color: '#1F4959',
                        fontWeight: 800,
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    background: '#FFFFFF',
                    border: '1.2px solid #5C7C89',
                    boxShadow: '0 4px 20px 4px rgba(1,20,37,0.05)'
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    background: '#5C7C89',
                    color: '#FFFFFF',
                    fontWeight: 700,
                },
                outlined: {
                    background: '#FFFFFF',
                    color: '#1F4959',
                    borderColor: '#5C7C89',
                },
            },
        },
        MuiAvatar: {
            styleOverrides: {
                root: {
                    background: '#1F4959',
                    color: '#FFFFFF',
                },
            },
        },
        MuiLinearProgress: {
            styleOverrides: {
                root: {
                    backgroundColor: '#5C7C89',
                },
                bar: {
                    background: 'linear-gradient(90deg,#1F4959 60%,#5C7C89 100%)'
                }
            }
        },
        MuiDivider: {
            styleOverrides: {
                root: {
                    borderColor: '#5C7C89',
                }
            }
        }
    }
});
export default theme;
