import React, {useContext, useState, useEffect} from 'react';
import {
  ActivityIndicator,
  AsyncStorage, SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Platform
} from 'react-native';
import {Button, Image, Input} from 'react-native-elements';
import authFirebase, {firebase} from '@react-native-firebase/auth';
import { ThemeContext, withTheme } from 'react-native-elements';
import ViewElement from '../components/ViewElement';
import InputLogin from '../components/InputLogin';
import {DismissKeyboardView} from '../components/DismissKeyboardHOC';

import {Dimensions} from "react-native";
import { GoogleSignin, GoogleSigninButton, statusCodes } from '@react-native-community/google-signin';
import auth, {
  AppleButton,
  AppleAuthError,
  AppleAuthRequestScope,
  AppleAuthRealUserStatus,
  AppleAuthCredentialState,
  AppleAuthRequestOperation,
} from '@invertase/react-native-apple-authentication';
import {NavigationContext} from "react-navigation";


let windowHeight = Dimensions.get('window').height;
let windowWidth = Dimensions.get('window').width;
/**
 * You'd technically persist this somewhere for later use.
 */
let user = null;

/**
 * Fetches the credential state for the current user, if any, and updates state on completion.
 */
async function fetchAndUpdateCredentialState(updateCredentialStateForUser) {
  if (user === null) {
    updateCredentialStateForUser('N/A');
  } else {
    const credentialState = await auth.getCredentialStateForUser(user);
    if (credentialState === AppleAuthCredentialState.AUTHORIZED) {
      updateCredentialStateForUser('AUTHORIZED');
    } else {
      updateCredentialStateForUser(credentialState);
    }
  }
}

/**
 * Starts the Sign In flow.
 */
async function onAppleButtonPress(updateCredentialStateForUser) {
  console.warn('Beginning Apple Authentication');

  // start a login request
  try {
    const appleAuthRequestResponse = await auth.performRequest({
      requestedOperation: AppleAuthRequestOperation.LOGIN,
      requestedScopes: [AppleAuthRequestScope.EMAIL, AppleAuthRequestScope.FULL_NAME],
    });

    console.log('appleAuthRequestResponse', appleAuthRequestResponse);

    const {
      user: newUser,
      email,
      nonce,
      identityToken,
      realUserStatus /* etc */,
    } = appleAuthRequestResponse;

    user = newUser;

    fetchAndUpdateCredentialState(updateCredentialStateForUser).catch(error =>
        updateCredentialStateForUser(`Error: ${error.code}`),
    );
    if (identityToken) {
      // e.g. sign in with Firebase Auth using `nonce` & `identityToken`
      console.log(nonce, identityToken);

      // 3). create a Firebase `AppleAuthProvider` credential
      const appleCredential = firebase.auth.AppleAuthProvider.credential(identityToken, nonce);

      // 4). use the created `AppleAuthProvider` credential to start a Firebase auth request,
      //     in this example `signInWithCredential` is used, but you could also call `linkWithCredential`
      //     to link the account to an existing user
      const userCredential = await firebase.auth().signInWithCredential(appleCredential);

      // user is now signed in, any Firebase `onAuthStateChanged` listeners you have will trigger
      console.warn(`Firebase authenticated via Apple, UID: ${userCredential.user.uid}`);
    } else {
      // no token - failed sign-in?
      Alert.alert(
          'Error',
          "Error signing in",
          [
            {text: 'OK', onPress: () => console.log('OK Pressed')},
          ],
          {cancelable: true},
      );
    }

    if (realUserStatus === AppleAuthRealUserStatus.LIKELY_REAL) {
      console.log("I'm a real person!");
    }

    console.warn(`Apple Authentication Completed, ${user}, ${email}`);
  } catch (error) {
    if (error.code === AppleAuthError.CANCELED) {
      console.warn('User canceled Apple Sign in.');
    } else {
      Alert.alert(
          'Error',
          error,
          [
            {text: 'OK', onPress: () => console.log('OK Pressed')},
          ],
          {cancelable: true},
      );
    }
  }
}



export function SignInScreen(props) {
  const { theme } = useContext(ThemeContext);
  let emailInput = React.createRef();
  let passwordInput = React.createRef();

  // var _signInAsync = async () => {
  //   await AsyncStorage.setItem('userToken', 'abc');
  //   //this.props.navigation.navigate('App');
  //   console.log(replaceTheme)
  //   replaceTheme(theme)
  // };


  let _signInAsync = async (email, password) => {
    try {
      await authFirebase().signInWithEmailAndPassword(email, password);
    } catch (e) {
      emailInput.current.shake();
      passwordInput.current.shake();
      Alert.alert(
          'Invalid',
          e.message,
          [
            {text: 'OK', onPress: () => console.log('OK Pressed')},
          ],
          {cancelable: true},
      );
    }
  };

  let _signInGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const { accessToken, idToken } = userInfo;
      const credential = firebase.auth.GoogleAuthProvider.credential(idToken, accessToken);
      await firebase.auth().signInWithCredential(credential);

      console.log(userInfo)
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
        console.warn("google canceled")
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
        console.warn("google in progress")
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
        console.warn("google service not available")
      } else {
        // some other error happened
        console.warn("google error", error)
      }
    }
  };


  // Set an initilizing state whilst Firebase connects
  const [initilizing, setInitilizing] = useState(true);
  const [user, setUser] = useState();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isEmailValid, setEmailValidity] = useState(true);
  const navigation = useContext(NavigationContext);


  // Handle user state changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  function onAuthStateChanged(user) {
    setUser(user);
    if (initilizing) {
      setInitilizing(false);
    }
  }

  useEffect(() => {
    const subscriber = authFirebase().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);


  const [credentialStateForUser, updateCredentialStateForUser] = useState(-1);
  useEffect(() => {
    fetchAndUpdateCredentialState(updateCredentialStateForUser).catch(error =>
        updateCredentialStateForUser(`Error: ${error.code}`),
    );
    return () => {};
  }, []);

  useEffect(() => {
    if(auth.isSupported){
      return auth.onCredentialRevoked(async () => {
        console.warn('Credential Revoked');
        fetchAndUpdateCredentialState(updateCredentialStateForUser).catch(error =>
            updateCredentialStateForUser(`Error: ${error.code}`),
        );
      });
    }
  }, []);

  return (
      <SafeAreaView style={{backgroundColor: theme.colors.secondary}}>
        <DismissKeyboardView>
          <ViewElement>
            <View style={{alignSelf: "center",marginTop: 20}}>
              <Image source={require('../images/app5.png')} style={{  width: 300, height: 116 }}/>
              {/*<Image source={require('../images/memoriae-white.png')} style={{  width: 120, height: 120 }}/>*/}

            </View>
            <View style={{margin: 20}}>
              <Input
                  inputStyle={{color: theme.colors.grey5, padding: 5, paddingHorizontal: 10, fontSize: 15}}
                  placeholderStyle={{color: theme.colors.grey5}}
                  placeholderTextColor={theme.colors.grey3}
                  labelStyle={{color: theme.colors.grey5}}
                  onChangeText={text => setEmail(text)}
                  ref={emailInput}
                  placeholder='Email'
                  inputContainerStyle={{borderRightWidth: 1, borderLeftWidth: 1, borderTopWidth: 1, borderBottomWidth: 0,
                    borderTopEndRadius: 5, borderTopStartRadius: 5,borderColor: theme.colors.grey3, padding: 5
                  }}
                  pattern={[
                    '^(([^<>()\\[\\]\\\\.,;:\\s@"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$'
                  ]}
                  onValidation={isValid => setEmailValidity(isValid)}
              />
              <Input
                  inputStyle={{color: theme.colors.grey5, padding: 5, paddingHorizontal: 10, fontSize: 15}}
                  placeholderStyle={{color: theme.colors.grey5}}
                  placeholderTextColor={theme.colors.grey3}
                  labelStyle={{color: theme.colors.grey5}}
                  onChangeText={text => setPassword(text)}
                  ref={passwordInput}
                  placeholder="Password"
                  secureTextEntry
                  inputContainerStyle={{borderRightWidth: 1, borderLeftWidth: 1, borderBottomWidth: 1, borderTopWidth: 1,
                    borderBottomEndRadius: 5, borderBottomStartRadius: 5, borderColor: theme.colors.grey3, padding: 5}}
                  errorMessage={!isEmailValid ? "Mail not Valid" : ""}

              />
              <Button containerStyle={{marginTop: 20, marginHorizontal: 10}} title="Sign in" onPress={() => _signInAsync(email, password)} />

              {auth.isSupported ? <AppleButton
                  style={styles(theme).appleButton}
                  cornerRadius={5}
                  buttonStyle={AppleButton.Style.WHITE_OUTLINE}
                  buttonType={AppleButton.Type.SIGN_IN}
                  onPress={() => onAppleButtonPress(updateCredentialStateForUser)}
              />: <GoogleSigninButton
                  style={{ width: 192, height: 48, alignSelf: "center", marginTop: 20}}
                  size={GoogleSigninButton.Size.Wide}
                  color={GoogleSigninButton.Color.Dark}
                  onPress={() => _signInGoogle()}
                   />}

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
                  title="Sign up" onPress={() => navigation.navigate("signUp")} />
            </View>
          </ViewElement>
        </DismissKeyboardView>
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
  },
  appleButton: {
    width: 200,
    height: 40,
    alignSelf: "center",
    margin: 20,
  },
  header: {
    margin: 10,
    marginTop: 30,
    fontSize: 18,
    fontWeight: '600',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'pink',
  },
  horizontal: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
});
