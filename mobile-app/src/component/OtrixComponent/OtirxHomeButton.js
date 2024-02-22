import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Colors } from '@helpers'
import { _roundDimensions } from '@helpers/util'
import { menu } from '@common';
import Icon from 'react-native-vector-icons/FontAwesome';
function HomeButton() {
    return (
        <View style={styles.backRound}>
            <Icon name='navicon' style={styles.backButton} />
        </View>
    )
}

export default OtirxHomeButton = React.memo(HomeButton);

const styles = StyleSheet.create({
    backRound: {
        justifyContent: 'center',
        alignItems: 'center',
        height: _roundDimensions()._height * 0.042,
        width: _roundDimensions()._height * 0.040,
        borderRadius: _roundDimensions()._borderRadius,
        backgroundColor: Colors().themeSecondColor,
        shadowColor: 'grey',
        shadowOffset: { width: 0, height: 0.2 },
        shadowOpacity: 0.10,
        shadowRadius: 3,
        elevation: 2,
        padding: 10
    },
    backButton: {
        height: _roundDimensions()._height * 0.022,
        width: _roundDimensions()._height * 0.022,
        color: Colors().white,
        fontSize: 18
    }

});