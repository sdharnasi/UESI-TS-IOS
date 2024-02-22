import {View, Text, TouchableOpacity, Touchable, Dimensions, Image, BackHandler, Alert,StyleSheet,ActivityIndicator} from 'react-native';
import React, {useEffect, useRef, useState,useCallback} from 'react';
import Video from 'react-native-video';
import Slider from '@react-native-community/slider';
import Orientation from 'react-native-orientation-locker';
const { width, height } = Dimensions.get('screen');
import { useFocusEffect } from '@react-navigation/native';
import { GlobalStyles, Colors } from '@helpers';

const VideoPlayerScreen = (props) => {
  const [clicked, setClicked] = useState(true);
  const [puased, setPaused] = useState(false);
  const [progress, setProgress] = useState({"currentTime": 0, "playableDuration": 0, "seekableDuration": 0});
  const [fullScreen,setFullScreen]=useState(false);
  const [showLoader,setShowLoader]=useState(true);
  const [selectedVideo,setSelectedVideo]=useState({video_link:''});
  const ref = useRef();

  useFocusEffect(
    useCallback(() => {
      const { selectedVideo } = props.route.params;
      setSelectedVideo(selectedVideo);
    
    }, [])
  )

  useEffect(() => {
      setFullScreen(true);
      Orientation.lockToLandscape();
      if(clicked){
        setTimeout(()=>{
          setClicked(false);
        },5000);
      }
    const backAction = () => {
      Orientation.lockToPortrait();
      props.navigation.navigate('TriconScreen');
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    //return () => backHandler.remove();
  }, [props]);
  const playButtonClicked = ()=>{
    console.log("playButtonClicked  ");
    Orientation.lockToLandscape();
  }
  const goback = (props) =>{
      Orientation.lockToPortrait();
      props.navigation.goBack();
  }
  const onBuffer = ()=>{
    console.log("onBuffer");
  }

  const videoError = ()=>{
    console.log("videoError ");
  }

  const format = seconds => {
    let mins = parseInt(seconds / 60)
      .toString()
      .padStart(2, '0');
    let secs = (Math.trunc(seconds) % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };
  
  return (
    <View style={{flex: 1}}>
      
      <TouchableOpacity
        style={{width: '100%', height:fullScreen?'100%': 200}}
        onPress={() => {
          setClicked(!clicked);
          if(clicked){
            setTimeout(()=>{
              setClicked(false);
            },5000);
          }
        }}>
        {showLoader?<View style={{width: '100%',
              height: '85%',
              position: 'absolute',
              justifyContent: 'center',
              alignItems: 'center',zIndex:99999}}>
          <ActivityIndicator size="large" color={Colors().themeColor} />
        </View>:null}
        <Video
          paused={puased}
          //controls={true}
          fullscreen={true}
          //onBuffer={this.onBuffer}
          //onError={this.videoError} 
          style={styles.backgroundVideo}  
          source={{
            uri: selectedVideo.video_link,
          }}
          ref={ref}
          onProgress={x => {
            //console.log(x);
            //console.log(x.playableDuration);
            // if((Number(x.currentTime)-0.500) == Number(x.playableDuration)){
            //   console.log("Video ended");
            //   setClicked(true);
            // }
            setProgress(x);
            setShowLoader(false);
            //console.log(progress);
            
          }}
          // Can be a URL or a local file.
          //  ref={(ref) => {
          //    this.player = ref
          //  }}                                      // Store reference
          //  onBuffer={this.onBuffer}                // Callback when remote video is buffering
          //  onError={this.videoError}

          // Callback when video cannot be loaded
          style={{width: '100%', height: fullScreen?'100%': 200}}
          resizeMode="stretch"
        />
        {clicked && (
          <TouchableOpacity  onPress={() => {
              setClicked(!clicked);
              if(clicked){
                setTimeout(()=>{
                  setClicked(false);
                },5000);
              }
          }} 
            style={{
              width: '100%',
              height: '100%',
              position: 'absolute',
              backgroundColor: 'rgba(0,0,0,0.5)',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex:9999999
            }}>
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity
                onPress={() => {
                  //console.log(progress.currentTime);
                  ref.current.seek(parseInt(progress.currentTime) - 10);
                }}>
                <Image
                  source={require('../assets/video-player-controls/backward.png')}
                  style={{width: 30, height: 30, tintColor: 'white'}}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setPaused(!puased);
                }}>
                <Image
                  source={
                    puased
                      ? require('../assets/video-player-controls/play-button.png')
                      : require('../assets/video-player-controls/pause.png')
                  }
                  style={{
                    width: 30,
                    height: 30,
                    tintColor: 'white',
                    marginLeft: 50,
                  }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  ref.current.seek(parseInt(progress.currentTime) + 10);
                }}>
                <Image
                  source={require('../assets/video-player-controls/forward.png')}
                  style={{
                    width: 30,
                    height: 30,
                    tintColor: 'white',
                    marginLeft: 50,
                  }}
                />
              </TouchableOpacity>
            </View>
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-between',
                position: 'absolute',
                bottom: 0,
                paddingLeft: 20,
                paddingRight: 20,
                alignItems:'center'
              }}>
              <Text style={{color: 'white'}}>
                {format(progress.currentTime)}
              </Text>
              <Slider
                style={{width: '80%', height: 40}}
                minimumValue={0}
                maximumValue={progress.seekableDuration}
                minimumTrackTintColor="#FFFFFF"
                maximumTrackTintColor="#fff"
                onValueChange={(x)=>{
                  ref.current.seek(x);
                }}
              />
              <Text style={{color: 'white'}}>
                {format(progress.seekableDuration)}
              </Text>
            </View>
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-between',
                position: 'absolute',
                top: 10,
                paddingLeft: 20,
                paddingRight: 20,
                alignItems:'center'
              }}>
            <TouchableOpacity onPress={()=>goback(props)}>
              <Image source={require('../assets/video-player-controls/back.png')}
               style={{width:24,height: 24,tintColor:'white'}}/>
            </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default VideoPlayerScreen;

const styles = StyleSheet.create({
  container:{ flex: 1, justifyContent: "center"},
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});