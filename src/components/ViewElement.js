import React from 'react';
import { View } from 'react-native';
import { withTheme } from 'react-native-elements';

function ViewElement(props) {
    const { theme, updateTheme, replaceTheme } = props;
    return (
        <View style={{ backgroundColor: theme.colors.secondary, height: "100%", width:"100%" }}>
            {props.children}
        </View>
    )

}

export default withTheme(ViewElement);
