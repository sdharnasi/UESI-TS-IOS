import React, { useEffect,useState,useCallback } from "react";
import {
    View,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    Image,
    ScrollView,
    Alert
} from "react-native";
import {
    Appbar,
    DarkTheme,
    DefaultTheme,
    Provider,
    Surface,
    ThemeProvider,
    RadioButton
  } from 'react-native-paper';
import {
    OtrixContainer, OtrixHeader, OtrixContent, OtrixDivider, OtrixAlert, OtrixLoader
} from '@component';
import { Input, Text, FormControl, Button, InfoOutlineIcon } from "native-base"
import { connect } from 'react-redux';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { GlobalStyles, Colors, isValidEmail, isValidMobile, isValidpassword, isValidConfirmPassword } from '@helpers'
import Icon from 'react-native-vector-icons/Ionicons';
import { logfunction } from "@helpers/FunctionHelper";
import Fonts from "@helpers/Fonts";
import getApi from "@apis/getApi";
import { doLogin, doLogout,authData } from '@actions';
import { getUniqueId, getManufacturer, getDeviceName } from 'react-native-device-info';
import FastImage from "react-native-fast-image";
import { ASSETS_DIR, CURRENCY } from '@env';
import AsyncStorage from '@react-native-community/async-storage';
import { setSongsDonated } from '@actions';
import { bindActionCreators } from "redux";
import { useFocusEffect } from '@react-navigation/native';
import * as RootNavigation from '../AppNavigator';
import auth from '@react-native-firebase/auth';
import Toast from 'react-native-root-toast';

import TrackPlayer, {
    Capability,
    Event,
    RepeatMode,
    State,
    usePlaybackState,
    useProgress,
    useTrackPlayerEvents,
  } from 'react-native-track-player';
  let PlayList = [];
  let totalSongs = [];

function DeleteAccountScreen(props) {
    const [formData, setData] = React.useState({ firstName: null, lastName: null, email: null, mobileNumber: null, password: null, cpassword: null, submited: false, type: null, message: null, loading: false });
    const [state, setDatapassword] = React.useState({ secureEntry: true });
    const [errors, setErrors] = React.useState({});
    const { firstName, lastName, mobileNumber, email, password, cpassword, submited, type, message, loading } = formData;
    const [amount, setAmount] = useState('');

    const dropDownClosed = () =>{
        setShowDropDown(false);
        setAmounntIsRequired(false);
    }
    
    const deleteAccount = ()=>{
        Alert.alert('Delete Account', "Are you want to delete the Account.It is not a reversable", [
            {text: 'Cancel', onPress: () => cancelPressed()},
            {text: 'OK', onPress: () => removeAccount()},
          ]);
    }

    const cancelPressed = () =>{

    }
    const removeAccount = () => {
        //if (validate()) {
            setData({
                ...state,
                loading: true
            })

            let sendData = new FormData();
            sendData.append('email', email);
            try {
                getApi.postData(
                    'user/deleteAccount',
                    sendData,
                    props.AUTH_TOKEN
                ).then((response => {
                    //logfunction("RESPONSE ", response)
                    if (response.status == 1) {
                        setData({
                            ...state,
                            loading: false,
                            message: response.message,
                            type: 'success'
                            
                        });
                        props.setSongsDonated('');
                        props.doLogout();
                        auth().signOut();
                        getApi.getData(
                            "user/logout",
                            props.AUTH_TOKEN
                        ).then((response => {
                            RootNavigation.navigate('UESIHomeScreen');
                        })),
                        Toast.show('Account deleted Successfully', {
                            duration: 5000,
                            position: Toast.positions.BOTTOM,
                            shadow: true,
                            animation: true,
                            hideOnPress: true,
                            delay: 0,
                        })

                    }
                    else {
                        setData({
                            ...state,
                            type: 'error',
                            message: response.message,
                            loading: false
                        });
                        //setShowLoading(true)
                        setTimeout(() => {
                          //  setShowLoading(false)
                        }, 3000);
                    }
                }));
            } catch (error) {
                //logfunction("Error", error)
                setData({
                    ...state,
                    loading: false
                })
            }

       // }
    }

    const { strings } = props;

    return (
        <SafeAreaView style={{height:'100%', backgroundColor:'#fff'}}>
            <ScrollView style={{height:'100%'}}>
                <View style={{height:'100%'}}>
                    <OtrixDivider size={'sm'} />
                    <View style={{backgroundColor:'#fff',paddingHorizontal:20,marginTop:10}}>
                        <Text style={{fontFamily:Fonts.Font_Medium}}>Enter email address to deactivate your account.</Text>
                    </View>
                    <OtrixDivider size={'sm'} />
                    <View style={{backgroundColor:'#fff',paddingHorizontal:20,marginTop:10,height:'100%',marginBottom:500}}>
                        <View>
                        <OtrixDivider size={'sm'} />
                <FormControl style={{ backgroundColor: Colors().white }} isRequired isInvalid={submited && 'email' in errors || 'invalidEmail' in errors}>
                    <Input variant="outline" placeholder={strings.commoninput.placeholder_email} style={[GlobalStyles.textInputStyle]}
                        keyboardType="email-address"
                        onChangeText={(value) => { setData({ ...formData, email: value }), delete errors.email, delete errors.invalidEmail }}
                        value={formData.email}
                    />
                    {
                        'invalidEmail' in errors == false && 'email' in errors && <FormControl.ErrorMessage
                            leftIcon={<InfoOutlineIcon size="xs" />}
                        >
                            {errors.email}
                        </FormControl.ErrorMessage>
                    }
                    {
                        'invalidEmail' in errors && <FormControl.ErrorMessage
                            leftIcon={<InfoOutlineIcon size="xs" />}
                        >
                            {errors.invalidEmail}
                        </FormControl.ErrorMessage>
                    }

                </FormControl>
                <OtrixDivider size={'sm'} />
                    
                        <Button
                            size="md"
                            variant="solid"
                            bg={Colors().themeColor}
                            style={GlobalStyles.button}
                            isLoading={loading}
                            onPress={() => deleteAccount()}
                        >
                            <Text style={GlobalStyles.buttonText}>Deactivate</Text>
                        </Button>
                        <OtrixDivider size={'sm'} />
                        </View>
                    </View>
                    {
                        message != null && <OtrixAlert type={type} message={message} />
                    }
                </View >
            </ScrollView>
        </SafeAreaView>
    )
}


function mapStateToProps(state) {
    return {
        cartData: state.cart.cartData,
        customerData: state.auth.USER_DATA,
        strings: state.mainScreenInit.strings,
        AUTH_TOKEN: state.auth.AUTH_TOKEN,
    }
}
const mapDispatchToProps = dispatch => (
    bindActionCreators({
        setSongsDonated,
        doLogin,
        doLogout,
        authData
    }, dispatch)
  );

export default connect(mapStateToProps, mapDispatchToProps) (DeleteAccountScreen);

const styles = StyleSheet.create({
    registerView: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    registerTxt: {
        fontSize: wp('3.5%'),
        textAlign: 'center',
        fontFamily: Fonts.Font_Reguler,
        color: Colors().secondry_text_color
    },
    signupTxt: {
        fontSize: wp('3.5%'),
        textAlign: 'right',
        fontFamily: Fonts.Font_Medium,
        color: Colors().link_color
    },
});
const styles1 = StyleSheet.create({
    containerStyle: {
        flex: 1,
        
      },
      spacerStyle: {
        marginBottom: 15,
      },
      safeContainerStyle: {
        flex: 1,
        margin: 0,
        justifyContent: "center",
      },
      viewStyle:{
        position:'absolute',
        top:0,
        left:0,
        overflow:'scroll'
      }
  });