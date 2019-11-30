import React from 'react';
import {Platform} from 'react-native';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import {createStackNavigator} from 'react-navigation-stack';

import {DiscoveryScreen} from '../screens/DiscoveryScreen';
import {FeedScreen} from '../screens/FeedScreen';

const config = Platform.select({
  web: {headerMode: 'screen'},
  default: {},
});

const FeedStack = createStackNavigator(
  {
    Home: FeedScreen,
  },
  config,
);

FeedStack.navigationOptions = {
  tabBarLabel: 'Home',
};

FeedStack.path = '';

const DiscoveryStack = createStackNavigator(
  {
    Links: DiscoveryScreen,
  },
  config,
);

DiscoveryStack.navigationOptions = {
  tabBarLabel: 'Links',
};

DiscoveryStack.path = '';

const tabNavigator = createBottomTabNavigator({
  FeedStack,
  DiscoveryStack,
});

tabNavigator.path = '';

export default tabNavigator;
