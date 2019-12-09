import React from 'react';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import MainTabNavigator from './MainTabNavigator';

import {SignInScreen} from '../screens/SignInScreen';
import {SignUpScreen} from '../screens/SignUpScreen';

import {AuthLoadingScreen} from '../screens/AuthLoadingScreen';

const AuthStack = createStackNavigator({signIn: SignInScreen, signUp: SignUpScreen, },
    {
        headerMode: 'none',
        navigationOptions: {
            headerVisible: false,
        }
    });

export default createAppContainer(
  createSwitchNavigator({
    // You could add another route here for authentication.
    // Read more at https://reactnavigation.org/docs/en/auth-flow.html
    AuthLoading: AuthLoadingScreen,
    Auth: AuthStack,
    // Main: MainTabNavigator,
  }),
);
