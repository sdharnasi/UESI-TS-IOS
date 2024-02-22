import React, { useEffect, useState,useCallback } from 'react';
import { View, Text,SafeAreaView, ScrollView, StyleSheet,FlatList,Dimensions, TouchableOpacity,ActivityIndicator, Platform} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Fonts from '../helpers/Fonts';
import { useFocusEffect } from '@react-navigation/native';
import {DataTable, Divider,Button,Card,Avatar} from  "react-native-paper";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { selectSong,setSongType,setSongs,setSongsDonated,setTriconType, setPaymentModuleType } from '@actions';
const { width, height } = Dimensions.get('screen');
//import Icon from 'react-native-ionicons';
import AsyncStorage from '@react-native-community/async-storage';
import getApi from "@apis/getApi";
import { GlobalStyles, Colors, isValidEmail, isValidMobile, } from '@helpers'
import {
  OtrixContainer, OtrixHeader, OtrixContent, OtrixDivider, OtrixAlert, OtrixLoader
} from '@component';
const LeftContent = props => <Avatar.Icon {...props} icon="folder" />
const TeachingTrainingScreen = (props) => { 
  const [formData, setData] = React.useState({ type:null, firstName: null, lastName: null, email: null, mobileNumber: null, password: null, cpassword: null, submited: false, type: null, message: null, loading: false });
    const [songsList, setSongsList] = useState([]); 
    const [showLoader,setShowLoader]=useState(true);
    const [custmerData,setCustmerData] = React.useState(null);
    const [userAccess,setUserAccess] = React.useState(null);
    const [triconType1,setTriconType1] = React.useState(null);
    const [songIndexData, setSongIndexData] = useState([]); 
    const [filteredSongsList, setFilteredSongsList] = useState([]); 
    //const [songsDonated, setSongsDonated] = useState('false');
    
    useFocusEffect(
      useCallback(() => {
        
      //   const { triconType } = props.route.params;
      //   setTriconType1(triconType);
      //   async function getCustomerData() {
      //     await AsyncStorage.getItem("CUSTOMER_DATA").then(data=>{
      //         setCustmerData(JSON.parse(data));
      //         getUserAccess();
      //     });
      // }
    //   async function getUserAccess() {
    //     await AsyncStorage.getItem("USER_ACCESS").then(data=>{
    //       setUserAccess(JSON.parse(data));
    //         callAPI(triconType,JSON.parse(data));
    //     });
    // }
    //   getCustomerData();
    

    

        async function callAPI() {
          let sendData = new FormData();
            sendData.append('type', 'dfd-programs');
          try {
            setShowLoader(true);
           getApi.postData(
               "user/getTeachingTrainingVideos",
               sendData
           ).then(( async response => {
            
            setShowLoader(false);
               if(response.status === 1){
                setSongsList(response.data);
                teluguSongIndex(response.data);
               }
           })).error(() => {
            setShowLoader(false);
           });
       } catch (error) {
        setShowLoader(false);
         console.log(error);
       }
       }
       callAPI();
      }, [])
    )
    useEffect(() => {
    }, [props.navigation]);


    const teluguSongIndex = (videos) => {
      
      let teluguSongIndexData = [];
      videos.map((data, index) => {
      let i = teluguSongIndexData.findIndex(type=> type === data.type);
      if(i===-1){
        teluguSongIndexData.push(data.type);
      }
      if(index===videos.length-1){
        setSongIndexData(teluguSongIndexData);
        indexClicked(videos,videos[0].type);
      }
    });
    
  
}

    const indexClicked = (videos,value) => {
      let filteredList = [];
      videos.map((data, index) => {
        if(data && data.type === value){
          filteredList.push(data);
        }
        if(index === videos.length-1){
          setFilteredSongsList(filteredList);
        }
    });
 }
    const openSongRegistrationPage = () => {
      props.setPaymentModuleType('tricon_2023');
       //props.navigation.navigate('PaymentScreen');  
       if(custmerData){
        props.navigation.navigate('PaymentScreen',{paymentModuleType:'tricon_2023'});
      }else{
        props.navigation.push("LoginScreen",{paymentModuleType:'tricon_2023'});
      }
       //props.navigation.navigate('SongRegisterScreen');
       
 
     }

    const displayLoader = () => {
      return (
        <>
        <View style={styles.centerSection}>
          <View style={styles.bottomIconContainer}>
          <ActivityIndicator animating={true} color='black' />
           <Text style={{color:'#000000',marginLeft:10}}>{toastMessage} </Text>
            </View>
            </View>
            </>
      );
    };
    const showPaymentButton = () => {
      return (
        <>
        <View style={styles.bottomSection}>
          <View style={styles.bottomIconContainer}>
          <OtrixContent>
            <Button style={{marginTop:-10}} onPress={() => openSongRegistrationPage()}>
                      <Text style={styles.buttonText}>Get all Videos</Text>
            </Button>
          </OtrixContent>
            </View>
            </View>
            <OtrixDivider size={'md'} />
            </>
      );
    };

    const openSongPage = (video)=> {
      props.navigation.navigate('VideoPlayerScreen',{
        selectedVideo: video
      });
    }

  return (
    <>
    <SafeAreaView style={{backgroundColor:'#fff',height:'100%'}}>
      <View>
        {(songIndexData.length>0)?<ScrollView horizontal>
            <View style={{marginLeft:-20}}>
            <DataTable style={styles.table} >
                <DataTable.Header>
                {songIndexData.map((data, index) => {
                    return <DataTable.Title key={index} style={styles.header} onPress={ () => indexClicked(songsList,data) }> <Text style={styles.tableHeading}>{data}</Text></DataTable.Title>
                })}
                </DataTable.Header>
            </DataTable>
            </View>
        </ScrollView>:null}
        </View>
    {showLoader?<View style={{width: '100%',
              height: '85%',
              position: 'absolute',
              justifyContent: 'center',
              alignItems: 'center',zIndex:99999}}>
          <ActivityIndicator size="large" color={Colors().themeColor} />
        </View>:null}

        {!showLoader && songsList.length==0?<View style={{width: '100%',
              height: '85%',
              position: 'absolute',
              justifyContent: 'center',
              alignItems: 'center',zIndex:99999}}>
          <Text>No data Found</Text>
        </View>:null}

        <View>
      <ScrollView style={{marginBottom:30}}>
          <FlatList style={{paddingBottom:50}}
            data={filteredSongsList}
            renderItem={({item}) => 
            <View style={{padding:10}}>
                    <Card mode="contained" onPress={()=>openSongPage(item)}>
                      <Card.Cover source={{ uri: item.thumb_url }} />
                      <Text style={{paddingTop:5, paddingLeft:5,color:'#000', fontFamily:Fonts.Font_Medium, fontSize:15}}>{item.small_description}</Text>
                    </Card>
                  <Divider style={{ backgroundColor: '#5b5c5c' }} />
            </View>}
          />
      </ScrollView>
      {/* {userAccess && userAccess.tricon_2023==1?null:showPaymentButton()} */}
      </View>
    </SafeAreaView>
    </>
    
  )
}

function mapStateToProps(state) {
  return {
      selectedSong: state.song.selectedSong,
      songType: state.song.songType,
      songsDonated: state.song.songsDonated,
      triconType: state.song.triconType,
      paymentModuleType: state.song.paymentModuleType
  }
}

const mapDispatchToProps = dispatch => (
  bindActionCreators({
      selectSong,
      setSongs,
      setSongType,
      setSongsDonated,
      setTriconType,
      setPaymentModuleType
  }, dispatch)
);
export default connect(mapStateToProps, mapDispatchToProps) (TeachingTrainingScreen);

const styles = StyleSheet.create({
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
    color: Colors().themeColor,
    fontSize: Platform.isPad === true ? wp('2.5%') : wp('3.5%'),
  },
    table:{
        backgroundColor: Colors().themeColor,
        color:'white',
        height:45
    },
    headSection:{
        borderBottomWidth:2,
        borderColor:'black',
        paddingBottom:15,
        
    },
    titleHeading:{
        marginTop:50,
        fontWeight:'bold',
        marginHorizontal:167,
    },
    tableHeading:{
        fontWeight:'400',
        color:'white',
        fontSize:18,
        //textTransform:'capitalize'
    },
    header:{
        padding:15,
        borderColor: 'white',
        borderLeftWidth: 1,
        borderBottomWidth: 1,
        borderTopWidth: 1,
        borderRightWidth: 1
    },
      item: {
        flex:1,
        paddingLeft: 12,
        paddingTop: 10,
        paddingBottom: 10,
        paddingRight: 12,
        fontSize: 18,
        color:'black',
        width:width,
        //fontFamily:'suranna'
      }
      
});