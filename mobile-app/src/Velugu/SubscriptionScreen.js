import React, { useEffect,useCallback,useState } from "react";
import {
    View,
    TouchableOpacity,
    Text,
    useWindowDimensions,
    StyleSheet,
    Dimensions, ActivityIndicator, Alert, Linking, SafeAreaView
} from "react-native";
import { Button,Card } from 'react-native-paper';
import { connect } from "react-redux";
import { useFocusEffect } from '@react-navigation/native';
import { bindActionCreators } from "redux";
import { selectSong,setSongType,setSongs,setMagazineType } from '@actions';
import {
    OtrixContainer, OtrixHeader, OtrixDivider, OtirxBackButton, OtrixContent, OtrixLoader
} from '@component';
//import { InAppBrowser } from 'react-native-inappbrowser-reborn';

function SubscriptionScreen(props,{ route, navigation }) {
    const openLinkInAppBrowser =  (url) => {
        try {
            // if (InAppBrowser.isAvailable()) {
            //   const result = InAppBrowser.open(url, {
            //     // iOS Properties
            //     dismissButtonStyle: 'cancel',
            //     preferredBarTintColor: 'red',
            //     preferredControlTintColor: 'red',
            //     readerMode: false,
            //     animated: true,
            //     modalPresentationStyle: 'fullScreen',
            //     modalTransitionStyle: 'coverVertical',
            //     modalEnabled: true,
            //     enableBarCollapsing: false,
            //     // Android Properties
            //     showTitle: true,
            //     toolbarColor: 'red',
            //     secondaryToolbarColor: 'red',
            //     navigationBarColor: 'black',
            //     navigationBarDividerColor: 'red',
            //     enableUrlBarHiding: false,
            //     enableDefaultShare: false,
            //     forceCloseOnRedirection: false,
            //     hasBackButton: true,
            //     // Specify full animation resource identifier(package:anim/name)
            //     // or only resource name(in case of animation bundled with app).
            //     animations: {
            //       startEnter: 'slide_in_right',
            //       startExit: 'slide_out_left',
            //       endEnter: 'slide_in_left',
            //       endExit: 'slide_out_right'
            //     },
            //     headers: {
            //       'my-custom-header': 'my custom header value'
            //     }
            //   })
            // }
            // else 
            Linking.openURL(url)
          } catch (error) {
            Alert.alert(error.message)
          }
      };
    return (
        <SafeAreaView style={style.container}>
        <View style={{flex: 1, justifyContent: 'flex-start', alignItems: 'center',marginTop:40}}>
        <Card style={{marginTop:30,width:300}}>
            <Button  mode="outlined" onPress={() => openLinkInAppBrowser('https://forms.gle/cRUmpaX6aST7Pbfh9')}>
                    NEW SUBSCRIPTION
            </Button>
            </Card>
            <Card style={{marginTop:30,width:300}}>
            <Button mode="outlined" onPress={() => openLinkInAppBrowser('https://forms.gle/AQ9DspfvPDa7ZYA87')}>
            RENEWAL
            </Button>
            </Card>
            <Card style={{marginTop:30,width:300}}>
            <Button mode="outlined" onPress={() => openLinkInAppBrowser('https://forms.gle/cDaiq8E9MrzLHjFQ9')}>
            ADDRESS CHANGE
            </Button>
            </Card>
            <Card style={{marginTop:30,width:300}}>
            <Button  mode="outlined" onPress={() => openLinkInAppBrowser('https://forms.gle/FvqgEwmiVKnPRYj38')}>
            COMPLAINTS
            </Button>
            </Card>
            <Card style={{marginTop:30,width:300}}>
            <Button mode="outlined" onPress={() => openLinkInAppBrowser('https://forms.gle/Noh21EDxBbFZeAxb8')}>
            PRAYER POINTS
            </Button>
            </Card>
        </View>
        </SafeAreaView>

    )
}

function mapStateToProps(state) {
    return {
        selectedSong: state.song.selectedSong,
        songType: state.song.songType,
        magazineType: state.song.magazineType
    }
  }
  
  const mapDispatchToProps = dispatch => (
    bindActionCreators({
        selectSong,
        setSongs,
        setSongType,
        setMagazineType
    }, dispatch)
  );

export default connect(mapStateToProps, mapDispatchToProps) (SubscriptionScreen);

const style = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#222831', //36454F
    }
});