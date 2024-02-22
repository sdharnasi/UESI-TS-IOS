import React, { useEffect, useState,useCallback } from 'react'
import { View, Text,SafeAreaView, ScrollView, StyleSheet,FlatList,Dimensions,Keyboard,Image,TouchableOpacity} from 'react-native';
//import { Button, DataTable, Divider,Searchbar,TextInput } from  "react-native-paper";
const { width,height } = Dimensions.get('screen');
import Ionicons from 'react-native-vector-icons/Ionicons';
import TrackPlayer, {
  Capability,
  Event,
  RepeatMode,
  State,
  usePlaybackState,
  useProgress,
  useTrackPlayerEvents,
} from 'react-native-track-player';
import { bindActionCreators } from "redux";
import { selectSong,setSongType,setSongsDonated } from '@actions';
import { connect } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import Slider from '@react-native-community/slider';
import Fonts from "@helpers/Fonts";
import AsyncStorage from '@react-native-community/async-storage';
import {DataTable, Divider,Button} from  "react-native-paper";
import { Colors } from './../helpers';

const teluguSongIndexList =  require('../common/telugu-song-index-list.json');
const englishSongIndexList =  require('../common/english-song-index-list.json');
const hindiSongIndexList =  require('../common/hindi-song-index-list.json');
const newSongIndexList =  require('../common/new-song-index-list.json');

const PlaylistScreen = (props) => {  
  const [search, setSearch] = useState('');
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [masterDataSource, setMasterDataSource] = useState([]);
  const [keyboardStatus, setKeyboardStatus] = useState('');
  const [teluguSongsList, setTeluguSongsList] = useState([]);
  const [englishSongsList, setEnglishSongsList] = useState([]);
  const [hindiSongsList, setHindiSongsList] = useState([]);
  const [newSongsList, setNewSongsList] = useState([]);
  const [filteredSongsList, setFilteredSongsList] = useState([]);
  const [selectedPlayList, setSelectedPlayList] = useState('');
  const playBackState = usePlaybackState();
  const progress = useProgress();
  const [userAccess,setUserAccess] = React.useState(null);

  let playlist = [];
  //let navigation = props.navigation;

  useFocusEffect(
    useCallback(() => {

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

      async function getUserAccess() {
        try{
          await AsyncStorage.getItem("USER_ACCESS").then(data=>{
            setUserAccess(JSON.parse(data));
            let useraccess = JSON.parse(data);
            
            if(useraccess && useraccess.song_book && useraccess.song_book==1){
               fetchData('1');
             }else{
              fetchData('');
             }
          });
        }catch(error){
            console.log(error);
        }
        
    }
    getUserAccess();

      async function fetchData(songs_donated) {
        try{
            await AsyncStorage.getItem('TOTAL_SONGS').then(data=>{
            if(data){
              let allSongs = JSON.parse(data);
              let TeluguSongsData = allSongs[0].song_json;
              TeluguSongsData = TeluguSongsData.replaceAll('\"','"');
              TeluguSongsData = TeluguSongsData.replaceAll('"[','[');
              TeluguSongsData = TeluguSongsData.replaceAll(']"',']');
              let TeluguSongs = JSON.parse(TeluguSongsData);
              let teluguPlayList = [];  
              let count = 0;  
              TeluguSongs?.map((song_json,index)=>{
                if(songs_donated==''){
                  if(count<20 && song_json.song[0].url!=''){
                    count++;
                    teluguPlayList.push(song_json);
                  }
                }else{
                  if(song_json.song[0].url !==''){
                    teluguPlayList.push(song_json);
                  }
                }
                if(index === TeluguSongs.length-1){
                  setTeluguSongsList(teluguPlayList);
                }
              });
            
              

              let EnglishSongsData = allSongs[1].song_json;
              EnglishSongsData = EnglishSongsData.replaceAll('\"','"');
              EnglishSongsData = EnglishSongsData.replaceAll('"[','[');
              EnglishSongsData = EnglishSongsData.replaceAll(']"',']');
              let englishSongs = JSON.parse(EnglishSongsData);
              let englishPlayList = [];   
              count = 0;   
              englishSongs?.map((song_json,index)=>{

                if(songs_donated===''){
                  if(count<20 && song_json.song[0].url!=''){
                    count++;
                    englishPlayList.push(song_json);
                  }
                }else{
                  if(song_json.song[0].url !==''){
                    englishPlayList.push(song_json);
                  }
                }
                if(index === englishSongs.length-1){
                  setEnglishSongsList(englishPlayList);
                }

                  // if(song_json.song[0].url !==''){
                  //   englishPlayList.push(song_json);
                  // }
                  // if(index === englishSongs.length-1){
                  //   setEnglishSongsList(englishPlayList);
                  // }
              });

              

              let HindiSongsData = allSongs[2].song_json;
              HindiSongsData = HindiSongsData.replaceAll('\"','"');
              HindiSongsData = HindiSongsData.replaceAll('"[','[');
              HindiSongsData = HindiSongsData.replaceAll(']"',']');

              let hindiSongs = JSON.parse(HindiSongsData);
              let hindiPlayList = [];   
              count = 0; 
              hindiSongs?.map((song_json,index)=>{
                
                if(songs_donated===''){
                  if(count<20 && song_json.song[0].url!=''){
                    count++;
                    hindiPlayList.push(song_json);
                  }
                }else{
                  if(song_json.song[0].url !==''){
                    hindiPlayList.push(song_json);
                  }
                }


                  // if(song_json.song[0].url !==''){
                  //   hindiPlayList.push(song_json);
                  // }
                  if(index === hindiSongs.length-1){
                    setHindiSongsList(hindiPlayList);
                  }
              });

              

              let NewSongsData = allSongs[3].song_json;
              NewSongsData = NewSongsData.replaceAll('\"','"');
              NewSongsData = NewSongsData.replaceAll('"[','[');
              NewSongsData = NewSongsData.replaceAll(']"',']');
              
              let newSongs = JSON.parse(NewSongsData);
              let newPlayList = [];  
              count = 0;  
              newSongs?.map((song_json,index)=>{
                  // if(song_json.song[0].url !==''){
                  //   newPlayList.push(song_json);
                  // }
                  if(songs_donated===''){
                    if(count<20 && song_json.song[0].url!=''){
                      count++;
                      newPlayList.push(song_json);
                    }
                  }else{
                    if(song_json.song[0].url !==''){
                      newPlayList.push(song_json);
                    }
                  }
                  if(index === newSongs.length-1){
                    setNewSongsList(newPlayList);
                  }
              });
              indexClicked(teluguPlayList,'telugu');
              
              
            //   playlist = [];
            //   allSongs.map((data,index)=>{
            //       data.song_json = data.song_json.replaceAll('\"','"');
            //       data.song_json = data.song_json.replaceAll('"[','[');
            //       data.song_json = data.song_json.replaceAll(']"',']');
            //       let songJson = JSON.parse(data.song_json);                  
            //       songJson?.map((song_json,index1)=>{
            //           if(song_json.song[0].url !==''){
            //             playlist.push(song_json);
            //           }
            //       });
            //       if(index === allSongs.length-1){
            //         setTeluguSongsList(playlist);
            //       }
            // });
          }
        });
        } catch (error) {
            console.log(error);
        }
      }
      //checkSongsDonated();
    }, [])
  )

  useEffect(() => { 

        setFilteredDataSource(props.selectedSongsList);
        const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
          setKeyboardStatus('Keyboard Shown');
        });
        const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
          setKeyboardStatus('Keyboard Hidden');
        });
    
        return () => {
          showSubscription.remove();
          hideSubscription.remove();
        };
      
  }, [props.navigation]);

  const togglePlayBack = async playBackState => {
    try {
        const currentTrack = await TrackPlayer.getCurrentTrack();
        if (currentTrack != null) {
            if (playBackState == State.Paused) {
                await TrackPlayer.play();
            } else if(playBackState == State.Playing){
                await TrackPlayer.pause();
            }else {
                await TrackPlayer.play();
            }
            await AsyncStorage.setItem('currentTrack',''+currentTrack);
        }
    } catch (error) {
        console.log(error);
    }
  };

  const goback = (props) =>{
    props.navigation.goBack()
  }
  const searchFilterFunction = (text) => {
    // Check if searched text is not blank
    if (text) {
      // Inserted text is not blank
      // Filter the masterDataSource and update FilteredDataSource
      const newData = props.selectedSongsList.filter(function (item) {
        // Applying filter for the inserted text in search bar
        let itemData = item.local_hint
          ? item.local_hint.toUpperCase()
          : ''.toUpperCase();
        const textData = text.toUpperCase();
        if(itemData.indexOf(textData) > -1){
          return itemData.indexOf(textData) > -1;
        }else{
          let itemData = item.local_id
          ? item.local_id
          : '';
          return itemData.indexOf(textData) > -1;
        }
      });
      setFilteredDataSource(newData);
      setSearch(text);
    } else {
      // Inserted text is blank
      // Update FilteredDataSource with masterDataSource
      setFilteredDataSource(props.selectedSongsList);
      setSearch(text);
    }
  };

  const ItemView = ({ item,type }) => {
    return (
      <>
      {/* {(type==='english' || type==='hindi')?(<Text style={styles.itemStyle} onPress={() => getItem(item)}>
        {item.local_id}
        {'.  '}
        {item.local_title.toUpperCase()}
      </Text>):null}
      {(type==='telugu' || type==='new')?(<Text style={styles.itemTelugu} onPress={() => getItem(item)}>
        {item.local_id}
        {'.  '}
        {item.local_title.toUpperCase()}
      </Text>):null}
      <Text style={{position:'absolute',right:5,top:15}}>
        {item.song[0].url!==''?<Ionicons name='musical-notes' size={20} color="#000000" />:''}
      </Text> */}
      {/* <View style={{display:'flex', flexDirection:'row', alignItems:'center'}}> */}
          <Text style={styles.itemTelugu} onPress={() => getItem(item)}>
            {item.local_id}
            {'.  '}
            {item.local_title.toUpperCase()}
          </Text> 
          {/* <TouchableOpacity onPress={() => togglePlayBack(playBackState)}>
            <Ionicons style={{right:10}}
              name={
                playBackState === State.Playing
                  ? 'ios-pause-circle'
                  : 'ios-play-circle'
              }
              size={30}
              color="#000000"
            />
            </TouchableOpacity> */}
         
               
      {/* </View> */}
      
      </>
    );
  };

  const ItemSeparatorView = () => {
    return (
      // Flat List Item Separator
      <View
        style={{
          height: 0.5,
          width: '100%',
          backgroundColor: '#C8C8C8',
        }}
      />
    );
  };
  const audioPlayer = () => {
    
    return (
      <View style={style.bottomSection}>
        <View style={style.bottomIconContainer}>
      <TouchableOpacity onPress={() => togglePlayBack(playBackState)}>
          <Ionicons name={ playBackState === State.Playing ? 'ios-pause-circle' : 'ios-play-circle' } size={30} color="#000000" />
          </TouchableOpacity>
          <View>
          <Slider
            style={style.progressBar}
            value={progress.position}
            minimumValue={0}
            maximumValue={progress.duration}
            thumbTintColor="#000000"
            minimumTrackTintColor="#000000"
            maximumTrackTintColor="#000000"
            onSlidingComplete={async value => {
              try{
                if(value>0){
                await TrackPlayer.seekTo(value);
                }else{
                  stopSongIfPlaying();
                }
              } catch (error) {
                console.log(error);
              }
            }}
            
          />
        
          {/* Progress Durations */}
          <View style={style.progressLevelDuraiton}>
            <Text style={style.progressLabelText}>
              {new Date(progress.position * 1000)
                .toLocaleTimeString()
                .substring(3).slice(0,-3)}
            </Text>
            <Text style={style.progressLabelText}>
              {new Date((progress.duration - progress.position) * 1000)
                .toLocaleTimeString()
                .substring(3).slice(0,-3)}
            </Text>
          </View>
        </View>

          <TouchableOpacity>
            <Ionicons name="information-circle" size={30} color="#000000" />
          </TouchableOpacity>
          </View>
          </View>
    );
  };
  const indexClicked = (songsList,type) => {
    setSelectedPlayList(type);
    setFilteredSongsList(songsList);
}
  const getItem = async (item) => {
   try{
      await TrackPlayer.getQueue().then(data=>{
        let index = 0;
        if(selectedPlayList==='telugu'){
          index = data.findIndex(song=>song.id === item.local_id);
        }else if(selectedPlayList==='english'){
          let englishSongsStartIndex = teluguSongsList.length;
          let englishSongIndex = englishSongsList.findIndex(song=>song.local_id === item.local_id);
          index = Number(englishSongsStartIndex) + Number(englishSongIndex);
        }else if(selectedPlayList==='hindi'){
          let hindiSongsStartIndex = teluguSongsList.length + englishSongsList.length;
          let hindiSongIndex = hindiSongsList.findIndex(song=>song.local_id === item.local_id);
          index = Number(hindiSongsStartIndex) + Number(hindiSongIndex);
        }else if(selectedPlayList==='new'){
          let newSongsStartIndex = teluguSongsList.length + englishSongsList.length + hindiSongsList.length;
          let newSongIndex = newSongsList.findIndex(song=>song.local_id === item.local_id);
          index = Number(newSongsStartIndex) + Number(newSongIndex);
        }

        if(index>-1){
          const currentTrack = TrackPlayer.getCurrentTrack();
          TrackPlayer.skip(index);
          TrackPlayer.play();
          AsyncStorage.setItem('currentTrack',''+index);
        }
      });
      //props.selectSong(item);
  }catch(error){
      console.log(error);
   }
  };

  return (
    <>
    <SafeAreaView style={{ backgroundColor:'#ffffff',height:height  }}>
      <View>
      <ScrollView horizontal>
            <View style={{marginLeft:-20}}>
            <DataTable style={styles.table} >
                <DataTable.Header>
                <DataTable.Title key={0} style={styles.header} onPress={ () => indexClicked(teluguSongsList,'telugu') }> <Text style={styles.tableHeading}>Telugu Songs</Text></DataTable.Title>
                <DataTable.Title key={1} style={styles.header} onPress={ () => indexClicked(englishSongsList,'english') }> <Text style={styles.tableHeading}>English Songs</Text></DataTable.Title>
                <DataTable.Title key={2} style={styles.header} onPress={ () => indexClicked(hindiSongsList,'hindi') }> <Text style={styles.tableHeading}>Hindi Songs</Text></DataTable.Title>
                <DataTable.Title key={3} style={styles.header} onPress={ () => indexClicked(newSongsList,'new') }> <Text style={styles.tableHeading}>New Songs</Text></DataTable.Title>
                </DataTable.Header>
            </DataTable>
            </View>
        </ScrollView>
      </View>
      <View style={styles.container}>
        {filteredSongsList.length>0?<FlatList
          data={filteredSongsList}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={ItemSeparatorView}
          renderItem={ItemView}
        />:null}
      </View>
      {/* bottom section */}
      {/* {(props.selectedSong.song && props.selectedSong.song[0] && props.selectedSong.song[0].url!=='')?audioPlayer():null} */}
    </SafeAreaView>
    </>
  );
};
const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  mainContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomSection: {
    //borderTopColor: '#000000',
    borderTopWidth: 0.5,
    width: width,
    alignItems: 'center',
    paddingVertical: 15,
    position:'absolute',
    bottom:0,
    backgroundColor:'#ffffff'
  },

  bottomIconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginLeft:-50
  },

  mainWrapper: {
    width: width,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
  },

  imageWrapper: {
    width: 300,
    height: 340,
    marginBottom: 25,
  },
  musicImage: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
  },
  elevation: {
    elevation: 5,

    shadowColor: '#ccc',
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
  },
  songContent: {
    textAlign: 'center',
    color: '#EEEEEE',
  },
  songTitle: {
    fontSize: 18,
    fontWeight: '600',
  },

  songArtist: {
    fontSize: 16,
    fontWeight: '300',
  },

  progressBar: {
    width: 300,
    height: 30,
    marginTop: 0,
    flexDirection: 'row',
  },
  progressLevelDuraiton: {
    width: 300,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabelText: {
    color: '#000000',
  },

  musicControlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
    width: '60%',
  },
});

const styles = StyleSheet.create({
  container: {
    paddingBottom: 210,
    //marginBottom: 100
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
    marginTop:30,
    fontWeight:'bold',
    marginHorizontal:167,
},
tableHeading:{
    //fontWeight:'bold',
    color:'white',
    fontSize:13,
    fontFamily:Fonts.Font_Medium
},
header:{
    padding:15,
    borderColor: 'white',
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderRightWidth: 1
},
  itemStyle: {
    padding: 10,
    color:'#000000',
    fontSize:18,
    fontFamily: Fonts.Font_Reguler
  },
  itemTelugu: {
    flex:1,
    paddingLeft: 12,
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 12,
    fontSize: 18,
    color:'black',
    width:width,
    //fontFamily:'suranna'
},
  textInputStyle: {
    height: 40,
    borderWidth: 1,
    paddingLeft: -10,
    marginLeft: -15,
    marginTop: 5,
    backgroundColor: Colors().themeColor,
    borderColor:Colors().themeColor,
    tintColor:'#ffffff',
    width: width-60,
    fontWeight:'700',
    color:'#fff',
    textColor:'#fff',
    underlineColor:Colors().themeColor
  },
});
function mapStateToProps(state) {
  return {
      selectedSong: state.song.selectedSong,
      songType: state.song.songType,
      selectedSongsList: state.song.selectedSongsList,
      songsDonated: state.song.songsDonated
  }
}

const mapDispatchToProps = dispatch => (
  bindActionCreators({
      selectSong,
      setSongType,
      setSongsDonated
  }, dispatch)
);
export default connect(mapStateToProps, mapDispatchToProps) (PlaylistScreen);