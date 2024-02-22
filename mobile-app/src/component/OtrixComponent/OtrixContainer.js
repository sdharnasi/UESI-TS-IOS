import React from 'react';
import { View, SafeAreaView, StatusBar } from 'react-native';
import { GlobalStyles, Colors } from '@helpers'

function OtrixContainer(props) {
    return (
        <>
            <SafeAreaView style={{ flex: 1, backgroundColor: Colors().light_white }}>
                <View style={[GlobalStyles.mainView, props.customStyles]} >
                    {
                        props.children
                    }
                </View>
            </SafeAreaView>
        </>
    )
}

export default OtrixContainer
