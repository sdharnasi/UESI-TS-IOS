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
import { getUniqueId, getManufacturer, getDeviceName } from 'react-native-device-info';
import FastImage from "react-native-fast-image";
import { ASSETS_DIR, CURRENCY } from '@env';
import AsyncStorage from '@react-native-community/async-storage';
import { setSongsDonated } from '@actions';
import { bindActionCreators } from "redux";
import { useFocusEffect } from '@react-navigation/native';
// import DropDown from "react-native-paper-dropdown";
let greenTick = require('../assets/images/checkmark.png');
import RazorpayCheckout from 'react-native-razorpay';
import DropDown from "react-native-paper-dropdown";  
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

function DonateFreeWillScreen(props) {
    const [formData, setData] = React.useState({ firstName: null, lastName: null, email: null, mobileNumber: null, password: null, cpassword: null, submited: false, type: null, message: null, loading: false });
    const [state, setDatapassword] = React.useState({ secureEntry: true });
    const [errors, setErrors] = React.useState({});
    const { firstName, lastName, mobileNumber, email, password, cpassword, submited, type, message, loading } = formData;
    const [selectedLanguage, setSelectedLanguage] = useState();
    const [notes, setNotes] = useState('');
    const [amount, setAmount] = useState('');
    const [colors, setColors] = useState('');
    const [nightMode, setNightmode] = useState(false);
    const [amounntIsRequired, setAmounntIsRequired] = useState(false);
    const [notesIsRequired, setNotesIsRequired] = useState(false);
    const [custmerData, setCustmerData] = useState({});

    useFocusEffect(
        useCallback(() => {
            async function getCustomerData() {
                await AsyncStorage.getItem("CUSTOMER_DATA").then(data=>{
                    setCustmerData(JSON.parse(data));
                });
            }
            getCustomerData();
       
    }, [props]))

    const doPayment = () => {
        if (amount == null || amount == '') {
            setAmounntIsRequired(true);
            return false;
        }else if (notes == null || notes == '') {
            setNotesIsRequired(true);
            return false;
        }else {
            setAmounntIsRequired(false);
            setNotesIsRequired(false);
        var options = {
            description: 'Donated through UESI-TS App Free will offering.',
            notes: notes,
            image: '../assets/uesi-ts-logo.png',
            currency: 'INR',
            key: 'rzp_live_8VfOQxZZPfUDVl', //'rzp_test_sczJuQC9MiEjRs',
            amount: Number(amount)*100,
            name: 'UESI-TS',
            order_id: '',//Replace this with an order_id created using Orders API.
            prefill: {
              email: custmerData.email,
              contact: custmerData.mobileNumber,
              name: custmerData.firstName+' '+ custmerData.lastName
            },
            theme: {color: '#53a20e'},
            redirect: false,
            config: {
                display: {
                  hide: [
                  { method: 'paylater' },
                  { method: 'emi' },
                 // { method: 'upi' },
                  { method: 'wallet' }
                ],
                preferences: { show_default_blocks: true }
                }
              }
          }
          try{
          RazorpayCheckout.open(options).then((data) => {
            // handle success
            //props.navigation.navigate('DonationSuccessScreen');
            //placeOrder(data);
            //alert(`Success: ${data.razorpay_payment_id}`);
            saveTransactionData();
          }).catch((error) => {
            // handle failure
            //console.log(error.error.description);
            Alert.alert('Error:', error.error.description, [
                {text: 'OK', onPress: () => {}},
            ]);
            //alert(`Error: ${error.description.description}`);
          });
        }catch(error){
            console.log(error);
        }
    }
    }

    const saveTransactionData = () => {
        
        setData({
            ...formData,
            loading: true
        })

        let sendData = new FormData();
        sendData.append('user_id', custmerData.id);
        sendData.append('amount', amount);
        sendData.append('note', notes);
        sendData.append('status', 1);
        try {
            getApi.postData(
                'user/saveGiftAmountData',
                sendData,
            ).then((response => {
                //console.log(JSON.stringify(response));
                logfunction("RESPONSE ", response)
                if (response.status == 1) {
                    setAmount('');
                    setNotes('');
                    props.navigation.navigate('DonationSuccessScreen');
                    setTimeout(()=>{
                        setData({
                            ...formData,
                            loading: false
                        })
                    },3000);
                }
                else {
                    setData({
                        ...formData,
                        type: 'error',
                        message: response.message,
                        loading: false
                    });
                    setTimeout(() => {
                        setData({
                            ...formData,
                            message: null,
                            loading: false
                        })
                    }, 3000);
                }
            }));
        } catch (error) {
            logfunction("Error", error)
            setData({
                ...formData,
                loading: false
            })
        }
    //}
}
    const { strings } = props;
    return (
        <SafeAreaView style={{backgroundColor:'#fff'}}>
            <ScrollView style={{height:'100%'}}>
        <View>

            <OtrixDivider size={'md'} />
            <View style={{paddingHorizontal:20}}>
                <Text style={{textAlign:'justify', fontSize:16, fontWeight:'500'}}>నీ రాబడి అంతటిలో ప్రథమఫలమును నీ ఆస్తిలో భాగమును ఇచ్చి యెహోవాను ఘన పరచుము.అప్పుడు నీ కొట్లలో ధాన్యము సమృద్ధిగా నుండును నీ గానుగులలోనుండి క్రొత్త ద్రాక్షారసము పైకి పొరలి పారును. </Text>
                <Text style={{position:'relative',marginLeft:'auto',fontFamily: Fonts.Font_Reguler}}>సామెతలు 3:9-10</Text>
            </View>
            <OtrixDivider size={'md'} />
            <OtrixDivider size={'md'} />

            {/* Content Start from here */}
            <View style={{backgroundColor:'#fff',paddingHorizontal:20}}>
                {/* New User Registration Start */}
                <View>
                  <FormControl style={{ backgroundColor: Colors().white }} isRequired>
                    <Input variant="outline" keyboardType="number-pad" placeholder='Enter Amount*' style={GlobalStyles.textInputStyle}
                        onChangeText={(value) => { setAmount(value), setData({ ...formData, submited: false, amount: value }) }}
                    />

                    {(amounntIsRequired) ? <Text style={{color:'red'}}>Enter Amount</Text>:null}

                </FormControl>

                <OtrixDivider size={'md'} />
                <FormControl style={{ backgroundColor: Colors().white }} isRequired >
                    <Input variant="outline" placeholder='Add Note...' style={GlobalStyles.textInputStyle}
                        onChangeText={(notes) =>{ setNotes(notes), setData({ ...formData, submited: false, note: notes })}}
                    />
                    {(notesIsRequired) ? <Text style={{color:'red'}}>Enter Notes</Text>:null}
                </FormControl>
                
                <OtrixDivider size={'md'} />
                <Button
                    size="md"
                    variant="solid"
                    bg={Colors().themeColor}
                    style={GlobalStyles.button}
                    isLoading={loading}
                    onPress={() => doPayment()}
                >
                    <Text style={GlobalStyles.buttonText}>Donate</Text>
                </Button>
                
                <OtrixDivider size={'sm'} />
                </View>
                {/* New User Registration End */}
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
        strings: state.mainScreenInit.strings
    }
}
const mapDispatchToProps = dispatch => (
    bindActionCreators({
        setSongsDonated
    }, dispatch)
  );

export default connect(mapStateToProps, mapDispatchToProps) (DonateFreeWillScreen);

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