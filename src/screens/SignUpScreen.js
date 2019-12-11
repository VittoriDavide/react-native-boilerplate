import React, {useContext, useState} from 'react';
import {Alert, SafeAreaView, StyleSheet, TouchableOpacity, View, Animated} from 'react-native';
import {ThemeContext, Header, Text, Button, Input} from 'react-native-elements';
import ViewElement from '../components/ViewElement';
import InputLogin from '../components/InputLogin';
import authFirebase from '@react-native-firebase/auth';
import {NavigationContext} from 'react-navigation';
import {DismissKeyboardView} from '../components/DismissKeyboardHOC';

export function SignUpScreen() {
    const [fadeAnim] = useState(new Animated.Value(0));
    const { theme } = useContext(ThemeContext);
    const navigation = useContext(NavigationContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isEmail, changeIsEmail] = useState(true);
    const [isEmailValid, setEmailValidity] = useState(false);
    const [isPasswordValid, setPasswordValidity] = useState(false);

    // textInput must be declared here so the ref can refer to it
    let textInput = React.createRef();

    let animate = () => {
        Animated.sequence([
            Animated.timing(
                fadeAnim,
                {
                    toValue: 5,
                    duration: 500,
                }
            ),
            Animated.timing(
                fadeAnim,
                {
                    toValue: -5,
                    duration: 1,
                }
            ),
            Animated.timing(
                fadeAnim,
                {
                    toValue: 1,
                    duration: 300,
                }
            )]
        ).start()

    };
    let animateBack = () => {
        Animated.sequence([
            Animated.timing(
                fadeAnim,
                {
                    toValue: -5,
                    duration: 500,
                }
            ),
            Animated.timing(
                fadeAnim,
                {
                    toValue: 5,
                    duration: 1,
                }
            ),
            Animated.timing(
                fadeAnim,
                {
                    toValue: 1,
                    duration: 300,
                }
            )]
        ).start()

    };

    React.useEffect(() => {
        Animated.timing(
            fadeAnim,
            {
                toValue: 1,
                duration: 500,
            }
        ).start();
    }, []);

    let _signInAsync = async (email, password) => {
        try {
            if(!isEmailValid){
                textInput.current.shake();
                throw new Error( "Email is not correct")
            }
            textInput.current.clear();
            if(isEmail){
                animate();
                changeIsEmail(false);
                return;
            }
            if(!isPasswordValid){
                textInput.current.shake();
                throw new Error( "Password is not correct" )
            }

            await authFirebase().createUserWithEmailAndPassword(email, password);
        } catch (e) {
            textInput.current.shake();
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

    return (

        <>
            <Header
                leftComponent={{ icon: 'ios-arrow-back', type: 'ionicon', iconStyle: {width: 30}, underlayColor: theme.colors.primary, color: '#fff', onPress: () => {if(!isEmail){animateBack()}isEmail ? navigation.goBack() : changeIsEmail(true) } }}
                centerComponent={{ text: 'Create Account', style: { color: '#fff' } }}
            />
            <DismissKeyboardView>
                <ViewElement>
                    <Animated.View                 // Special animatable View
                        style={{
                            opacity: fadeAnim,         // Bind opacity to animated value
                            transform: [{
                                translateX: fadeAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [150, 0]  // 0 : 150, 0.5 : 75, 1 : 0
                                }),
                            }],
                        }}
                    >
                        <Text h3 style={{color: theme.colors.grey5, margin: 30}}>{isEmail ?  "What is your email address ?" :  "What is your password ?"}</Text>
                        <View style={{margin: 20}}>

                            <Input
                                ref={textInput}
                                secureTextEntry={!isEmail}

                                inputStyle={{color: theme.colors.grey5, padding: 5, paddingHorizontal: 10, fontSize: 15}}
                                inputContainerStyle={{borderColor: theme.colors.grey3, padding: 5, borderWidth: 1,
                                    borderRadius: 5}}
                                placeholderStyle={{color: theme.colors.grey5}}
                                placeholderTextColor={theme.colors.grey3}
                                labelStyle={{color: theme.colors.grey5}}
                                onChangeText={text => {
                                    if (isEmail) {
                                        setEmail(text)
                                        setEmailValidity((/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(text)))
                                    } else {
                                        setPasswordValidity((/^.+$/i.test(text)));
                                        setPassword(text)
                                    }
                                }}
                                placeholder={isEmail ? 'Email' : 'Password'}

                            />
                        </View>


                    </Animated.View>

                    <View style={{margin: 20}}>

                        <Button containerStyle={{marginTop: 40, marginHorizontal: 30}} title="Next" onPress={() => {
                            _signInAsync(email, password)
                        }} />
                    </View>
                </ViewElement>

            </DismissKeyboardView>
        </>
    );
}
