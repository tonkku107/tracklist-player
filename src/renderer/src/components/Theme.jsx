import { ThemeProvider, useTheme } from '@emotion/react';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { CssBaseline, IconButton, Tooltip, useMediaQuery } from '@mui/material';
import { alpha, createTheme, getContrastRatio, responsiveFontSizes } from '@mui/material/styles';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

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

const ThemeModeContext = createContext({ toggleMode: () => {} });

export const ThemeToggle = () => {
  const theme = useTheme();
  const themeMode = useContext(ThemeModeContext);

  const tooltipText = `Switch to ${
    theme.palette.mode === 'dark' ? 'light' : 'dark'
  } theme. Right click to follow system theme.`;

  return (
    <>
      <Tooltip title={tooltipText}>
        <span>
          <IconButton
            onClick={themeMode.toggleMode}
            onContextMenu={themeMode.system}
            color="primary"
            aria-label="Theme toggle"
          >
            {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </span>
      </Tooltip>
    </>
  );
};

export default function Theme({ children }) {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [mode, setMode] = useState(prefersDarkMode ? 'dark' : 'light');

  useEffect(() => {
    setMode(prefersDarkMode ? 'dark' : 'light');
  }, [prefersDarkMode]);

  const themeMode = useMemo(
    () => ({
      toggleMode: async () => {
        if (window.api?.theme) {
          const shouldUseDarkColors = await window.api.theme.toggle();
          setMode(shouldUseDarkColors ? 'dark' : 'light');
        } else {
          setMode(prevMode => (prevMode === 'light' ? 'dark' : 'light'));
        }
      },
      system: async () => {
        if (window.api?.theme) {
          const shouldUseDarkColors = await window.api.theme.system();
          setMode(shouldUseDarkColors ? 'dark' : 'light');
        } else {
          setMode(prefersDarkMode ? 'dark' : 'light');
        }
      },
    }),
    [prefersDarkMode]
  );
  const theme = useMemo(() => getTheme(mode), [mode]);

  return (
    <ThemeModeContext.Provider value={themeMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline enableColorScheme />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
}
