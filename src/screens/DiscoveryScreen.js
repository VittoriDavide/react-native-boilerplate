import React, {useContext} from 'react';
import {Text, TouchableOpacity} from 'react-native';
import {ThemeContext} from '../theme/themeContext';

export function DiscoveryScreen() {
  const {dark, toggle, computedTheme} = useContext(ThemeContext);
  return (
    <TouchableOpacity onPress={toggle}>
      <Text style={[{color: computedTheme.secondaryColor}]}>Hey you</Text>
    </TouchableOpacity>
  );
}
