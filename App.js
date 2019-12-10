/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {useContext} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  AsyncStorage,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import {PersistGate} from 'redux-persist/integration/react';
import thunk from 'redux-thunk';
import rootReducer from './src/reducers';
import {persistStore, persistReducer} from 'redux-persist';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware, compose} from 'redux';
//Navigation
import {FeedScreen} from './src/screens/FeedScreen';
import 'react-native-gesture-handler';
import AppNavigator from './src/navigation/AppNavigator';
//Theme
import i18n from 'i18n-js';
import * as RNLocalize from 'react-native-localize';
import {en} from './src/i18n/localization';
//Firebase
import firebase from '@react-native-firebase/app';
import {ThemeProvider as MyThemeProvider} from './src/theme/themeContext'
import { ThemeProvider, Button } from 'react-native-elements';

import theme from './src/theme/theme';
import { GoogleSignin } from '@react-native-community/google-signin';

// Change depending on project
import {google} from './src/constants/google'


GoogleSignin.configure(google);

const persistedReducer = persistReducer(
    {
      key: 'root',
      storage: AsyncStorage,
      whitelist: ['Auth'],
    },

    rootReducer,
);

export const store = createStore(
    persistedReducer,
    {},
    compose(applyMiddleware(thunk)),
);

const persist = persistStore(store);

i18n.fallbacks = true;
i18n.translations = {en};
i18n.locale = RNLocalize.getLocales()[0].languageCode;

const App: () => React$Node = () => {
  return (
      <ThemeProvider theme={theme('light')}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persist}>
            <StatusBar barStyle="light-content" />
            <AppNavigator />
          </PersistGate>
        </Provider>
      </ThemeProvider>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
