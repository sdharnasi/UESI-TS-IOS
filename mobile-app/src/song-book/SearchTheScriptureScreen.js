import React, { useEffect,useState,useCallback } from "react";
import {
    View,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    Image,
    ScrollView,
    Alert,
    Dimensions,
    Platform
} from "react-native";
// import {
//     Appbar,
//     DarkTheme,
//     DefaultTheme,
//     Provider,
//     Surface,
//     ThemeProvider,
//     RadioButton,
//     Checkbox
//   } from 'react-native-paper';
import {
    OtrixContainer, OtrixHeader, OtrixContent, OtrixDivider, OtrixAlert, OtrixLoader
} from '@component';
import { Input, Text, FormControl, Button, InfoOutlineIcon } from "native-base"
import { connect } from 'react-redux';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { GlobalStyles, Colors, isValidEmail, isValidMobile, isValidpassword, isValidConfirmPassword } from '@helpers'
import { logfunction } from "@helpers/FunctionHelper";
import Fonts from "@helpers/Fonts";
import AsyncStorage from '@react-native-community/async-storage';
import { bindActionCreators } from "redux";
import { useFocusEffect } from '@react-navigation/native';
// import DropDown from "react-native-paper-dropdown";
import DropDown from "react-native-paper-dropdown";  
import DropDownPicker from 'react-native-dropdown-picker';
import { selectSong,setSongType,setSongs,setSongsDonated, setPaymentModuleType } from '@actions';
const { width, height } = Dimensions.get('screen');
const ssData = require('../assets/searchTheScripture.json');

function SearchTheScriptureScreen(props) {
    // const [colors, setColors] = useState('');
    // const [nightMode, setNightmode] = useState(false);
    const [custmerData,setCustmerData] = React.useState({});
    const [userAccess,setUserAccess] = React.useState({});

    const [showDayDropDown, setShowDayDropDown] = useState(false);
    const [showMonthDropDown, setShowMonthDropDown] = useState(false);
    const [showYearDropDown, setShowYearDropDown] = useState(false);
    const [contentVisible, setContentVisible] = useState(false);
    const [ssContent, setSSContent] = useState('');

    const [year, setYear] = React.useState('yearone');
    const [month, setMonth] = React.useState('1');
    const [day, setDay] = React.useState('1');

    const [yearList, setYearList] = React.useState([{"label": "Year-1", "value": "yearone"}, {"label": "Year-2", "value": "yeartwo"}, {"label": "Year-3", "value": "yearthree"}]);
    const [monthList, setMonthList] = React.useState([{"label": "Jan", "value": "1"}, {"label": "Feb", "value": "2"}, {"label": "Mar", "value": "3"}, {"label": "Apr", "value": "4"}, {"label": "May", "value": "5"}, {"label": "Jun", "value": "6"}, {"label": "July", "value": "7"}, {"label": "Aug", "value": "8"}, {"label": "Sep", "value": "9"}, {"label": "Oct", "value": "10"}, {"label": "Nov", "value": "11"}, {"label": "Dec", "value": "12"}]);
    const [dayList, setDayList] = React.useState([{"label":"Day - 1","value":"1"},{"label":"Day - 2","value":"2"},{"label":"Day - 3","value":"3"},{"label":"Day - 4","value":"4"},{"label":"Day - 5","value":"5"},{"label":"Day - 6","value":"6"},{"label":"Day - 7","value":"7"},{"label":"Day - 8","value":"8"},{"label":"Day - 9","value":"9"},{"label":"Day - 10","value":"10"},{"label":"Day - 11","value":"11"},{"label":"Day - 12","value":"12"},{"label":"Day - 13","value":"13"},{"label":"Day - 14","value":"14"},{"label":"Day - 15","value":"15"},{"label":"Day - 16","value":"16"},{"label":"Day - 17","value":"17"},{"label":"Day - 18","value":"18"},{"label":"Day - 19","value":"19"},{"label":"Day - 20","value":"20"},{"label":"Day - 21","value":"21"},{"label":"Day - 22","value":"23"},{"label":"Day - 24","value":"24"},{"label":"Day - 25","value":"25"},{"label":"Day - 26","value":"26"},{"label":"Day - 27","value":"27"},{"label":"Day - 28","value":"28"},{"label":"Day - 29","value":"29"},{"label":"Day - 30","value":"30"},{"label":"Day - 31","value":"31"}]);


  
        useFocusEffect(
            useCallback(() => {
                setShowDayDropDown(false);
                setShowMonthDropDown(false);
                setShowYearDropDown(false);
                async function getCustomerData() {
                    await AsyncStorage.getItem("CUSTOMER_DATA").then(data=>{
                        setCustmerData(JSON.parse(data));
                    });
                }
                getCustomerData();
            }, [props])
        )

    useEffect(() => {
        async function getUserAccess() {
            await AsyncStorage.getItem("USER_ACCESS").then(data=>{
                let userAccessInfo = JSON.parse(data);
                setUserAccess(userAccessInfo);
                if(!(userAccessInfo && userAccessInfo?.song_book=='1')){
                  setMonthList([{"label": "Jan", "value": "1"}]);
                  setDayList([{"label":'Day - 1',"value":'1'}]);
                }else{
                    setMonthList([{"label": "Jan", "value": "1"}, {"label": "Feb", "value": "2"}, {"label": "Mar", "value": "3"}, {"label": "Apr", "value": "4"}, {"label": "May", "value": "5"}, {"label": "Jun", "value": "6"}, {"label": "July", "value": "7"}, {"label": "Aug", "value": "8"}, {"label": "Sep", "value": "9"}, {"label": "Oct", "value": "10"}, {"label": "Nov", "value": "11"}, {"label": "Dec", "value": "12"}]);
                    setDayList([{"label":"Day - 1","value":"1"},{"label":"Day - 2","value":"2"},{"label":"Day - 3","value":"3"},{"label":"Day - 4","value":"4"},{"label":"Day - 5","value":"5"},{"label":"Day - 6","value":"6"},{"label":"Day - 7","value":"7"},{"label":"Day - 8","value":"8"},{"label":"Day - 9","value":"9"},{"label":"Day - 10","value":"10"},{"label":"Day - 11","value":"11"},{"label":"Day - 12","value":"12"},{"label":"Day - 13","value":"13"},{"label":"Day - 14","value":"14"},{"label":"Day - 15","value":"15"},{"label":"Day - 16","value":"16"},{"label":"Day - 17","value":"17"},{"label":"Day - 18","value":"18"},{"label":"Day - 19","value":"19"},{"label":"Day - 20","value":"20"},{"label":"Day - 21","value":"21"},{"label":"Day - 22","value":"23"},{"label":"Day - 24","value":"24"},{"label":"Day - 25","value":"25"},{"label":"Day - 26","value":"26"},{"label":"Day - 27","value":"27"},{"label":"Day - 28","value":"28"},{"label":"Day - 29","value":"29"},{"label":"Day - 30","value":"30"},{"label":"Day - 31","value":"31"}]);
                }
                setContent('day',day);
            });
        }
        getUserAccess();
    }, [props]);

    const dropDownClosed = (type,value) =>{
      if(type === 'day'){
        setShowDayDropDown(false);
      }else if(type === 'month'){
        setShowMonthDropDown(false);
      }else if(type === 'year'){
        setShowYearDropDown(false);
      }
    }
    const dropDownOpen = (value) =>{
      if(value === 'day'){
        setShowDayDropDown(true);
        setShowMonthDropDown(false);
        setShowYearDropDown(false);
      }else if(value === 'month'){
        setShowDayDropDown(false);
        setShowMonthDropDown(true);
        setShowYearDropDown(false);
      }else if(value === 'year'){
        setShowDayDropDown(false);
        setShowMonthDropDown(false);
        setShowYearDropDown(true);
      }
    }
    const setDayValues = (value) =>{
      if(!(userAccess && userAccess?.song_book=='1')){
        let days = [];
        for(let i=1;i<=31;i++){
          days.push({"label":'Day - '+i,"value":i});
        };
        setDayList(days);
      }else{
      let days = [];
      if(value == 1 || value == 3 || value == 5 || value == 7 || value == 8 || value == 10 || value == 12 ){
        // upto 31
        for(let i=1;i<=31;i++){
          days.push({"label":'Day - '+i,"value":i});
        };
      } else if(value == 2){ // upto 28 
        for(let i=1;i<=28;i++){
          days.push({"label":'Day - '+i,"value":i});
        };
      }else { // upto 30 
        for(let i=1;i<=30;i++){
          days.push({"label":'Day - '+i,"value":i});
        };
      } 
      setDayList(days);
      
    }
    setDay('1');
    }
    const onDayOpen = useCallback(() => {
      setShowYearDropDown(false);
      setShowMonthDropDown(false);
      setContentVisible(false);
    });
    const onMonthOpen = useCallback(() => {
      setShowYearDropDown(false);
      setShowDayDropDown(false);
      setContentVisible(false);
    });
    const onYearOpen = useCallback(() => {
      setShowMonthDropDown(false);
      setShowDayDropDown(false);
      setContentVisible(false);
    });
    const onDayClose = useCallback(() => {
      setContentVisible(true);
    });

    const onDayChangeValue = useCallback((value) => {
      setDay(value);
      setContent('day',value);
    });

    const onMonthChangeValue = useCallback((value) => {
      setMonth(value);
      setDayValues(value);
      setContent('month',value);
    });

    const onYearChangeValue = useCallback((value) => {
      setYear(value);
      setContent('year',value);
    });

    const setContent = (type,value) =>{
      let content ='';
      if(type==='year'){
        content = ssData[value];
        content = content.filter((months)=>months.list_month == month && months.list_day == day);
      }else if(type==='month'){
        content = ssData[year];
        content = content.filter((months)=>months.list_month == value && months.list_day == day);
      } if(type==='day'){
        content = ssData[year];
        content = content.filter((months)=>months.list_month == month && months.list_day == value);
      }
      if(content && content.length>0){
        setSSContent(content[0]);
        setContentVisible(true);
      }
      
    }

    const yearDropdown = () => {
        return (
            <>
            <DropDownPicker
        open={showYearDropDown}
        placeholder="Year"
        value={year}
        items={yearList}
        setOpen={setShowYearDropDown}
        onChangeValue={()=>onYearChangeValue(year)}
        setValue={setYear}
        onOpen={onYearOpen}
        onClose={onDayClose}
        setItems={yearList}
        multiple={false}
        labelStyle={{
          fontWeight: "bold",
          color: Colors().themeColor
        }}
        textStyle={{
          fontSize: 15,
          color: Colors().themeColor
        }}
        placeholderStyle={{
          fontSize: 15,
          fontWeight: "bold",
          color: Colors().themeColor
        }}
        dropDownContainerStyle={{
          borderColor: Colors().themeColor
        }}
      />
          </>
        );
    };
    const monthDropdown = () => {
      return (
          <>
          <DropDownPicker
        open={showMonthDropDown}
        placeholder="Month"
        maxHeight={height-450}
        value={month}
        items={monthList}
        setOpen={setShowMonthDropDown}
        setValue={setMonth}
        onOpen={onMonthOpen}
        onClose={onDayClose}
        onChangeValue={()=>onMonthChangeValue(month)}
        setItems={monthList}
        multiple={false}
        labelStyle={{
          fontWeight: "bold",
          color: Colors().themeColor
        }}
        textStyle={{
          fontSize: 15,
          color: Colors().themeColor
        }}
        placeholderStyle={{
          fontSize: 15,
          fontWeight: "bold",
          color: Colors().themeColor
        }}
        dropDownContainerStyle={{
          borderColor: Colors().themeColor
        }}
      />
        </>
      );
  };
    const dayDropdown = () => {
      return (
          <>
      <DropDownPicker
        open={showDayDropDown}
        placeholder="Day"
        maxHeight={height-450}
        value={day}
        items={dayList}
        setOpen={setShowDayDropDown}
        onChangeValue={()=>onDayChangeValue(day)}
        onOpen={onDayOpen}
        onClose={onDayClose}
        setValue={setDay}
        setItems={dayList}
        multiple={false}
        labelStyle={{
          fontWeight: "bold",
          color: Colors().themeColor
        }}
        textStyle={{
          fontSize: 15,
          color: Colors().themeColor
        }}
        placeholderStyle={{
          fontSize: 15,
          fontWeight: "bold",
          color: Colors().themeColor
        }}
        dropDownContainerStyle={{
          borderColor: Colors().themeColor,
          backgroundColor:'#fff'
        }}
      />

        </>
      );
  };
  const openSongRegistrationPage = () => {
    props.setPaymentModuleType('song_book');
    if(custmerData){
       props.navigation.navigate('PaymentScreen',{paymentModuleType:'song_book'});
     }else{
       props.navigation.push("LoginScreen",{paymentModuleType:'song_book'});
     }
   }

  const showPaymentButton = () => {
    return (
      <>
      <View style={styles.bottomSection}>
        <View style={styles.bottomIconContainer}>
        <OtrixContent>
          <Button style={{backgroundColor: Colors().themeColor}} onPress={() => openSongRegistrationPage()}>
                    <Text style={styles.buttonText}>Donate for Search the scripture book</Text>
          </Button>
        </OtrixContent>
          </View>
          </View>
          </>
    );
  };
    const { strings } = props;

    return (
        <SafeAreaView style={{height:'100%', backgroundColor:'#fff'}}>
          <View style={{display:'flex', flexDirection:'column',marginLeft:10, marginTop:5}}>
            <View style={{position:'absolute', top:0}}>
                <View style={{ flexDirection:'row', justifyContent:'space-between', }}>
                    <View style={{ width:'30%'}}>
                        {yearDropdown()}
                    </View>
                    <View style={{width:'30%'}}>
                        {monthDropdown()}
                    </View>
                    <View style={{width:'35%'}}>
                        {dayDropdown()}
                    </View>
                </View>
            </View >
            <View style={{position:'absolute',top:-200}}>
              {contentVisible?
                  <View style={{ display:'flex',marginTop:280,paddingHorizontal:10}}>
                    <Text style={{fontSize: 18,color:'black',textAlign:'center'}}>{ssContent.local_title}</Text>
                  <ScrollView style={{ height:height-290}}>
                  <Text style={{fontSize: 16,color:'black',textAlign:'left',textAlign: 'justify',textJustify: 'inter-word'}}>{ssContent.local_text}</Text>
                  </ScrollView>
                  </View>
              :null}
            </View>
            {!(userAccess && userAccess?.song_book=='1')?showPaymentButton():null}
          </View>
        </SafeAreaView>
    )
}


function mapStateToProps(state) {
    return {
        
    }
}
const mapDispatchToProps = dispatch => (
    bindActionCreators({
      setPaymentModuleType
    }, dispatch)
  );

export default connect(mapStateToProps, mapDispatchToProps) (SearchTheScriptureScreen);

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
    bottomSection: {
      borderTopColor: '#000000',
      borderTopWidth: 0.5,
      width: width,
      alignItems: 'center',
      paddingVertical: 20,
      position:'absolute',
      top:height-200,
      backgroundColor:'#ffffff'
    },
    centerSection:{
      borderTopColor: '#000000',
      borderTopWidth: 0.5,
      width: width,
      alignItems: 'center',
      paddingVertical: 20,
      position:'absolute',
      top:height-200,
      backgroundColor:'#ffffff',
      zIndex:99999
    },
    bottomIconContainer: {
      flexDirection: 'row',
      //justifyContent: 'space-between',
      width: '80%',
      marginLeft:-50
    },
    donateButton:{
      height: Platform.isPad === true ? wp('6%') : wp('11%'),
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
      shadowColor: 'rgba(0,0,0, .4)',
      shadowOffset: { height: 1, width: 1 },
      shadowOpacity: 1,
      shadowRadius: 1,
      elevation: 2
    },
    buttonText: {
      fontFamily: Fonts.Font_Bold,
      color:'#fff',
      fontSize: Platform.isPad === true ? wp('2.5%') : wp('3.5%'),
    },
});
const styles1 = StyleSheet.create({
    containerStyle: {
       // flex: 1,
        
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
        overflow:'scroll',
        marginBottom: 15,
        zIndex:99999999999999999
      }
  });