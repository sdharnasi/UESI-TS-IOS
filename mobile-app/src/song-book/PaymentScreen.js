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
    RadioButton,
    Checkbox
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
import { useFocusEffect } from '@react-navigation/native';
// import DropDown from "react-native-paper-dropdown";
let greenTick = require('../assets/images/checkmark.png');
import RazorpayCheckout from 'react-native-razorpay';
import DropDown from "react-native-paper-dropdown";  
import * as RootNavigation from './../AppNavigator';
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

function PaymentScreen(props) {
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
    const [userAccess,setUserAccess] = React.useState({});
    const [paymentMType,setPaymentMType] = React.useState(null);
    const [amountList, setAmountList] = React.useState([]);
    const [paymentDetails, setPaymentDetails] = React.useState([]);
    const [checkedSongBook, setCheckedSongBook] = React.useState(false);
    const [checkedTRICON2020, setCheckedTRICON2020] = React.useState(false);
    const [checkedTRICON2023, setCheckedTRICON2023] = React.useState(false);
    const [totalAmount, setTotalAmount] = React.useState(0);
    //const [selectedTotalAmount, setSelectedTotalAmount] = React.useState(0);
    const [extraAmount, setExtraAmount] = React.useState(0);

        useFocusEffect(
            useCallback(() => {
                //console.log(props.paymentModuleType);
                async function getCustomerData() {
                    await AsyncStorage.getItem("CUSTOMER_DATA").then(data=>{
                        setCustmerData(JSON.parse(data));
                    });
                }
                getCustomerData();

                
            }, [props])
        )

    useEffect(() => {
        const { paymentModuleType } = props.route.params;
        setPaymentMType(paymentModuleType);
        async function getUserAccess() {
            await AsyncStorage.getItem("USER_ACCESS").then(data=>{
                //console.log(data)
                setUserAccess(JSON.parse(data));
                GetPurchaseDetails(JSON.parse(data));
            });
        }
        getUserAccess();
        async function GetPurchaseDetails(user_access_data) {
            try {
                let sendData = new FormData();
                sendData.append('module_type', paymentMType);
                getApi.postData(
                    'user/getModulesPurchaseDetails',
                    sendData,
                ).then(( async response => {
                    if(response.status === 1){
                        let filteredPaymenentDetails = [];
                        response.data.forEach((data=>{
                            if(user_access_data[data.module_type] && user_access_data[data.module_type]===1){

                            }else{
                                data['checked'] = false;
                                filteredPaymenentDetails.push(data);
                            }
                            
                        }));
                        setPaymentDetails(filteredPaymenentDetails);
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
        }
        
        
        // getUniqueId().then(data=>{
        //     setDeviceId(data);
        // });
        // getDeviceName().then(data=>{
        //     setDeviceName(data);
        // });
    }, [props,paymentMType]);


    async function setSongsDonated() {
        await AsyncStorage.setItem('songs_donated','1');
        props.setSongsDonated('1');
        //RootNavigation.navigate('UESIHomeScreen');
        //props.navigation.navigate('UESIHomeScreen');
      }

      const saveUserAccessData = () => {
            let moduleData = paymentDetails.filter(data=>data.checked===true);
            let modduleDataArray = [];
            moduleData.forEach(module=>{
                modduleDataArray.push({
                    module_type:module.module_type,
                    amount: studentOrGraduate === 'student'?module.student_amount_min:module.graduate_amount_min
                });
            });
            if(extraAmount>0){
                modduleDataArray.push({
                    module_type:'extra_amount',
                    amount: extraAmount
                });
            }
            setData({
                ...formData,
                loading: true
            })
            let sendData = new FormData();
            sendData.append('user_id', custmerData.id);
            //sendData.append('module_type', paymentMType);
            //sendData.append('module_amount', amount);
            sendData.append('module_data', JSON.stringify(modduleDataArray));
            try {
                getApi.postData(
                    'user/saveUserAccessData',
                    sendData,
                ).then((response => {
                    //console.log(JSON.stringify(response));
                    logfunction("RESPONSE ", response)
                    if (response.status == 1) {

                        let user_access = {};
                        if(response.data && response.data.length>0){
                            response.data.forEach((access,index)=>{
                                user_access[access.module_type] = access.status;
                            });
                        }
                        //console.log(user_access);
                        AsyncStorage.setItem('USER_ACCESS', JSON.stringify(user_access));
                        if(paymentMType =='song_book'){
                            setSongsDonated();
                        }
                       // setSongsDonated();
                        //login();
                        setTimeout(()=>{
                            setData({
                                ...formData,
                                loading: false
                            })
                            props.navigation.goBack();
                            //props.navigation.goBack();
                            // if(paymentMType =='song_book'){
                            //     props.navigation.navigate('TeluguSongsScreen');
                            //     //RootNavigation.navigate('TeluguSongsScreen');
                            // }else if(paymentMType =='tricon_2020'){
                            //     //RootNavigation.navigate('Tricon2020Screen');
                            //     props.navigation.navigate('Tricon2020Screen');
                            // }else if(paymentMType =='tricon_2023'){
                            //     //RootNavigation.navigate('Tricon2023Screen');
                            //     props.navigation.navigate('Tricon2023Screen');
                            // }else{
                            //     //RootNavigation.navigate('HomeScreen');
                            //     props.navigation.navigate('HomeScreen');
                            // }
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


    const doPayment = () => {
        if (amount == null || amount == '') {
            setAmounntIsRequired(true);
            return false;
        }else {
        var options = {
            description: 'UESI-TS App',
            image: '../assets/uesi-ts-logo.png',
            currency: 'INR',
            key: 'rzp_live_8VfOQxZZPfUDVl', //'rzp_test_sczJuQC9MiEjRs',
            amount: (Number(amount)+Number(extraAmount))*100,
            name: 'UESI-TS',
            order_id: '',//Replace this with an order_id created using Orders API.
            prefill: {
              email: custmerData.email,
              contact: custmerData.telephone,
              name: custmerData.firstname+' '+custmerData.lastname
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
            //setSongsDonated();
            saveUserAccessData();
            // handle success
            //console.log(data);
            //registerDonatedUserDetails();
            //registerExistingUser();
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
    }
    }

    const selectedItem = {
        title: 'Selected item title',
        description: 'Secondary long descriptive text ...',
    };
    const setAmountValues = (userType)=>{
        setStudentOrGraduate(userType);
        calculateAmount(userType);
        setAmountList(JSON.parse(paymentDetails[0].student_amount_list));
        // if(userType ==='student'){
        //     setAmountList(JSON.parse(paymentDetails.student_amount_list)); 
        // }else if(userType ==='graduate'){
        //     setAmountList(JSON.parse(paymentDetails.graduate_amount_list));  
        // }
    }
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
                    label={"Choose extra donation Amount (optional)"}
                    mode={"outlined"}
                    visible={showDropDown}
                    showDropDown={() => setShowDropDown(true)}
                    onDismiss={() => dropDownClosed()}
                    value={extraAmount}
                    setValue={setExtraAmount}
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
                            //console.log(data.length);
                          });
                      },1000);
                } catch (error) {
                    console.log(error);
                }
            }
        });
      }
    const calculateAmount = (SorG)=>{
        let total = 0;
        setTotalAmount(total);
        if(SorG === 'student'){
            paymentDetails.forEach((module,index)=>{
                if(module.checked){
                    total = total + module.student_amount_min;
                    setTotalAmount(total);
                }
            });
        } else if(SorG === 'graduate'){
            paymentDetails.forEach((module,index)=>{
                if(module.checked){
                    total = total + module.graduate_amount_min;
                    setTotalAmount(total);
                }
            });
        }
        setAmount(total);
    }

    const { strings } = props;

    return (
        <SafeAreaView style={{height:'100%', backgroundColor:'#fff'}}>
            <ScrollView style={{height:'100%'}}>
                <View style={{height:'100%'}}>
                    <OtrixDivider size={'sm'} />
                    <View style={{backgroundColor:'#fff',paddingHorizontal:20,marginTop:10}}>
                    {paymentMType=='song_book'?<Text style={{fontFamily:Fonts.Font_Medium}}>Pay and get all Songs</Text>:null}
                     {paymentMType=='tricon_2023'?<Text style={{fontFamily:Fonts.Font_Medium}}>Pay and get all Videos</Text>:null}
                    {paymentMType=='tricon_2020'?<Text style={{fontFamily:Fonts.Font_Medium}}>Pay and get all Videos</Text>:null}
                    </View>
                    <OtrixDivider size={'sm'} />
                    <View style={{backgroundColor:'#fff',paddingHorizontal:20,marginTop:10,height:'100%',marginBottom:500}}>
                        <View>
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
                    <OtrixDivider size={'md'} />
                    {studentOrGraduate!==''?<View>
                    
                    {(paymentDetails.length>0)?paymentDetails.map((data, index) => {
                        return <Checkbox.Item style={{ justifyContent: 'flex-start' }} labelStyle={{ textAlign: 'left', flexGrow: 0 }} label={data.label+ " - ₹" +(studentOrGraduate === 'student'?data.student_amount_min:data.graduate_amount_min)+"/-"} position="leading" color={Colors().themeColor} mode="android" status={data.checked ? 'checked' : 'unchecked'} onPress={() => {data.checked?data.checked=false:data.checked=true;calculateAmount(studentOrGraduate)}} />
                    }):null}
                    <Text style={{fontSize:16, display:'flex', marginLeft:'auto'}}>Total = ₹{totalAmount}/-</Text>
                    </View>:null}
                    <OtrixDivider size={'md'} />
                            <View style={{position:'relative', zIndex:999999999,marginBottom:10}}>
                                {totalAmount>0?amountDropdown():null}
                                {amounntIsRequired?<Text style={{color:'#ff0000'}}>Amount is Required</Text>:null}
                            </View>
                        <OtrixDivider size={'md'} />
                        <OtrixDivider size={'md'} />
                    
                        {totalAmount>0?<Button
                            size="md"
                            variant="solid"
                            bg={Colors().themeColor}
                            style={GlobalStyles.button}
                            isLoading={loading}
                            onPress={() => doPayment()}
                        >
                            <Text style={GlobalStyles.buttonText}>Pay</Text>
                        </Button>:null}
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
        strings: state.mainScreenInit.strings
    }
}
const mapDispatchToProps = dispatch => (
    bindActionCreators({
        setSongsDonated,
        doLogin
    }, dispatch)
  );

export default connect(mapStateToProps, mapDispatchToProps) (PaymentScreen);

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