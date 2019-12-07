import React from 'react';
import { View,StyleSheet } from 'react-native';
import {Input, withTheme} from 'react-native-elements';

function InputLogin(props) {
    const { theme, updateTheme, replaceTheme } = props;


    return (
        <Input
            inputStyle={{color: theme.colors.grey5, padding: 5, paddingHorizontal: 10, fontSize: 15}}
            inputContainerStyle={StyleSheet.flatten([props.inputContainerStyle, {borderColor: theme.colors.grey3, padding: 5}])}
            placeholderStyle={{color: theme.colors.grey5}}
            placeholderTextColor={theme.colors.grey3}
            labelStyle={{color: theme.colors.grey5}}
            {...props}
        />
    );

}

export default withTheme(InputLogin);
