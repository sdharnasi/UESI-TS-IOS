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
  StatusBar
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
import { useFocusEffect } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { selectSong,setSongType,setSongs,setSongsDonated } from '@actions';
import AsyncStorage from '@react-native-community/async-storage';
import getApi from "@apis/getApi";
import { GlobalStyles, Colors } from '@helpers';
//let PlayList = [];
//let totalSongs = [];
//import songs from '../model/data';

const {width, height} = Dimensions.get('window');

const AudioSongsScreen = (props) => { 
  const playBackState = usePlaybackState();
  const progress = useProgress();
  //   custom states
  const [songIndex, setsongIndex] = useState(0);
  const [repeatMode, setRepeatMode] = useState('off');
  const [trackTitle, setTrackTitle] = useState();
  const [trackArtist, setTrackArtist] = useState();
  const [trackArtwork, setTrackArtwork] = useState();
  const [toastMessage, setToastMessage] = useState('');
  const [playList, setPlayList] = useState([]);
  
  // custom referecnces
  const scrollX = useRef(new Animated.Value(0)).current;
  const songSlider = useRef(null);
  
//   const displayLoader = () => {
//     return (
//       <>
//       <View style={styles.bottomSection}>
//         <View style={styles.bottomIconContainer}>
//         <ActivityIndicator animating={true} color='black' />
//          <Text style={{color:'#000000',marginLeft:10}}>{toastMessage} </Text>
//           </View>
//           </View>
//           </>
//     );
//   };

  const setupPlayer = async () => {
    
    try {
      await TrackPlayer.setupPlayer();
      await TrackPlayer.updateOptions({
        capabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
          Capability.SkipToPrevious,
          Capability.Stop,
        ],
      });
      //await TrackPlayer.add(songs);
    } catch (error) {
      console.log(error);
    }
  };
  
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
  //   changing the track on complete
  useTrackPlayerEvents([Event.PlaybackTrackChanged], async event => {
    try {
        if (event.type === Event.PlaybackTrackChanged && event.nextTrack !== null) {
          
        await AsyncStorage.setItem('currentTrack',''+event.nextTrack);
        const track = await TrackPlayer.getTrack(event.nextTrack);
        //const track = await TrackPlayer.getTrack(event.nextTrack);
        const {title, artwork, artist, id} = track;
          let changedSong = playList.filter(song=>{   
            return song.id == id});
            if(changedSong){
              props.selectSong(changedSong);
            }
          
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
    try{
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
    } catch (error) {
        console.log(error);
    }
  };

  const skipTo = async trackId => {
    try{
        await TrackPlayer.skip(trackId);
    } catch (error) {
        console.log(error);
    }
  };

   const addSongsToPlayer =  (songs,songs_donated) =>{
    let plist = [];
    songs.map((data,index)=>{
        data.song_json = data.song_json.replaceAll('\"','"');
        data.song_json = data.song_json.replaceAll('"[','[');
        data.song_json = data.song_json.replaceAll(']"',']');
        let songJson = JSON.parse(data.song_json);
        let count = 0;
        songJson?.map((song_json,index1)=>{
            if(song_json.song && song_json.song[0] && song_json.song[0].url && song_json.song[0].url !==''){
                song_json.song[0].artwork = require('../assets/images/web-logo1.jpeg');
                if(songs_donated===''){
                  if(count<20 && song_json.song[0].url!=''){
                    count++;
                    plist.push(song_json.song[0]);
                  }
                }else{
                  if(song_json.song[0].url!=''){
                    plist.push(song_json.song[0]);
                  }
                }
                
                //TrackPlayer.add(song_json.song[0]);
            }
        });
        if(index === songs.length-1){
            try{             
                  setTimeout(()=>{    
                      TrackPlayer.add(plist);
                      setPlayList(plist);
                      // TrackPlayer.getQueue().then(data=>{
                        
                      // });
                      skipToSpecific();
                  },1000);
            } catch (error) {
                console.log(error);
            }
        }

    });
  }
  // useFocusEffect(
  //   useCallback(() => {
      
      
  //   }, [])
  // )


  useEffect(() => {
    setupPlayer();
    async function checkSongsDonated() {
      try{
        await AsyncStorage.getItem('USER_ACCESS').then(data=>{
          data = JSON.parse(data);
          if(data && data.song_book && data.song_book==1){
            fetchData('1'); 
            //props.setSongsDonated(data);
          }else{
            fetchData(''); 
          }
        });
      }catch(error){
        console.log(error);
      }
    }

    async function fetchData(songs_donated) {
      try{
          await AsyncStorage.getItem('TOTAL_SONGS').then(data=>{
          if(data){
              addSongsToPlayer(JSON.parse(data),songs_donated);
          }
          });
      } catch (error) {
          console.log(error);
      }
    }
    checkSongsDonated();
    scrollX.addListener(({value}) => {
      //   console.log(`ScrollX : ${value} | Device Width : ${width} `);

      const index = Math.round(value / width);
      skipTo(index);
      setsongIndex(index);

      //   console.log(`Index : ${index}`);
    });

    return () => {
      try{
        scrollX.removeAllListeners();
        TrackPlayer.destroy();
      }catch(error){
        console.log(error);
      }
    };

    
  }, []);

  const skipToNext = async () => {
    try{
        const currentTrack = await TrackPlayer.getCurrentTrack();
        if(currentTrack === (playList.length-1)){
            await TrackPlayer.skip(0);
            await TrackPlayer.play();
            await AsyncStorage.setItem('currentTrack','0');
            
        }else{
            await TrackPlayer.skipToNext();
            await TrackPlayer.play();
            await AsyncStorage.setItem('currentTrack',''+currentTrack+1);
        }
    } catch (error) {
        console.log(error);
    }
  };

  const skipToPrevious = async () => {
    try{
        const currentTrack = await TrackPlayer.getCurrentTrack();
        if(currentTrack === 0){
            await TrackPlayer.skip((playList.length-1));
            await TrackPlayer.play();
            await AsyncStorage.setItem('currentTrack',''+playList.length-1);
        }else{
            await TrackPlayer.skipToPrevious();
            await TrackPlayer.play();
            await AsyncStorage.setItem('currentTrack',''+currentTrack-1);
        }  
    } catch (error) {
        console.log(error);
    }
  };

  const skipToSpecific = async () => {
    try{
      await AsyncStorage.getItem('currentTrack').then(data=>{
        if(data){
          TrackPlayer.skip(Number(data));
        }else{
          TrackPlayer.skip(0);
        }
      });
       //props.selectSong(item);
   }catch(error){
       console.log(error);
    }
   };
  
  const openPlayList = () => {
    props.navigation.navigate('PlaylistScreen');
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

  return (
    <>
    <StatusBar />
    <SafeAreaView style={style.container}>
      {/* music player section */}
      <View style={style.mainContainer}>
        {/* Image */}

        <Animated.FlatList
          ref={songSlider}
          renderItem={renderSongs}
          data={playList}
          keyExtractor={item => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [
              {
                nativeEvent: {
                  contentOffset: {x: scrollX},
                },
              },
            ],
            {useNativeDriver: true},
          )}
        />

        {/* Title & Artist Name */}
        <View>
          <Text style={[style.songContent, style.songTitle]}>
            { trackTitle}
          </Text>
          <Text style={[style.songContent, style.songArtist]}>
            {trackArtist}
          </Text>
        </View>

        {/* songslider */}
        <View>
          <Slider
            style={style.progressBar}
            value={progress.position}
            minimumValue={0}
            maximumValue={progress.duration}
            thumbTintColor="#ffffff"
            minimumTrackTintColor="#ffffff"
            maximumTrackTintColor="#ffffff"
            onSlidingComplete={async value => {
                try{
                  await TrackPlayer.seekTo(value);
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

        {/* music control */}
        <View style={style.musicControlsContainer}>
          <TouchableOpacity onPress={skipToPrevious}>
            <Ionicons name="play-skip-back-outline" size={35} color="#ffffff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => togglePlayBack(playBackState)}>
            <Ionicons
              name={
                playBackState === State.Playing
                  ? 'ios-pause-circle'
                  : 'ios-play-circle'
              }
              size={75}
              color="#ffffff"
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={skipToNext}>
            <Ionicons
              name="play-skip-forward-outline"
              size={35}
              color="#ffffff"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* bottom section */}
      <View style={style.bottomSection}>
        <View style={style.bottomIconContainer}>
          <TouchableOpacity onPress={() => {}}>
            <Ionicons name="heart-outline" size={30} color="#888888" />
          </TouchableOpacity>

          <TouchableOpacity onPress={changeRepeatMode}>
            <MaterialCommunityIcons
              name={`${repeatIcon()}`}
              size={30}
              color={repeatMode !== 'off' ? '#ffffff' : '#888888'}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => {}}>
            <Ionicons name="share-outline" size={30} color="#ffffff" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => openPlayList()}>
            <Ionicons name="ellipsis-horizontal" size={30} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>
      {/* {toastMessage!==''?displayLoader():null} */}
    </SafeAreaView>
    </>
  );
};

function mapStateToProps(state) {
    return {
        selectedSong: state.song.selectedSong,
        songType: state.song.songType,
        songsDonated: state.song.songsDonated
    }
  }
  
  const mapDispatchToProps = dispatch => (
    bindActionCreators({
        selectSong,
        setSongs,
        setSongType,
        setSongsDonated
    }, dispatch)
  );

export default connect(mapStateToProps, mapDispatchToProps) (AudioSongsScreen);

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222831',
  },
  mainContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomSection: {
    borderTopColor: '#ffffff',
    borderWidth: 1,
    width: width,
    alignItems: 'center',
    paddingVertical: 15,
  },

  bottomIconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },

  mainWrapper: {
    width: width,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
  },

  imageWrapper: {
    width: 250,
    height: 250,
    marginBottom: 15,
  },
  musicImage: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
  },
  elevation: {
    elevation: 5,

    shadowColor: '#ffffff',
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
  },
  songContent: {
    textAlign: 'center',
    color: '#ffffff',
    fontFamily:'mallanna'
  },
  songTitle: {
    fontSize: 20,
    fontWeight: '600',
    padding:10
  },

  songArtist: {
    fontSize: 18,
    fontWeight: '600',
  },

  progressBar: {
    width: 350,
    height: 40,
    marginTop: 25,
    flexDirection: 'row',
  },
  progressLevelDuraiton: {
    width: 340,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabelText: {
    color: '#ffffff',
  },

  musicControlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 40,
    width: '60%',
  }
});