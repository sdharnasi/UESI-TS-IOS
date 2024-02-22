import React, { useEffect, useState,useCallback } from 'react';
import { View, Text,SafeAreaView, ScrollView, StyleSheet,FlatList,Dimensions, TouchableOpacity,ActivityIndicator} from 'react-native';
import {DataTable, Divider} from  "react-native-paper";
import { useFocusEffect } from '@react-navigation/native';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { selectSong,setSongType,setSongs } from '@actions';
const { width, height } = Dimensions.get('screen');
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-community/async-storage';
import getApi from "@apis/getApi";
import TrackPlayer, {
  Capability,
  Event,
  RepeatMode,
  State,
  usePlaybackState,
  useProgress,
  useTrackPlayerEvents,
} from 'react-native-track-player';

const NewSongsScreen = (props) => { 
    const [toastMessage, setToastMessage] = useState('');  
    const [songsList, setSongsList] = useState([]); 
    const [filteredSongsList, setFilteredSongsList] = useState([]); 
    const [songIndexData, setSongIndexData] = useState([]); 

    useFocusEffect(
      useCallback(() => {
        async function fetchData() {
          await AsyncStorage.getItem('TOTAL_SONGS').then(data=>{
            if(data){
              let allSongs = JSON.parse(data);
              let songsData = allSongs[3].song_json;
              songsData = songsData.replaceAll('\"','"');
              songsData = songsData.replaceAll('"[','[');
              songsData = songsData.replaceAll(']"',']');
              props.setSongs(JSON.parse(songsData));
              setSongsList(JSON.parse(songsData));
              teluguSongIndex(JSON.parse(songsData));
            }
          });
        }
        fetchData();
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
    
    const searchSong = () => {
      props.setSongType('new');
      props.navigation.navigate('SongSearchScreen');  
    }

    const openSongPage = (song)=> {
      props.selectSong(song);
      props.setSongType('new');
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
        <View>
      <ScrollView style={{marginBottom:30}}>
          <FlatList style={{paddingBottom:50}}
            data={filteredSongsList}
            renderItem={({item}) => 
            <View>
                    <View style={{display:'flex', flexDirection:'row'}}>
                    <Text style={styles.item} onPress={()=>openSongPage(item)}>{item.local_id+". "+ item.local_title}
                    </Text>
                    {item.song[0].url!==''?<Ionicons style={{position:'absolute',right:15,top:15}} name='musical-notes' size={20} color="#000000" />:''}
                    </View>
                  <Divider style={{ backgroundColor: '#5b5c5c' }} />
            </View>}
          />
      </ScrollView>
      </View>
      
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
export default connect(mapStateToProps, mapDispatchToProps) (NewSongsScreen);

const styles = StyleSheet.create({
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