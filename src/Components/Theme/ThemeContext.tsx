import React, { createContext, useContext, useState} from 'react';
import { CssBaseline, ThemeProvider as MUIThemeProvider } from '@mui/material';
import { lightTheme, darkTheme } from './Themes';

// Define types for the theme and context

type ThemeContextType = {
  isDarkMode: boolean;
  toggleTheme: () => void;
  setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}

// Create the context with a default value
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode}> = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    const toggleTheme = () => {
        setIsDarkMode( prev => !prev);
    };

    const theme = isDarkMode ? darkTheme : lightTheme;
    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleTheme, setIsDarkMode }}>
            <MUIThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </MUIThemeProvider>
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};