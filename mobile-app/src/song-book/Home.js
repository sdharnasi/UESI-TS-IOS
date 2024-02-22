import React, {useEffect, useRef, useState,useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  Image,
  FlatList,
  Animated,
  Pressable,
  ScrollView,
  Alert
} from 'react-native';

import TrackPlayer, {
  Capability,
  Event,
  RepeatMode,
  State,
  usePlaybackState,
  useProgress,
  useTrackPlayerEvents,
} from 'react-native-track-player';
import Slider from '@react-native-community/slider';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import songs from '../data';
import { useFocusEffect } from '@react-navigation/native';
import { Button, Modal, Tooltip, ActivityIndicator, MD2Colors } from 'react-native-paper';
import ModalPreview  from '../screens/ModalPreview';
import Fonts from "@helpers/Fonts";
const {width, height} = Dimensions.get('window');
import Share from 'react-native-share';
const teluguTotalSongs =  require('../common/telugu-song-index-list.json');
const englishTotalSongs =  require('../common/english-song-index-list.json');
const hindiTotalSongs =  require('../common/hindi-song-index-list.json');
const newTotalSongs =  require('../common/new-song-index-list.json');
import RenderHtml from 'react-native-render-html';
import { bindActionCreators } from "redux";
import { selectSong,setSongType } from '@actions';
import { connect } from 'react-redux';
let selectedSongToShare = '';
const Home = (props) => {
  //console.log(props.songType)
   const [audioAvailable, setAudioAvailable] = useState(false);
   const [showLoader, setShowLoader] = useState(true);
  const playBackState = usePlaybackState();
  const progress = useProgress();
  //   custom states
  const [songIndex, setsongIndex] = useState(0);
  const [repeatMode, setRepeatMode] = useState('off');
  const [trackTitle, setTrackTitle] = useState();
  const [trackArtist, setTrackArtist] = useState();
  const [trackArtwork, setTrackArtwork] = useState();
  // custom referecnces
  const scrollX = useRef(new Animated.Value(0)).current;
  const songSlider = useRef(null);

  useFocusEffect(
    useCallback(() => {
      selectedSongToShare = props.selectedSong;
    }))
  const goback = (song) =>{
    try{
      TrackPlayer.reset();
      props.navigation.goBack();
    }catch(err){

    }
    
    
  }
  const showNote = ()=>{
    if(props.selectedSong.note && props.selectedSong.note!=''){
      Alert.alert('', props.selectedSong.note, [
        {text: 'OK', onPress: () => okayPressed()},
      ]);
    }
    
  }
  const okayPressed = () =>{

  }
  const previousSong = (song) =>{
    let totalSongs = props.selectedSongsList;
    let index = totalSongs.findIndex(song1=>song1.local_id===song.local_id);
    if(index>-1){
      let count = index-1;
        if(count>-1){
          TrackPlayer.reset();
          props.selectSong(totalSongs[count]);
          selectedSongToShare = totalSongs[count];
          props.navigation.navigate('Home');
          try{
            totalSongs[count].song[0].artwork = require('../assets/images/web-logo.png');
            TrackPlayer.add(totalSongs[count].song);
          }catch (error) {
            console.log(error);
          }
        }
    }
  }
  const nextSong = (song) =>{
    let totalSongs = props.selectedSongsList;
    let index = totalSongs.findIndex(song1=>song1.local_id===song.local_id);
    if(index>-1){
      let count = index+1;
        if(count<totalSongs.length){
          TrackPlayer.reset();
          props.selectSong(totalSongs[count]);
          selectedSongToShare = totalSongs[count];
          props.navigation.navigate('Home');
          try{
            totalSongs[count].song[0].artwork = require('../assets/images/web-logo.png');
            TrackPlayer.add(totalSongs[count].song);
          }catch (error) {
            console.log(error);
          }
        }
    }
  }
  const setupPlayer = async () => {
    try {
      await TrackPlayer.setupPlayer();
      await TrackPlayer.updateOptions({
        capabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.Stop
        ],
      });
    } catch (error) {
      console.log(error);
    }
  };
  
  const togglePlayBack = async playBackState => {
    try {
      props.selectedSong.song[0].artwork = require('../assets/images/web-logo.png');
      await TrackPlayer.add(props.selectedSong.song);
      await TrackPlayer.setRepeatMode(RepeatMode.Track);
      const currentTrack = await TrackPlayer.getCurrentTrack();
      if (currentTrack != null) {
        if (playBackState == State.Paused) {
          await TrackPlayer.play();
        } else if(playBackState == State.Playing){
          await TrackPlayer.pause();
        }else {
          await TrackPlayer.play();
        }
      }
  } catch (error) {
    console.log(error);
  }
  };
  
  //   changing the track on complete
  useTrackPlayerEvents([Event.PlaybackTrackChanged], async event => {
    try {
    if (event.type === Event.PlaybackTrackChanged && event.nextTrack !== null) {
      const track = await TrackPlayer.getTrack(event.nextTrack);
      const {title, artwork, artist} = track;
      setTrackTitle(title);
      setTrackArtist(artist);
      setTrackArtwork(artwork);
    }
  } catch (error) {
    console.log(error);
  }
  });

  const repeatIcon = () => {
    if (repeatMode == 'off') {
      return 'repeat-off';
    }

    if (repeatMode == 'track') {
      return 'repeat-once';
    }

    if (repeatMode == 'repeat') {
      return 'repeat';
    }
  };

  const changeRepeatMode = () => {
    if (repeatMode == 'off') {
      TrackPlayer.setRepeatMode(RepeatMode.Track);
      setRepeatMode('track');
    }

    if (repeatMode == 'track') {
      TrackPlayer.setRepeatMode(RepeatMode.Queue);
      setRepeatMode('repeat');
    }

    if (repeatMode == 'repeat') {
      TrackPlayer.setRepeatMode(RepeatMode.Off);
      setRepeatMode('off');
    }
  };

  const skipTo = async trackId => {
    try{
      await TrackPlayer.skip(trackId);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setTimeout(()=>{
      try{
        props.selectedSong.song[0].artwork = require('../assets/images/web-logo.png');
        TrackPlayer.add(props.selectedSong.song);
      }catch (error) {
        console.log(error);
      }
    },1000);
    

    props.navigation.setOptions({
      title: props.songType,
      headerLeft: () => (
        <>
          <View style={{flex:1,justifyContent:'space-between', flexDirection:'row',alignItems:'center'}}>
          <Button onPress={() => goback()} style={{paddingRight:-10,marginRight:-20}}><Ionicons name='arrow-back' size={25} color="#ffffff" /></Button>
          </View>
          </>
      ),
      headerRight: () => (
        <>
          <View style={{flex:1,justifyContent:'space-between', flexDirection:'row',alignItems:'center'}}>
          <Button onPress={() => searchSong()} style={{paddingRight:-10,marginRight:-20}}><Ionicons name='search-sharp' size={25} color="#ffffff" /></Button>
          <Button onPress={() => shareSong()}><Ionicons name='share-social-sharp' size={25} color="#ffffff" /></Button>
          </View>
          </>
      ),
    });
    setupPlayer();
   
    scrollX.addListener(({value}) => {
      //   console.log(`ScrollX : ${value} | Device Width : ${width} `);

      const index = Math.round(value / width);
      skipTo(index);
      setsongIndex(index);
    });

    return () => {
      scrollX.removeAllListeners();
      TrackPlayer.destroy();
    };
  }, [props.navigation]);

  const skipToNext = () => {
    songSlider.current.scrollToOffset({
      offset: (songIndex + 1) * width,
    });
  };

  const skipToPrevious = () => {
    songSlider.current.scrollToOffset({
      offset: (songIndex - 1) * width,
    });
  };

  const renderSongs = ({item, index}) => {
    return (
      <Animated.View style={style.mainWrapper}>
        <View style={[style.imageWrapper, style.elevation]}>
          <Image
            //   source={item.artwork}
            source={trackArtwork}
            style={style.musicImage}
          />
        </View>
      </Animated.View>
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

        {(props.selectedSong && props.selectedSong.note && props.selectedSong.note!='')? <TouchableOpacity onPress={() => showNote()}>
            <Ionicons name="information-circle" size={30} color="#000000" />
          </TouchableOpacity>:null}
          </View>
          </View>
    );
  };
  const noAudioPlayer = () => {
    return (
      <View style={style.bottomSection}>
        <View style={style.bottomIconContainer}>
            <Text style={style.progressLabelText}>Audio song not available.</Text>
          </View>
          </View>
    );
  };

  const displayLoader = () => {
    return (
      <View style={style.bottomSection}>
        <View style={style.bottomIconContainer}>
              <ActivityIndicator animating={true} color='black' />
          </View>
          </View>
    );
  };


  // const closeModalHandler = () => {
  //     setModalVisible(false);
  // }

  const searchSong = () => {
    props.navigation.navigate('SongSearchScreen');  
  }

  const shareSong = ()=>{
    const shareOptions = {
      message:'\n UESI - Vidyarthi_Geethavali Android App: \n https://play.google.com/store/apps/details?id=com.uesits.geethavali\n\n'+selectedSongToShare.local_text
    };
    Share.open(shareOptions)
    .then((res) => {
        console.log(res);
    })
    .catch((err) => {
        err && console.log(err);
    });
  }


  return (
    <>
    <SafeAreaView style={style.container}>
      <View style={{flexDirection:'row', justifyContent:'space-between',alignItems:'center'}}>
        <Button onPress={()=>previousSong(props.selectedSong)}><Ionicons name='arrow-back' size={30} color="#000000" /></Button>
        {(props.songType==='telugu' || props.songType==='new')?<Text style={[styles.teluguFont,{color:'#000000',fontSize:18,height:30,width:250,textAlign:'center'}]}>{props.selectedSong.local_id}. {props.selectedSong.local_title} </Text>:''}
        {(props.songType==='english' || props.songType==='hindi')?<Text style={[styles.englishFont,{color:'#000000',fontSize:18,height:30,width:250,textAlign:'center'}]}>{props.selectedSong.local_id}. {props.selectedSong.local_title} </Text>:''}
        <Button onPress={()=>nextSong(props.selectedSong)}><Ionicons name='arrow-forward' size={30} color="#000000" /></Button>
      </View>
      <ScrollView>
        <View style={{paddingLeft:10, paddingRight:10}}>
          <View style={{display:'flex', flexDirection:'row',justifyContent:'center',alignItems:'flex-end',marginBottom:10}}>
            <Text style={{color:'#000000',fontSize:25,fontWeight:'bold'}}>{props.selectedSong.song_chord}</Text>
            <Text style={{color:'#000000',fontSize:16,fontWeight:'bold',position:"absolute",right:0}}>{props.selectedSong.song[0].artist}</Text>
          </View>
          {(props.songType==='telugu' || props.songType==='new')?<Text style={[styles.teluguFont,{color:'#000000', fontSize:18, marginTop:0, paddingBottom:110}]}>
          {props.selectedSong.local_text}
          </Text>:null}
          {(props.songType==='english' || props.songType==='hindi')?<Text style={[styles.englishFont,{color:'#000000', fontSize:20, marginTop:0, paddingBottom:110}]}>
          {props.selectedSong.local_text}
          </Text>:null}
        </View>
      </ScrollView>

      {/* bottom section */}
      {(props.selectedSong.song && props.selectedSong.song[0] && props.selectedSong.song[0].url!=='')?audioPlayer():noAudioPlayer()}
    </SafeAreaView>
    </>
  );
};

function mapStateToProps(state) {
  return {
      selectedSong: state.song.selectedSong,
      songType: state.song.songType,
      selectedSongsList: state.song.selectedSongsList
  }
}

const mapDispatchToProps = dispatch => (
  bindActionCreators({
      selectSong,
      setSongType
  }, dispatch)
);
export default connect(mapStateToProps, mapDispatchToProps) (Home);

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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 0,
    backgroundColor: 'white',
    //borderRadius: 20,
    padding: 50,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: '#000',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    color:'#000'
  },
  teluguFont:{
    //fontFamily: 'suranna',
  },
  englishFont:{
    fontFamily:Fonts.Font_Reguler
    
  }
});