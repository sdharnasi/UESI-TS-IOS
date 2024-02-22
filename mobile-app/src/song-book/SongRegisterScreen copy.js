import React, { useEffect,useState } from "react";
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
import { doLogin } from '@actions';
import { getUniqueId, getManufacturer, getDeviceName } from 'react-native-device-info';
import FastImage from "react-native-fast-image";
import { ASSETS_DIR, CURRENCY } from '@env';
import AsyncStorage from '@react-native-community/async-storage';
import { setSongsDonated } from '@actions';
import { bindActionCreators } from "redux";
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

function SongRegisterScreen(props) {
    const [formData, setData] = React.useState({ firstName: null, lastName: null, email: null, mobileNumber: null, password: null, cpassword: null, submited: false, type: null, message: null, loading: false });
    const [state, setDatapassword] = React.useState({ secureEntry: true });
    const [errors, setErrors] = React.useState({});
    const { firstName, lastName, mobileNumber, email, password, cpassword, submited, type, message, loading } = formData;

    const [checked, setChecked] = React.useState('');
    const [studentOrGraduate, setStudentOrGraduate] = React.useState('');
    const [verified, setVerified] = React.useState(false);
    const [deviceId, setDeviceId] = React.useState('');
    const [deviceName, setDeviceName] = React.useState('');
    const [getFullDetails, setGetFullDetails] = React.useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState();
    const [showDropDown, setShowDropDown] = useState(false);
    const [amount, setAmount] = useState('');
    const [showMultiSelectDropDown, setShowMultiSelectDropDown] = useState(false);
    const [colors, setColors] = useState('');
    const [nightMode, setNightmode] = useState(false);
    const [amounntIsRequired, setAmounntIsRequired] = useState(false);
    const [custmerData,setCustmerData] = React.useState({});
    const [paymentMType,setPaymentMType] = React.useState(null);
    //const [studentAmountList,setStudentAmountList] = React.useState(null);
    //const [graduateAmountList,setGraduateAmountList] = React.useState(null);
    const [amountList, setAmountList] = React.useState([]);
    const [paymentDetails, setPaymentDetails] = React.useState([]);

    useEffect(() => {
        const { paymentModuleType } = props.route.params;
                setPaymentMType(paymentModuleType);
        async function getCustomerData() {
            await AsyncStorage.getItem("CUSTOMER_DATA").then(data=>{
                setCustmerData(JSON.parse(data));
            });
        }
        getCustomerData();

        getUniqueId().then(data=>{
            setDeviceId(data);
        });
        getDeviceName().then(data=>{
            setDeviceName(data);
        });
        
        async function GetPurchaseDetails() {
            console.log(paymentMType);
            try {
                let sendData = new FormData();
                sendData.append('module_type', paymentMType);
                getApi.postData(
                    'user/getModulesPurchaseDetails',
                    sendData,
                ).then(( async response => {
                    //console.log("srinivas     ")
                    console.log(response.data);
                    if(response.status === 1){
                        setPaymentDetails(response.data);
                        //setAmountList(response.data);
                    //   if(Number(response.data[0].version)!=Number(DeviceInfo.getVersion())){
                    //         Alert.alert('New Update:', response.data[0].update_message, [
                    //             {text: 'Update', onPress: () => okayPressed(response.data[0].update_url)},
                    //           ]);
                    //   }
                    }
                }));
            } catch (error) {
              //console.log(error);
            }
            // await AsyncStorage.getItem('app_version').then(data=>{
            //   if(data){
            //   }else{
            //     AsyncStorage.setItem('SONG_UPDATE_VERSION','1');
            //     callAPI();
            //   }
            // });
        }
        GetPurchaseDetails();

    }, [props.navigation, paymentMType]);

    const setAmountValues = (userType)=>{
        setStudentOrGraduate(userType);
        if(userType ==='student'){
            setAmountList(JSON.parse(paymentDetails.student_amount_list)); 
        }else if(userType ==='graduate'){
            setAmountList(JSON.parse(paymentDetails.graduate_amount_list));  
        }
    }
    const validate = () => {
        logfunction("Name ", firstName)
        logfunction("Errors ", errors)
        setData({ ...formData, submited: true });
        if (firstName == null || firstName == '') {
            logfunction("FIeld ", 'First name is required')
            setErrors({
                ...errors,
                name: 'First Name is required'
            });
            return false;
        }
        else if (email == null) {
            logfunction("FIeld ", 'Email is required')
            setErrors({
                ...errors,
                email: 'Email is required'
            });
            return false;
        }
        else if (!isValidEmail(email).success) {
            logfunction("FIeld ", isValidEmail(email).message)
            setErrors({
                ...errors,
                invalidEmail: isValidEmail(email).message
            });
            return false;
        }
        else if (mobileNumber == null) {
            logfunction("FIeld ", 'Mobile number is required')
            setErrors({
                ...errors,
                mobileNumber: 'Mobile number is required'
            });
            return false;
        }
        else if (!isValidMobile(mobileNumber).success) {
            logfunction("FIeld ", isValidMobile(mobileNumber).message)
            setErrors({
                ...errors,
                invalidmobileNumber: isValidMobile(mobileNumber).message
            });
            return false;
        }
        else if (!isValidpassword(password).success) {
            logfunction("FIeld ", isValidpassword(password).message)
            setErrors({
                ...errors,
                password: isValidpassword(password).message
            });
            return false;
        }
        else if (!isValidConfirmPassword(password, cpassword).success) {
            setErrors({
                ...errors,
                cpassword: isValidConfirmPassword(password, cpassword).message
            });
            return false;
        }
        return true;

    }
    const validateDonatedUserDetails = () => {
        logfunction("Name ", firstName)
        logfunction("Errors ", errors)
        setData({ ...formData, submited: true })
        
        if (firstName == null || firstName == '') {
            logfunction("FIeld ", 'First name is required')
            setErrors({
                ...errors,
                name: 'First Name is required'
            });
            return false;
        }
        else if (email == null) {
            logfunction("FIeld ", 'Email is required')
            setErrors({
                ...errors,
                email: 'Email is required'
            });
            return false;
        }
        else if (!isValidEmail(email).success) {
            logfunction("FIeld ", isValidEmail(email).message)
            setErrors({
                ...errors,
                invalidEmail: isValidEmail(email).message
            });
            return false;
        }
        else if (mobileNumber == null) {
            logfunction("FIeld ", 'Mobile number is required')
            setErrors({
                ...errors,
                mobileNumber: 'Mobile number is required'
            });
            return false;
        }
        else if (!isValidMobile(mobileNumber).success) {
            logfunction("FIeld ", isValidMobile(mobileNumber).message)
            setErrors({
                ...errors,
                invalidmobileNumber: isValidMobile(mobileNumber).message
            });
            return false;
        }
        else if (!isValidpassword(password).success) {
            logfunction("FIeld ", isValidpassword(password).message)
            setErrors({
                ...errors,
                password: isValidpassword(password).message
            });
            return false;
        }
        else if (!isValidConfirmPassword(password, cpassword).success) {
            setErrors({
                ...errors,
                cpassword: isValidConfirmPassword(password, cpassword).message
            });
            return false;
        }
        return true;

    }
    const validateVerify = () => {
        
        setData({ ...formData, submited: true })
        if (email == null && !mobileNumber) {
            logfunction("FIeld ", 'Email is required')
            setErrors({
                ...errors,
                email: 'Email is required'
            });
            return false;
        }
         if (!email && mobileNumber == null) {
            logfunction("FIeld ", 'Mobile number is required')
            setErrors({
                ...errors,
                mobileNumber: 'Mobile number is required'
            });
            return false;
        }
        return true;
    }
    const saveDonatedUserDetails = ()=>{
        updateDonatedUserDetails();
        
    }
    const updateDonatedUserDetails = () => {
        if (validateDonatedUserDetails()) {
            setData({
                ...formData,
                loading: true
            })
            let sendData = new FormData();
            sendData.append('firstname', firstName);
            sendData.append('lastname', lastName);
            sendData.append('email', email);
            sendData.append('telephone', mobileNumber);
            sendData.append('password', password);
            sendData.append('device_id', deviceId );
            sendData.append('device_name', deviceName );

            try {
                getApi.postData(
                    'user/updateDonatedUserDetails',
                    sendData,
                ).then((response => {
                    registerExistingUser();
                    logfunction("RESPONSE ", response)
                    if (response.status == 1) {
                        if(paymentMType =='song_book'){
                             setSongsDonated();
                        }
                       
                        //login();
                        setTimeout(()=>{
                            setData({
                                ...formData,
                                loading: false
                            })
                            //props.navigation.goBack();
                        },1000);
                        
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
        }
    }

    const saveUserAccessData = (userData) => {
        setData({
            ...formData,
            loading: true
        })
        let sendData = new FormData();
        sendData.append('user_id', userData.data.id);
        sendData.append('module_type', paymentMType);
        sendData.append('module_amount', amount);
        sendData.append('status', '1');
        try {
            getApi.postData(
                'user/saveUserAccessData',
                sendData,
            ).then((response => {
                logfunction("RESPONSE ", response)
                if (response.status == 1) {
                    //setSongsDonated();
                    let user_access = {};
                        if(response.data && response.data.length>0){
                            response.data.map((access,index)=>{
                                user_access[access.module_type] = access.status;
                            });
                        }
                        AsyncStorage.setItem('USER_ACCESS', JSON.stringify(user_access));


                    setTimeout(()=>{
                        setData({
                            ...formData,
                            loading: false
                        })
                        props.navigation.goBack();
                    },1000);
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

    async function setSongsDonated() {
        await AsyncStorage.setItem('songs_donated','1');
        props.setSongsDonated('1');
      }

      const registerDonatedUserDetails = () => {
        //if (validate()) {
            

            setData({
                ...formData,
                loading: true
            })
            let sendData = new FormData();
            sendData.append('firstname', firstName);
            sendData.append('lastname', lastName);
            sendData.append('email', email);
            sendData.append('telephone', mobileNumber);
            sendData.append('password', password);
            sendData.append('device_id', deviceId );
            sendData.append('device_name', deviceName );
            sendData.append('status', '1' );
            sendData.append('amount', amount );
            try {
                getApi.postData(
                    'user/registerDonatedUserDetails',
                    sendData,
                ).then((response => {
                    logfunction("RESPONSE ", response)
                    registerExistingUser();
                    if (response.status == 1) {
                        if(paymentMType =='song_book'){
                            setSongsDonated();
                       }
                        //login();
                        setTimeout(()=>{
                            setData({
                                ...formData,
                                loading: false
                            })
                            //props.navigation.goBack();
                        },1000);
                        
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

    const verify = () =>{
        if(validateVerify()){

        
        setData({
                loading: true
            })
        let sendData = new FormData();
        sendData.append('email', email)
        sendData.append('telephone', mobileNumber)
        try {
            getApi.postData(
                'user/verifyDonatedUser',
                sendData,
            ).then((response => {
                if (response.status == 1) {
                    
                    //props.navigation.navigate("RegisterSuccessScreen");
                    
                    // if(response.data.device_id=='' || response.data.device_name =='' || response.data.email =='' || response.data.firstname =='' || response.data.lastname =='' || response.data.password =='' || response.data.telephone ==''){
                    //     setData({ ...formData, email: response.data.email,  firstname: response.data.firstname, lastname:  response.data.lastname, password:response.data.password, telephone: response.data.telephone })
                    //    setGetFullDetails(true);
                    // }else{
                    //     setGetFullDetails(false);
                    //     setSongsDonated();
                    //     props.navigation.goBack();
                    // }
                    setVerified(true);
                    //setTimeout(()=>{
                        setData({
                            loading: false,
                            email: response.data.email,
                            firstName: response.data.firstname,
                            lastName: response.data.lastname,
                            password: response.data.password,
                            cpassword: response.data.password,
                            mobileNumber: response.data.telephone
                        })
                        setAmount(response.data.amount);
                    //},5000);
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
    }else{

    }
    }

    const verifyingForNewUser = () =>{
        if(validateVerify()){

        
        setData({
                loading: true
            })
        let sendData = new FormData();
        sendData.append('email', email)
        sendData.append('telephone', mobileNumber)
        try {
            getApi.postData(
                'user/verifyDonatedUser',
                sendData,
            ).then((response => {
                if (response.status == 1) {
                    setVerified(true);
                    setChecked( 'donated');
                        setData({
                            loading: false,
                            email: response.data.email,
                            firstName: response.data.firstname,
                            lastName: response.data.lastname,
                            password: response.data.password,
                            cpassword: response.data.password,
                            mobileNumber: response.data.telephone
                        })
                }
                else {
                    setData({
                        ...formData,
                        loading: false
                    });
                    showAlert();
                }
            }));
        } catch (error) {
            logfunction("Error", error)
            setData({
                ...formData,
                loading: false
            })
        }
    }else{

    }
    }

    const showAlert = () => {
        doPayment();
        // Alert.alert('Important:', "Don't use UPI payments like phonePe, GooglePay, Paytm, etc. Facing technical issues. You can use, Credit Card, Debit Card and Internet Banking.", [
        //     {text: 'OK', onPress: () => okayPressed()},
        //   ]);
    }

    const okayPressed = ()=>{
            doPayment();
    }

    const doPayment = () => {
        if (amount == null || amount == '') {
            setAmounntIsRequired(true);
            return false;
        }else  if (validate()) {
        var options = {
            description: 'UESI-TS App',
            image: '../assets/uesi-ts-logo.png',
            currency: 'INR',
            key: 'rzp_live_8VfOQxZZPfUDVl', //'rzp_test_sczJuQC9MiEjRs',
            amount: Number(amount)*100,
            name: 'UESI-TS',
            order_id: '',//Replace this with an order_id created using Orders API.
            prefill: {
              email: email,
              contact: mobileNumber,
              name: firstName+' '+ lastName
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
            //console.log(data);
            registerDonatedUserDetails();
            
            //placeOrder(data);
            //alert(`Success: ${data.razorpay_payment_id}`);
          }).catch((error) => {
            // handle failure
            //console.log(error);
            Alert.alert('Error:', error.error.description, [
                {text: 'OK', onPress: () => {}},
            ]);
          });
        }catch(error){
            console.log(error);
        }
    }else{

    }
    }
    
    const login = () => {
        //if (validate()) {
            setData({
                ...formData,
                loading: true
            });

            let sendData = new FormData();
            sendData.append('email', email);
            sendData.append('password', password);
            sendData.append('firebase_token', props.FCM_TOKEN);
            try {
                getApi.postData(
                    'user/login',
                    sendData,
                ).then((response => {
                    logfunction("RESPONSE ", response)
                    if (response.status == 1) {
                        logfunction("RESPONSE ", 'Success')
                        setData({
                            ...formData,
                            email: null,
                            password: null,
                            loading: false
                        });
                        saveUserAccessData(response);
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
                    props.doLogin(response, '');
                }));
            } catch (error) {
                logfunction("Error", error)
                setData({
                    ...formData,
                    loading: false
                });
            }
        //}
    }

    const selectedItem = {
        title: 'Selected item title',
        description: 'Secondary long descriptive text ...',
    };

    const dropDownClosed = () =>{
        setShowDropDown(false);
        setAmounntIsRequired(false);
    }
    
    const amountDropdown = () => {
        return (
            <>
            
            <Provider theme={nightMode ? DarkTheme : DefaultTheme}>
        
              <View style={styles1.containerStyle}>
                <View style={styles1.safeContainerStyle}>
                  <DropDown
                    label={"Choose your donation Amount"}
                    mode={"outlined"}
                    visible={showDropDown}
                    showDropDown={() => setShowDropDown(true)}
                    onDismiss={() => dropDownClosed()}
                    value={amount}
                    setValue={setAmount}
                    list={amountList}
                    dropDownContainerMaxHeight={'100%'}
                    dropDownContainerHeight={'100%'}
                    dropDownStyle={styles1.viewStyle}
                  />
                 </View>
                </View>
              
           
          </Provider>
          </>
        );
    };

    const showGetFullDetails = () => {
        return (
          <>
          <View>
                <View style={{display:'flex', flexDirection:'row', alignItems:'center',paddingBottom:10}}>
                <Image source={greenTick} style={{height:30,width:30,paddingHorizontal:10,marginHorizontal:10}} />
                    <Text style={{paddingRight:50}}>User already registered, Kindly fill the following data to Complete.</Text>
                    </View>
                    
                <FormControl style={{ backgroundColor: Colors().white }} isRequired isInvalid={submited && 'name' in errors}>
                    <Input variant="outline" placeholder={strings.commoninput.placeholder_first_name} style={GlobalStyles.textInputStyle}
                        value={formData.firstName}
                        onChangeText={(value) => { setData({ ...formData, firstName: value }), delete errors.name }}
                    />
                    <FormControl.ErrorMessage
                        leftIcon={<InfoOutlineIcon size="xs" />}
                    >
                        {errors.name}
                    </FormControl.ErrorMessage>
                </FormControl>
                <OtrixDivider size={'sm'} />
                <FormControl style={{ backgroundColor: Colors().white }} isRequired >
                    <Input variant="outline" placeholder={strings.commoninput.placeholder_last_name} style={GlobalStyles.textInputStyle}
                        onChangeText={(value) => setData({ ...formData, lastName: value })}
                        value={formData.lastName}
                        
                    />
                </FormControl>
                <OtrixDivider size={'sm'} />
                <FormControl style={{ backgroundColor: Colors().white }} isRequired isInvalid={submited && 'email' in errors || 'invalidEmail' in errors}>
                    <Input variant="outline" placeholder={strings.commoninput.placeholder_email} style={[GlobalStyles.textInputStyle,{backgroundColor:'#bf0000'}]}
                        keyboardType="email-address"
                        onChangeText={(value) => { setData({ ...formData, email: value }), delete errors.email, delete errors.invalidEmail }}
                        value={formData.email}
                        editable={false}
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
                <FormControl style={{ backgroundColor: Colors().white }} isRequired isInvalid={submited && 'mobileNumber' in errors || 'invalidmobileNumber' in errors}>
                    <Input variant="outline" keyboardType="number-pad" placeholder={strings.commoninput.placeholder_phone} style={GlobalStyles.textInputStyle}
                        onChangeText={(value) => { setData({ ...formData, mobileNumber: value }), delete errors.mobileNumber, delete errors.invalidmobileNumber }}
                        value={formData.mobileNumber}
                    />

                    {
                        'invalidmobileNumber' in errors == false && 'mobileNumber' in errors && <FormControl.ErrorMessage
                            leftIcon={<InfoOutlineIcon size="xs" />}
                        >
                            {errors.mobileNumber}
                        </FormControl.ErrorMessage>
                    }
                    {
                        'invalidmobileNumber' in errors && <FormControl.ErrorMessage
                            leftIcon={<InfoOutlineIcon size="xs" />}
                        >
                            {errors.invalidmobileNumber}
                        </FormControl.ErrorMessage>
                    }

                </FormControl>
                <OtrixDivider size={'sm'} />
                <FormControl style={{ backgroundColor: Colors().white }} isRequired={true} isInvalid={submited && 'password' in errors}>
                    <Input variant="outline" placeholder={strings.commoninput.placeholder_password} style={GlobalStyles.textInputStyle}
                        onChangeText={(value) => { setData({ ...formData, submited: false, password: value }), delete errors.password }}
                        value={formData.password}
                        secureTextEntry={state.secureEntry}
                        InputRightElement={
                            <TouchableOpacity onPress={() => setDatapassword({ ...state, secureEntry: !state.secureEntry })} style={{ marginRight: wp('3%') }}>
                                <Icon name={state.secureEntry == true ? "eye-off" : "eye"} size={18} color={Colors().secondry_text_color} />
                            </TouchableOpacity>
                        }
                    />
                    <FormControl.ErrorMessage
                        leftIcon={<InfoOutlineIcon size="xs" />}
                    >
                        {errors.password}
                    </FormControl.ErrorMessage>
                </FormControl>
                <OtrixDivider size={'sm'} />
                <FormControl style={{ backgroundColor: Colors().white }} isRequired isInvalid={submited && 'cpassword' in errors}>
                    <Input variant="outline" placeholder={strings.commoninput.placeholder_confirm_password} style={GlobalStyles.textInputStyle}
                        onChangeText={(value) => { setData({ ...formData, submited: false, cpassword: value }), delete errors.cpassword }}
                        value={formData.cpassword}
                        secureTextEntry={state.secureEntry}
                        InputRightElement={
                            <TouchableOpacity onPress={() => setDatapassword({ ...state, secureEntry: !state.secureEntry })} style={{ marginRight: wp('3%') }}>
                                <Icon name={state.secureEntry == true ? "eye-off" : "eye"} size={18} color={Colors().secondry_text_color} />
                            </TouchableOpacity>
                        }
                    />
                    <FormControl.ErrorMessage
                        leftIcon={<InfoOutlineIcon size="xs" />}
                    >
                        {errors.cpassword}
                    </FormControl.ErrorMessage>
                </FormControl>
                <OtrixDivider size={'md'} />
                <Button
                    size="md"
                    variant="solid"
                    bg={Colors().themeColor}
                    style={GlobalStyles.button}
                    isLoading={loading}
                    onPress={() => saveDonatedUserDetails()}
                >
                    <Text style={GlobalStyles.buttonText}>Complete</Text>
                </Button>
                <OtrixDivider size={'md'} />
                </View>
              </>
        );
    };

    const register = () => {
        
        if (validate()) {
            setData({
                ...formData,
                loading: true
            })
            let sendData = new FormData();
            sendData.append('firstname', firstName);
            sendData.append('lastname', lastName)
            sendData.append('email', email.toLowerCase());
            sendData.append('telephone', mobileNumber)
            sendData.append('password', password)
            sendData.append('creation', 'D')

            try {
                getApi.postData(
                    'user/register',
                    sendData,
                ).then((response => {
                    
                    logfunction("RESPONSE ", response)
                    if (response.status == 1) {
                        //props.navigation.navigate("RegisterSuccessScreen");
                        login();
                       // saveUserAccessData();
                    }
                    else {
                        login();
                        //saveUserAccessData();
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
        }
    }

    const registerExistingUser = () => {
        setTimeout(()=>{
            if(paymentMType =='song_book'){
                if(TrackPlayer){
                    TrackPlayer.reset();
                    setSongsToPlayer();
                }
            }
        },1000);

        if (validate()) {
            // setData({
            //     ...formData,
            //     loading: true
            // })
            let sendData = new FormData();
            sendData.append('firstname', firstName);
            sendData.append('lastname', lastName)
            sendData.append('email', email.toLowerCase());
            sendData.append('telephone', mobileNumber)
            sendData.append('password', password)
            sendData.append('creation', 'D')

            try {
                getApi.postData(
                    'user/register',
                    sendData,
                ).then((response => {
                    logfunction("RESPONSE ", response);
                    login();
                    //saveUserAccessData();
                    // if (response.status == 1) {
                    //     //props.navigation.navigate("RegisterSuccessScreen");
                    // }
                    // else {
                    //     setData({
                    //         ...formData,
                    //         type: 'error',
                    //         message: response.message,
                    //         loading: false
                    //     });
                    //     setTimeout(() => {
                    //         setData({
                    //             ...formData,
                    //             message: null,
                    //             loading: false
                    //         })
                    //     }, 3000);
                    // }
                }));
            } catch (error) {
               
                logfunction("Error", error)
                setData({
                    ...formData,
                    loading: false
                })
                //saveUserAccessData();
                login();
            }
        }
    }

    async function setSongsToPlayer() {
        
            try{
                await AsyncStorage.getItem('TOTAL_SONGS').then(data=>{
                if(data){
                    addSongsToPlayer(JSON.parse(data));
                }
                });
            } catch (error) {
                console.log(error);
            }
          
    }
    const addSongsToPlayer =  (songs) =>{
        PlayList = [];
        songs.map((data,index)=>{
            data.song_json = data.song_json.replaceAll('\"','"');
            data.song_json = data.song_json.replaceAll('"[','[');
            data.song_json = data.song_json.replaceAll(']"',']');
            let songJson = JSON.parse(data.song_json);
            let count = 0;
            songJson?.map((song_json,index1)=>{
                if(song_json.song && song_json.song[0] && song_json.song[0].url && song_json.song[0].url !==''){
                    song_json.song[0].artwork = require('../assets/images/web-logo1.jpeg');
                    
                      if(song_json.song[0].url!=''){
                        PlayList.push(song_json.song[0]);
                      }
                    
                    //TrackPlayer.add(song_json.song[0]);
                }
            });
            if(index === songs.length-1){
                try{             
                      setTimeout(()=>{    
                          TrackPlayer.add(PlayList);
                          TrackPlayer.getQueue().then(data=>{
                            console.log(data.length);
                          });
                      },1000);
                } catch (error) {
                    console.log(error);
                }
            }
        });
      }

    const { strings } = props;

    return (
        <SafeAreaView style={{backgroundColor:'#fff'}}>
<ScrollView style={{height:'100%'}}>
        <View>

            {/* Header */}
            <OtrixHeader customStyles={{ backgroundColor:'#fff', height: Platform.OS === 'ios' ? wp('22%') : wp('22%') }}>
                <TouchableOpacity style={[GlobalStyles.headerLeft, { flex: 0.05 }]} onPress={() => props.navigation.goBack()}>
                    <OtirxBackButton />
                </TouchableOpacity>
                <View style={[{ flex: 0.95, justifyContent: 'center', alignContent: 'center' }]}>
                    <Text style={[GlobalStyles.authtabbarText, { lineHeight: hp('11%') }]}>User Login</Text>
                    <Text style={[GlobalStyles.authSubText]}>Pay and Register to get all songs</Text>
                </View>
            </OtrixHeader>
        
            <OtrixDivider size={'sm'} />

            {/* Content Start from here */}
            <View style={{backgroundColor:'#fff',paddingHorizontal:20,marginTop:10}}>
                <View style={{backgroundColor:'#fff',display:'flex', flexDirection:'row', alignItems:'center'}}>
                <RadioButton value="new" status={ checked === 'new' ? 'checked' : 'unchecked' } onPress={()  => setChecked('new')} />
                <Text style={{fontSize:16}}>New User</Text>
                </View>
                <OtrixDivider size={'sm'} />
                <View style={{display:'flex', flexDirection:'row', alignItems:'center'}}>
                <RadioButton value="donated" status={ checked === 'donated' ? 'checked' : 'unchecked' } onPress={() => setChecked('donated')} /> 
                <Text style={{fontSize:16}}>Already Donated User</Text>
                </View>
                <OtrixDivider size={'lg'} />

                {/* New User Registration Start */}
                {checked==='new'?<View>

                    <View style={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'flex-start'}}>
                    <View style={{backgroundColor:'#fff',display:'flex', flexDirection:'row', alignItems:'center'}}>
                        <RadioButton value="graduate" status={ studentOrGraduate === 'graduate' ? 'checked' : 'unchecked' } onPress={()  => setAmountValues('graduate')} />
                        <Text style={{fontSize:16}}>Graduate</Text>
                    </View>
                    <View style={{display:'flex', flexDirection:'row', alignItems:'center', marginLeft:30}}>
                        <RadioButton value="student" status={ studentOrGraduate === 'student' ? 'checked' : 'unchecked' } onPress={() => setAmountValues('student')} /> 
                        <Text style={{fontSize:16}}>Student</Text>
                    </View>
                    </View>
                <View style={{position:'relative', zIndex:999999999,marginBottom:10}}>{amountDropdown()}
                
                {amounntIsRequired?<Text style={{color:'#ff0000'}}>Amount is Required</Text>:null}
                    </View>
                <FormControl style={{ backgroundColor: Colors().white }} isRequired isInvalid={submited && 'name' in errors}>
                    <Input variant="outline" placeholder={strings.commoninput.placeholder_first_name} style={GlobalStyles.textInputStyle}
                        onChangeText={(value) => { setData({ ...formData, submited: false, firstName: value }), delete errors.name }}
                    />
                    <FormControl.ErrorMessage
                        leftIcon={<InfoOutlineIcon size="xs" />}
                    >
                        {errors.name}
                    </FormControl.ErrorMessage>
                </FormControl>
                <OtrixDivider size={'sm'} />
                <FormControl style={{ backgroundColor: Colors().white }} isRequired >
                    <Input variant="outline" placeholder={strings.commoninput.placeholder_last_name} style={GlobalStyles.textInputStyle}
                        onChangeText={(value) => setData({ ...formData, submited: false, lastName: value })}
                    />
                </FormControl>
                <OtrixDivider size={'sm'} />
                <FormControl style={{ backgroundColor: Colors().white }} isRequired isInvalid={submited && 'email' in errors || 'invalidEmail' in errors}>
                    <Input variant="outline" placeholder={strings.commoninput.placeholder_email} style={GlobalStyles.textInputStyle}
                        keyboardType="email-address"
                        onChangeText={(value) => { setData({ ...formData, email: value }), delete errors.email, delete errors.invalidEmail }}
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
                <FormControl style={{ backgroundColor: Colors().white }} isRequired isInvalid={submited && 'mobileNumber' in errors || 'invalidmobileNumber' in errors}>
                    <Input variant="outline" keyboardType="number-pad" placeholder={strings.commoninput.placeholder_phone} style={GlobalStyles.textInputStyle}
                        onChangeText={(value) => { setData({ ...formData, submited: false, mobileNumber: value }), delete errors.mobileNumber, delete errors.invalidmobileNumber }}
                    />

                    {
                        'invalidmobileNumber' in errors == false && 'mobileNumber' in errors && <FormControl.ErrorMessage
                            leftIcon={<InfoOutlineIcon size="xs" />}
                        >
                            {errors.mobileNumber}
                        </FormControl.ErrorMessage>
                    }
                    {
                        'invalidmobileNumber' in errors && <FormControl.ErrorMessage
                            leftIcon={<InfoOutlineIcon size="xs" />}
                        >
                            {errors.invalidmobileNumber}
                        </FormControl.ErrorMessage>
                    }

                </FormControl>
                <OtrixDivider size={'sm'} />
                <FormControl style={{ backgroundColor: Colors().white }} isRequired={true} isInvalid={submited && 'password' in errors}>
                    <Input variant="outline" placeholder={strings.commoninput.placeholder_password} style={GlobalStyles.textInputStyle}
                        onChangeText={(value) => { setData({ ...formData, submited: false, password: value }), delete errors.password }}
                        secureTextEntry={state.secureEntry}
                        InputRightElement={
                            <TouchableOpacity onPress={() => setDatapassword({ ...state, secureEntry: !state.secureEntry })} style={{ marginRight: wp('3%') }}>
                                <Icon name={state.secureEntry == true ? "eye-off" : "eye"} size={18} color={Colors().secondry_text_color} />
                            </TouchableOpacity>
                        }
                    />
                    <FormControl.ErrorMessage
                        leftIcon={<InfoOutlineIcon size="xs" />}
                    >
                        {errors.password}
                    </FormControl.ErrorMessage>
                </FormControl>
                <OtrixDivider size={'sm'} />
                <FormControl style={{ backgroundColor: Colors().white }} isRequired isInvalid={submited && 'cpassword' in errors}>
                    <Input variant="outline" placeholder={strings.commoninput.placeholder_confirm_password} style={GlobalStyles.textInputStyle}
                        onChangeText={(value) => { setData({ ...formData, submited: false, cpassword: value }), delete errors.cpassword }}
                        secureTextEntry={state.secureEntry}
                        InputRightElement={
                            <TouchableOpacity onPress={() => setDatapassword({ ...state, secureEntry: !state.secureEntry })} style={{ marginRight: wp('3%') }}>
                                <Icon name={state.secureEntry == true ? "eye-off" : "eye"} size={18} color={Colors().secondry_text_color} />
                            </TouchableOpacity>
                        }
                    />
                    <FormControl.ErrorMessage
                        leftIcon={<InfoOutlineIcon size="xs" />}
                    >
                        {errors.cpassword}
                    </FormControl.ErrorMessage>
                </FormControl>
                <OtrixDivider size={'md'} />
                <Button
                    size="md"
                    variant="solid"
                    bg={Colors().themeColor}
                    style={GlobalStyles.button}
                    isLoading={loading}
                    onPress={() => verifyingForNewUser()}
                >
                    <Text style={GlobalStyles.buttonText}>{strings.registration.button_register}</Text>
                </Button>
                <OtrixDivider size={'sm'} />
                </View>:null}
                {/* New User Registration End */}

                {/* Verify donated user start */}
                {(checked==='donated' && !verified)?<View>
                
                <OtrixDivider size={'sm'} />
                <FormControl style={{ backgroundColor: Colors().white }} isRequired isInvalid={submited && 'email' in errors || 'invalidEmail' in errors}>
                    <Input variant="outline" placeholder={strings.commoninput.placeholder_email} style={GlobalStyles.textInputStyle}
                        keyboardType="email-address"
                        onChangeText={(value) => { setData({ ...formData, email: value }), delete errors.email, delete errors.invalidEmail }}
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
                <Text style={{textAlign:'center',marginBottom:10}}>OR</Text>
                <FormControl style={{ backgroundColor: Colors().white }} isRequired isInvalid={submited && 'mobileNumber' in errors || 'invalidmobileNumber' in errors}>
                    <Input variant="outline" keyboardType="number-pad" placeholder={strings.commoninput.placeholder_phone} style={GlobalStyles.textInputStyle}
                        onChangeText={(value) => { setData({ ...formData, submited: false, mobileNumber: value }), delete errors.mobileNumber, delete errors.invalidmobileNumber }}
                    />

                    {
                        'invalidmobileNumber' in errors == false && 'mobileNumber' in errors && <FormControl.ErrorMessage
                            leftIcon={<InfoOutlineIcon size="xs" />}
                        >
                            {errors.mobileNumber}
                        </FormControl.ErrorMessage>
                    }
                    {
                        'invalidmobileNumber' in errors && <FormControl.ErrorMessage
                            leftIcon={<InfoOutlineIcon size="xs" />}
                        >
                            {errors.invalidmobileNumber}
                        </FormControl.ErrorMessage>
                    }

                </FormControl>
                
                <OtrixDivider size={'md'} />
                <Button
                    size="md"
                    variant="solid"
                    bg={Colors().themeColor}
                    style={GlobalStyles.button}
                    isLoading={loading}
                    onPress={() => verify()}
                >
                    <Text style={GlobalStyles.buttonText}>Verify User</Text>
                </Button>
                <OtrixDivider size={'sm'} />
                </View>:null}
                    {/* Verify donated user End */}
                    
                {/* Save Full Details of Donated User Start */}
                {/* {(checked==='donated' && verified)?:null} */}
                {verified?showGetFullDetails():null}
                {/* Save Full Details of Donated User End */}


                {/* <View style={styles.registerView}>
                    <Text style={styles.registerTxt}>{strings.registration.label_login_info} </Text>
                    <TouchableOpacity onPress={() => props.navigation.navigate('LoginScreen')}>
                        <Text style={styles.signupTxt}> {strings.registration.button_login} </Text>
                    </TouchableOpacity>
                </View> */}
                <OtrixDivider size={'md'} />



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
        setSongsDonated,
        doLogin
    }, dispatch)
  );

export default connect(mapStateToProps, mapDispatchToProps) (SongRegisterScreen);

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