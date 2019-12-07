import React, {useContext, useState, useEffect} from 'react';
import {
  ActivityIndicator,
  AsyncStorage, SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Button, Input} from 'react-native-elements';
import auth from '@react-native-firebase/auth';
import { ThemeContext, withTheme } from 'react-native-elements';
import ViewElement from '../components/ViewElement';
import InputLogin from '../components/InputLogin';
import {Dimensions} from "react-native";

let windowHeight = Dimensions.get('window').height;
let windowWidth = Dimensions.get('window').width;
const theme = {
  Button: {
    titleStyle: {
      color: 'red',
    },
  },
};


export function SignInScreen(props) {
  const { theme } = useContext(ThemeContext);

  var _signInAsync = async () => {
    await AsyncStorage.setItem('userToken', 'abc');
    //this.props.navigation.navigate('App');
    console.log(replaceTheme)
    replaceTheme(theme)
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
      <SafeAreaView style={{backgroundColor: theme.colors.secondary}}>


        <ViewElement >
          <View style={{margin: 20}}>
            <InputLogin
                placeholder='Email'
                inputContainerStyle={{borderRightWidth: 1, borderLeftWidth: 1, borderTopWidth: 1, borderBottomWidth: 0,
                  borderTopEndRadius: 5, borderTopStartRadius: 5
                }}
            />

            <InputLogin
                placeholder="Password"
                inputContainerStyle={{borderRightWidth: 1, borderLeftWidth: 1, borderBottomWidth: 1, borderTopWidth: 1,
                  borderBottomEndRadius: 5, borderBottomStartRadius: 5}}
            />
            <Button containerStyle={{marginTop: 20, marginHorizontal: 10}} title="Sign in" onPress={() => _signInAsync()} />

            <View style={{width: '100%', marginVertical: 10}}>
              <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                <View style={styles(theme).lineStyle}/>
                <Text style={{color: theme.colors.grey5, marginHorizontal: 10}}>OR</Text>
                <View style={styles(theme).lineStyle}/>
              </View>
            </View>


            <Button
                type="clear"
                titleStyle={{color: theme.colors.primary}}
                containerStyle={{marginTop: 20, marginHorizontal: 10, }}
                title="Sign up" onPress={() => _signInAsync()} />
          </View>




        </ViewElement>
      </SafeAreaView>
  );
}

const styles =  (props) => StyleSheet.create({

  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  lineStyle: {
    width: windowWidth/5,
    borderWidth: 0.3,
    height: 0,
    borderColor: props.colors.grey5
  }
});
