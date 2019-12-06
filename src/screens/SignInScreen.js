import React, {useContext, useState, useEffect} from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Button, Input} from 'react-native-elements';
import auth from '@react-native-firebase/auth';
import {ThemeContext} from '../theme/themeContext';

export function SignInScreen() {
  const {dark, toggle, computedTheme} = useContext(ThemeContext);

  var _signInAsync = async () => {
    await AsyncStorage.setItem('userToken', 'abc');
    //this.props.navigation.navigate('App');
  };

  // Set an initilizing state whilst Firebase connects
  const [initilizing, setInitilizing] = useState(true);
  const [user, setUser] = useState();

  // Handle user state changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  function onAuthStateChanged(user) {
    setUser(user);
    if (initilizing) {
      setInitilizing(false);
    }
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  return (
    <View style={{width: '100%', height: '100%'}}>
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <Input
            placeholder='BASIC INPUT'
        />

        <Input
          placeholder="INPUT WITH ICON"
          leftIcon={{type: 'font-awesome', name: 'chevron-left'}}
        />
        <Button title="Sign in!" onPress={this._signInAsync} />
      </View>
    </View>
  );
}

