import { ThemeProvider } from '@emotion/react';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import BrightnessAutoIcon from '@mui/icons-material/BrightnessAuto';
import { CssBaseline, ToggleButton, ToggleButtonGroup, useMediaQuery } from '@mui/material';
import { alpha, createTheme, getContrastRatio, responsiveFontSizes } from '@mui/material/styles';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import '../font.css';

const getTheme = mode => {
  const rssColor = '#ee802f';
  const mcatFontFamily = '"Gotham Book","Roboto","Helvetica","Arial",sans-serif';
  const mcatBoldFontFamily = '"Gotham Bold","Roboto","Helvetica","Arial",sans-serif';

  let theme = createTheme({
    palette: {
      mode,
      rss: {
        main: rssColor,
        light: alpha(rssColor, 0.5),
        dark: alpha(rssColor, 0.9),
        contrastText: getContrastRatio(rssColor, '#fff') > 4.5 ? '#fff' : '#111',
      },
    },
    typography: {
      mcat_body1: {
        fontFamily: mcatFontFamily,
        fontWeight: 400,
        fontSize: '1rem',
        lineHeight: 1.5,
        letterSpacing: '0.00938em',
      },
      mcat_h3: {
        fontFamily: mcatBoldFontFamily,
        fontWeight: 400,
        fontSize: '3rem',
        lineHeight: 1.167,
        letterSpacing: '0em',
      },
      mcat_h4: {
        fontFamily: mcatFontFamily,
        fontWeight: 400,
        fontSize: '2.125rem',
        lineHeight: 1.235,
        letterSpacing: '0.00735em',
      },
    },
  });
  theme = responsiveFontSizes(theme, { breakpoints: ['sm', 'md', 'lg', 'xl'] });
  return theme;
};

const ThemeModeContext = createContext({ mode: 'system', setMode: () => {} });

export const ThemeToggle = () => {
  const themeMode = useContext(ThemeModeContext);

  return (
    <ToggleButtonGroup
      color="primary"
      value={themeMode.mode}
      exclusive
      onChange={(e, newMode) => themeMode.setMode(newMode)}
      aria-label="Theme toggle"
    >
      <ToggleButton value="system">
        <BrightnessAutoIcon fontSize="small" sx={{ mr: 1 }} />
        System
      </ToggleButton>
      <ToggleButton value="light">
        <Brightness7Icon fontSize="small" sx={{ mr: 1 }} />
        Light
      </ToggleButton>
      <ToggleButton value="dark">
        <Brightness4Icon fontSize="small" sx={{ mr: 1 }} />
        Dark
      </ToggleButton>
    </ToggleButtonGroup>
  );
};

export default function Theme({ children }) {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [mode, setMode] = useState('system');

  useEffect(() => {
    if (window.api?.theme) {
      window.api.theme.getTheme().then(setMode);
    }
  }, []);

  const themeMode = useMemo(
    () => ({
      mode,
      setMode: async theme => {
        if (window.api?.theme) {
          await window.api.theme.setTheme(theme);
        }
        setMode(theme);
      },
    }),
    [mode]
  );

  const theme = useMemo(
    () => getTheme(mode === 'system' ? (prefersDarkMode ? 'dark' : 'light') : mode),
    [mode, prefersDarkMode]
  );

  return (
    <ThemeModeContext.Provider value={themeMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline enableColorScheme />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
}
