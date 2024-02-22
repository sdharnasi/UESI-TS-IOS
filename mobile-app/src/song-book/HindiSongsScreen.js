import React, { useEffect, useState,useCallback } from 'react';
import { View, Text,SafeAreaView, ScrollView, StyleSheet,FlatList,Dimensions, TouchableOpacity,ActivityIndicator} from 'react-native';
import {DataTable, Divider} from  "react-native-paper";
import { useFocusEffect } from '@react-navigation/native';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { selectSong,setSongType,setSongs } from '@actions';
import Fonts from "@helpers/Fonts";
const { width, height } = Dimensions.get('screen');
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-community/async-storage';
import getApi from "@apis/getApi";
import { Colors } from './../helpers';
import TrackPlayer, {
  Capability,
  Event,
  RepeatMode,
  State,
  usePlaybackState,
  useProgress,
  useTrackPlayerEvents,
} from 'react-native-track-player';

const HindiSongsScreen = (props) => { 
    const [toastMessage, setToastMessage] = useState('');  
    const [songsList, setSongsList] = useState([]); 
    const [filteredSongsList, setFilteredSongsList] = useState([]); 
    const [songIndexData, setSongIndexData] = useState([]); 
    const [custmerData,setCustmerData] = React.useState(null);
    const [userAccess,setUserAccess] = React.useState(null);
  
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
          console.log(useraccess);
           if(useraccess && useraccess.song_book =='1'){
             props.songsDonated = '1';
             fetchData(data);
           }else{
            fetchData('');
           }
        });
    }
    getUserAccess();
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
              let songsData = allSongs[2].song_json;
              songsData = songsData.replaceAll('\"','"');
              songsData = songsData.replaceAll('"[','[');
              songsData = songsData.replaceAll(']"',']');
              if(songs_donated==''){
                let songs = JSON.parse(songsData);
                let limitedSongs = [];
                let count = 0;
                songs.map((song,index)=>{
                  if(count<20){
                    count++;
                    limitedSongs.push(song);
                  }
                });
                props.setSongs(limitedSongs);
                setSongsList(limitedSongs);
                setFilteredSongsList(limitedSongs);
              }else{
                props.setSongs(JSON.parse(songsData));
                setSongsList(JSON.parse(songsData));
                teluguSongIndex(JSON.parse(songsData));
              }
            }
          });
        }
        //checkSongsDonated();
      }, [])
      )
    useEffect(() => {
      props.navigation.setOptions({
        headerRight: () => (
          <>
          <TouchableOpacity style={[{ flex: 0, marginRight:20 }]} onPress={() => searchSong()}>
              <Ionicons name='search-sharp' size={25} color="#ffffff" />
          </TouchableOpacity>
            </>
        ),
      });

      

    }, [props.navigation]);

    const displayLoader = () => {
      return (
        <>
        <View style={styles.bottomSection}>
          <View style={styles.bottomIconContainer}>
          <ActivityIndicator animating={true} color='black' />
           <Text style={{color:'#000000',marginLeft:10}}>{toastMessage} </Text>
            </View>
            </View>
            </>
      );
    };

    
    const searchSong = () => {
      props.setSongType('hindi');
      props.navigation.navigate('SongSearchScreen');  
    }

    const openSongPage = (song)=> {
      props.selectSong(song);
      props.setSongType('hindi');
      try{
        TrackPlayer.reset();
     }catch(error){
        console.log(error);
     }
      props.navigation.navigate('Home');
    }

    const indexClicked = (songs,value) => {
        let filteredList = [];
        songs.map((data, index) => {
          if(data && data.index_letter === value){
            filteredList.push(data);
          }
          if(index === songs.length-1){
            setFilteredSongsList(filteredList);
          }
      });
   }
    const teluguSongIndex = (songs) => {
      if(songs.length>100){
        let teluguSongIndexData = [];
        songs.map((data, index) => {
        let i = teluguSongIndexData.findIndex(song=> song === data.index_letter);
        if(i===-1){
          teluguSongIndexData.push(data.index_letter);
        }
        if(index===songs.length-1){
          setSongIndexData(teluguSongIndexData);
          indexClicked(songs,songs[0].index_letter);
        }
      });
    }else{
      setFilteredSongsList(songs);
    }
  }

  return (
    <>
    <SafeAreaView style={{backgroundColor:'#fff',height:'100%'}}>
        
        {songIndexData.length>0?<ScrollView horizontal>
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
       
      <ScrollView>
        <View>
        <Divider style={{ backgroundColor: '#5b5c5c' }} />
        <Text style={{textAlign: 'left'}}>
      
          { <View style={styles.container}>
                        <FlatList style={{paddingBottom:50}}
                          data={filteredSongsList}
                          renderItem={({item}) => 
                          <View>
                                  <View style={{display:'flex', flexDirection:'row'}}>
                                  <Text style={styles.item} onPress={()=>openSongPage(item)}>{item.local_id+". "+ item.local_title}
                                  </Text>
                                  {item.song[0].url!==''?<Ionicons style={{position:'absolute',right:5,top:15}} name='musical-notes' size={20} color="#000000" />:''}
                                  </View>
                                <Divider style={{ backgroundColor: '#5b5c5c' }} />
                          </View>}
                        />
                      </View>}
                      
          </Text>
        </View>  
      </ScrollView>
      {toastMessage!==''?displayLoader():null}
    </SafeAreaView>
    </>
    
  )
}

function mapStateToProps(state) {
  return {
      selectedSong: state.song.selectedSong,
      songType: state.song.songType
  }
}

const mapDispatchToProps = dispatch => (
  bindActionCreators({
      selectSong,
      setSongType,
      setSongs
  }, dispatch)
);
export default connect(mapStateToProps, mapDispatchToProps) (HindiSongsScreen);

const styles = StyleSheet.create({
  bottomSection: {
    borderTopColor: '#000000',
    borderTopWidth: 0.5,
    width: width,
    alignItems: 'center',
    paddingVertical: 15,
    position:'absolute',
    top:height-180,
    backgroundColor:'#ffffff'
  },
  bottomIconContainer: {
    flexDirection: 'row',
    //justifyContent: 'space-between',
    width: '80%',
    marginLeft:-50
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
        padding:10,
        borderColor: 'white',
        borderLeftWidth: 1,
        borderBottomWidth: 1,
        borderTopWidth: 1,
        borderRightWidth: 1
    },
    container: {
        paddingTop: 12
      },
      item: {
        flex:1,
        padding: 12,
        fontSize: 17,
        color:'black',
        width:width,
        fontFamily: Fonts.Font_Reguler
      }
      
});