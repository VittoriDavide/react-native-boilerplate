import React, {ReactNode} from 'react';
import theme from './theme';
import {View} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

const defaultContextData = {
  computedTheme: {},
  dark: false,
  toggle() {},
};

const ThemeContext = React.createContext(defaultContextData);
const useTheme = () => React.useContext(ThemeContext);

const useEffectDarkMode = () => {
  const [themeState, setThemeState] = React.useState({
    dark: false,
    hasThemeLoaded: false,
  });
  React.useEffect(() => {
    const lsDark = AsyncStorage.getItem('dark') === 'true';
    setThemeState({...themeState, dark: lsDark, hasThemeLoaded: true});
  }, []);

  return [themeState, setThemeState];
};

const ThemeProvider = ({children}: {children: ReactNode}) => {
  const [themeState, setThemeState] = useEffectDarkMode();

  if (!themeState.hasThemeLoaded) {
    /*
          If the theme is not yet loaded we don't want to render
          this is just a workaround to avoid having the app rendering
          in light mode by default and then switch to dark mode while
          getting the theme state from localStorage
        */
    return <View />;
  }

  const computedTheme = themeState.dark ? theme('dark') : theme('light');
  const toggle = () => {
    const dark = !themeState.dark;
    AsyncStorage.setItem('dark', JSON.stringify(dark));
    setThemeState({...themeState, dark});
  };

  return (
    <ThemeContext.Provider
      // theme={computedTheme}
      value={{
        computedTheme,
        dark: themeState.dark,
        toggle,
      }}>
      {children}
    </ThemeContext.Provider>
  );
};

export {ThemeProvider, useTheme, ThemeContext};
