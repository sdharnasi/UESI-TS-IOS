import React, { useEffect, useState,useCallback } from 'react';
import { View, Text,SafeAreaView, ScrollView, StyleSheet,FlatList,Dimensions, TouchableOpacity,ActivityIndicator, Platform} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Fonts from '../helpers/Fonts';
import { useFocusEffect } from '@react-navigation/native';
import {DataTable, Divider,Button} from  "react-native-paper";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { selectSong,setSongType,setSongs,setSongsDonated, setPaymentModuleType } from '@actions';
const { width, height } = Dimensions.get('screen');
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-community/async-storage';
import getApi from "@apis/getApi";
import { GlobalStyles, Colors, isValidEmail, isValidMobile, } from '@helpers'
import {
  OtrixContainer, OtrixHeader, OtrixContent, OtrixDivider, OtrixAlert, OtrixLoader
} from '@component';
import TrackPlayer, {
  Capability,
  Event,
  RepeatMode,
  State,
  usePlaybackState,
  useProgress,
  useTrackPlayerEvents,
} from 'react-native-track-player';
const speacialIData = [
  {"id":"1",color:Colors().themeColor,type:'evangelism',label:'Evangelism'},
  {"id":"2",color:Colors().themeColor,type:'fellowship',label:'Fellowship'},
  {"id":"3",color:Colors().themeColor,type:'testimony',label:'Testimony'},
  {"id":"4",color:Colors().themeColor,type:'missions',label:'Missions'},
  {"id":"5",color:Colors().themeColor,type:'praise',label:'Praise & Worship'},
  {"id":"6",color:Colors().themeColor,type:'prayer',label:'Prayer'},
  {"id":"7",color:Colors().themeColor,type:'spiritual',label:'Spritual Reflection'},
  {"id":"8",color:Colors().themeColor,type:'christmas',label:'Christmas'},
  {"id":"9",color:Colors().themeColor,type:'ecamp',label:'E Camp'},
  {"id":"10",color:Colors().themeColor,type:'dtcamp',label:'DT Camp'},
  {"id":"11",color:Colors().themeColor,type:'ltcamp',label:'LT Camp'}
];
const TeluguSongsScreen = (props) => { 
    const [toastMessage, setToastMessage] = useState('');  
    const [songsList, setSongsList] = useState([]); 
    const [filteredSongsList, setFilteredSongsList] = useState([]); 
    const [songIndexData, setSongIndexData] = useState([]); 
    const [custmerData,setCustmerData] = React.useState(null);
    const [userAccess,setUserAccess] = React.useState(null);
    const [showSpecialIndex,setShowSpecialIndex] = React.useState(false);
    const [bgColor,setBgColor] = React.useState(Colors().themeColor);
    const [specialIndexData, setSpecialIndexData] = useState(speacialIData); 

    useFocusEffect(
      useCallback(() => {
        async function getCustomerData() {
          await AsyncStorage.getItem("CUSTOMER_DATA").then(data=>{
              setCustmerData(JSON.parse(data));
          });
      }
      getCustomerData();

      async function getUserAccess() {
        await AsyncStorage.getItem("USER_ACCESS").then(data=>{
          setUserAccess(JSON.parse(data));
          let useraccess = JSON.parse(data);
           if(useraccess && useraccess.song_book =='1'){
             props.songsDonated = '1';
             fetchData(data);
           }else{
            fetchData('');
           }
        });
    }
    getUserAccess();


        async function checkSongsUpdate() {
          setToastMessage('');
            getApi.getData(  //getManufacturers
                "getSongsUpdate",
                [],
            ).then( async response => {
                if(response.status === 1){
                  await AsyncStorage.getItem('SONG_UPDATE_VERSION').then(data=>{
                    if(Number(data) !== Number(response.data[0].version)){
                      AsyncStorage.setItem('SONG_UPDATE_VERSION',''+response.data[0].version);
                      //AsyncStorage.removeItem('songsAdded');
                       callAPI();
                    }
                  });
                }
            });
        }
        
        // async function checkSongsDonated() {
        //   await AsyncStorage.getItem('songs_donated').then(data=>{
        //     if(data){
        //       fetchData(data); 
        //       props.setSongsDonated(data);
        //     }else{
        //       fetchData(''); 
        //     }
        //   });
        // }
        async function fetchData(songs_donated) {
          await AsyncStorage.getItem('TOTAL_SONGS').then(data=>{
            if(data){
              let allSongs = JSON.parse(data);
              let songsData = allSongs[0].song_json;
              songsData = songsData.replaceAll('\"','"');
              songsData = songsData.replaceAll('"[','[');
              songsData = songsData.replaceAll(']"',']');
              if(songs_donated==''){
                let songs = JSON.parse(songsData);
                let limitedSongs = [];
                let count = 0;
                songs.map((song,index)=>{
                  if(count<20 && song.song[0].url!=''){
                    count++;
                    limitedSongs.push(song);
                  }
                });
                props.setSongs(limitedSongs);
                setSongsList(limitedSongs);
                //teluguSongIndex(limitedSongs);
                setFilteredSongsList(limitedSongs);
              }else{
                props.setSongs(JSON.parse(songsData));
                setSongsList(JSON.parse(songsData));
                teluguSongIndex(JSON.parse(songsData));
                checkSongsUpdate();
              }
            }else{
              AsyncStorage.setItem('SONG_UPDATE_VERSION','1');
              callAPI(songs_donated);
            }
          });
        }
        async function callAPI(songs_donated) {
           try {
            setToastMessage('Songs Loading, Wait a minute...');
            getApi.getData(
                "getSongs",
                [],
            ).then(( async response => {
                if(response.status === 1){
                  setToastMessage('Songs loaded successfully');
                  setTimeout(()=>{
                    setToastMessage('');
                  },2000);
                  await AsyncStorage.setItem('TOTAL_SONGS', JSON.stringify(response.data));
                  let songsData = response.data[0].song_json;
                  songsData = songsData.replaceAll('\"','"');
                  songsData = songsData.replaceAll('"[','[');
                  songsData = songsData.replaceAll(']"',']');
                  if(songs_donated===''){
                    let songs = JSON.parse(songsData);
                    let limitedSongs = [];
                    let count = 0;
                    songs.map((song,index)=>{
                      if(count<20 && song.song[0].url!=''){
                        count++;
                        limitedSongs.push(song);
                      }
                    });
                    setSongsList(limitedSongs);
                    //teluguSongIndex(limitedSongs);
                    setFilteredSongsList(limitedSongs);
                  }else{
                    setSongsList(JSON.parse(songsData));
                    teluguSongIndex(JSON.parse(songsData));
                  }
                }else{
                  setToastMessage('Songs loading failed');
                }
            }));
        } catch (error) {
          console.log(error);
        }
        }
        //checkSongsDonated();
        
      }, [])
    )

    useEffect(() => {
      props.navigation.setOptions({
        headerRight: () => (
          <>
          <TouchableOpacity style={[{ flex: 0, marginRight:20 }]} onPress={() => searchSong()}>
              <Icon name='search' size={25} color="#ffffff" />
          </TouchableOpacity>
            </>
        ),
      });
      

    }, [props.navigation]);

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
                      <Text style={styles.buttonText}>Donate for all songs</Text>
            </Button>
          </OtrixContent>
            </View>
            </View>
            </>
      );
    };

    
    const searchSong = () => {
      props.setSongType('telugu');
      
      props.navigation.navigate('SongSearchScreen');  
    }

    const openSongRegistrationPage = () => {
     props.setPaymentModuleType('song_book');
      //props.navigation.navigate('PaymentScreen');  
       
      //
      //props.setPaymentModuleType('song_book');

      if(custmerData){
        props.navigation.navigate('PaymentScreen',{paymentModuleType:'song_book'});
      }else{
        props.navigation.push("LoginScreen",{paymentModuleType:'song_book'});
        //props.navigation.navigate('PaymentScreen',{paymentModuleType:'song_book'});
      }
      
      //props.navigation.navigate('SongRegisterScreen');
      

    }

    const openSongPage = (song)=> {
      props.selectSong(song);
      props.setSongType('telugu');
      try{
        TrackPlayer.reset();
     }catch(error){
        console.log(error);
     }
      props.navigation.navigate('Home');
    }

    const indexClicked = (songs,value,songIData) => {
        setShowSpecialIndex(false);
        setBgColor(Colors().themeColor);
        let filteredList = [];
        songs.map((data, index) => {
          if(data && data.index_letter === value){
            filteredList.push(data);
          }
          if(index === songs.length-1){
            setFilteredSongsList(filteredList);
          }
      });
      songIData.map((data, index) => {
        if(data.label === value){
          data.color = Colors().tabHeilightColor;
        }else{
          data.color = Colors().themeColor;
        }
        if(index === songIData.length-1){
          setSongIndexData(songIData);
        }
      });

   }

    const specialIndexClicked = () => {
      setShowSpecialIndex(!showSpecialIndex);
        if(!showSpecialIndex){
          setBgColor(Colors().tabHeilightColor);
        }else{
          setBgColor(Colors().themeColor);
        }
        specialIndexItemClicked(songsList,specialIndexData[0],specialIndexData);
        songIndexData.map((data, index) => {
          data.color = Colors().themeColor;
          if(index === songIndexData.length-1){
            setSongIndexData(songIndexData);
          }
        });
   }
   const specialIndexItemClicked = (songs,siItemdata,sidata) => {
        let filteredList = [];
        songs.map((data, index) => {
          let i = data.local_category.findIndex(cat=>cat===siItemdata.type);
          if(i>-1){
            filteredList.push(data);
          }
          if(index === songs.length-1){
            setFilteredSongsList(filteredList);
          }
      });
      sidata.map((data, index) => {
         if(data.id === siItemdata.id){
          data.color = Colors().tabHeilightColor;
         }else{
          data.color = Colors().themeColor;
         }
         if(index === sidata.length-1){
          setSpecialIndexData(sidata);
        }
      });

      
   }
    const teluguSongIndex = (songs) => {
      if(songs.length>20){
        let teluguSongIndexData = [];
        songs.map((data, index) => {
        let i = teluguSongIndexData.findIndex(song=> song.label === data.index_letter);
        if(i===-1){
          teluguSongIndexData.push({'color':Colors().themeColor,'label':data.index_letter});
        }
        if(index===songs.length-1){
          teluguSongIndexData[0].color = Colors().tabHeilightColor;
          setSongIndexData(teluguSongIndexData);
          indexClicked(songs,teluguSongIndexData[0].label,teluguSongIndexData);
        }
      });
      
    }
  }

  return (
    <>
    <SafeAreaView style={{backgroundColor:'#fff',height:'100%'}}>
        <View>
        <View>
        {(songIndexData.length>0 && songsList.length>20)?<ScrollView horizontal>
            <View style={{marginLeft:-20}}>
            <DataTable style={styles.table} >
            

                <DataTable.Header>
                <DataTable.Title key="200" style={[styles.header, { backgroundColor: bgColor }]} onPress={ () => specialIndexClicked() }> <Text style={styles.tableHeading}>Special Index</Text></DataTable.Title>
                {songIndexData.map((data, index) => {
                    return <DataTable.Title key={index} style={[styles.header, { backgroundColor: data.color }]} onPress={ () => indexClicked(songsList,data.label,songIndexData) }> <Text style={styles.tableHeading}>{data.label}</Text></DataTable.Title>
                })}
                </DataTable.Header>
            </DataTable>
            </View>
        </ScrollView>:null}
       </View>
       <View>
        {(specialIndexData.length>0 && showSpecialIndex)?<ScrollView horizontal>
            <View style={{marginLeft:-20}}>
            <DataTable style={styles.table} >
                <DataTable.Header>
                {specialIndexData.map((data, index) => {
                    return <DataTable.Title key={index} style={[styles.header, { backgroundColor: data.color }]} onPress={ () => specialIndexItemClicked(songsList,data,specialIndexData) }> <Text style={styles.tableHeading}>{data.label}</Text></DataTable.Title>
                })}
                </DataTable.Header>
            </DataTable>
            </View>
        </ScrollView>:null}
       </View>
      <ScrollView style={{marginBottom:30}}>
          <FlatList style={{paddingBottom:50}}
            data={filteredSongsList}
            renderItem={({item}) => 
            <View>
                    <View style={{display:'flex', flexDirection:'row'}}>
                    <Text style={styles.item} onPress={()=>openSongPage(item)}>{item.local_id+". "+ item.local_title}
                    </Text>
                    {item.song[0].url!==''?<Icon style={{position:'absolute',right:15,top:15}} name='musical-notes' size={20} color="#000000" />:''}
                    </View>
                  <Divider style={{ backgroundColor: '#5b5c5c' }} />
            </View>}
          />
      </ScrollView>
      {toastMessage!==''?displayLoader():null}
      {!(userAccess && userAccess?.song_book=='1')?showPaymentButton():null}
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
      paymentModuleType: state.song.paymentModuleType
  }
}

const mapDispatchToProps = dispatch => (
  bindActionCreators({
      selectSong,
      setSongs,
      setSongType,
      setSongsDonated,
      setPaymentModuleType
  }, dispatch)
);
export default connect(mapStateToProps, mapDispatchToProps) (TeluguSongsScreen);

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
        //fontWeight:'bold',
        color:'white',
        fontSize:18
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