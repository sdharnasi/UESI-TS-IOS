// Custom Navigation Drawer / Sidebar with Image and Icon in Menu Options
// https://aboutreact.com/custom-navigation-drawer-sidebar-with-image-and-icon-in-menu-options/
import React, { useState,useCallback } from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  Image,
  Text,
  Linking,
  ScrollView,
  TouchableOpacity,
  Button,
  Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from "@react-navigation/core";
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import {Divider} from  "react-native-paper";
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import { OtrixDivider } from '@component';
import { splashlogo,sidenavImage } from './common';
import { selectSong,setSongType,setMagazineType,setSongsDonated,setTriconType } from '@actions';
import Fonts from "@helpers/Fonts";
import MessagesScreen from './screens/MessagesScreen';
import MomentsScreen from './screens/MomentsScreen';
import Share from 'react-native-share';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import { Colors } from './helpers';
import { doLogin } from './redux/Action';
import getApi from "@apis/getApi";
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,//
} from '@react-native-google-signin/google-signin';
// GoogleSignin.configure({
//   webClientId: '910722162039-gisd4ja9a00dhor501jckvajhsk47c57.apps.googleusercontent.com',
//   scopes: ['profile', 'email']
// });
import { getUniqueId, getManufacturer, getDeviceName } from 'react-native-device-info';
import { logfunction } from "@helpers/FunctionHelper";

const { width } = Dimensions.get('screen');
function AccordionItem({ children, title, titleKey }: AccordionItemPros): JSX.Element {
  const [ expanded, setExpanded ] = useState(false);
  

  function toggleItem() {
    setExpanded(!expanded);
  }

  const body = <View style={styles.accordBody}>{ children }</View>;

  return (
    <View>
      <TouchableOpacity style={[styles.accordHeader,{flex: 1,flexDirection: 'row', justifyContent:"flex-start", alignItems:'center'}]} onPress={ toggleItem }>
        {titleKey==='song-book'?<Icon style={{paddingRight:15,width:40,textAlign:'right'}} name='book' size={28} color="#FFFFFF" />:null}
        {titleKey==='magazines'?<Icon style={{paddingRight:15,width:40,textAlign:'right'}} name='file-pdf-o' size={25} color="#FFFFFF" />:null}
        {titleKey==='tricon'?<Icon style={{paddingRight:15,width:40,textAlign:'right'}} name='film' size={23} color="#FFFFFF" />:null}
        <View style={{flex: 1}}>
          <Text style={{color:'#FFFFFF',fontSize:16, marginTop:2, marginLeft:3, fontFamily: Fonts.Font_Medium}}>{ title }</Text>
        </View>
      </TouchableOpacity>
      { expanded && body }
    </View>
  );
}

const CustomSidebarMenu = (props) => {
  const navigation = useNavigation();
  const {state, descriptors, USER_AUTH} = props;
  const [custmerData,setCustmerData] = React.useState({});
  const [deviceId, setDeviceId] = React.useState('');
    const [deviceName, setDeviceName] = React.useState('');
    const [formData, setFormData] = React.useState({  email: null, homePageData: [], loading: true, profileImageURL: null });
  let lastGroupName = '';
  let newGroup = true;
  let sameGroup = true;

  const BASE_PATH =
    'https://www.uesiap.com/';
  const proileImage = 'react_logo.png';

  const navigateToRoute = (route,drawerKey) =>{
    props.setSongType(drawerKey);
    navigation.navigate(route.name);
  }
  const navigateToMagazineRoute = (route,drawerKey) =>{
    navigation.navigate(route.name,{
      magazineType: drawerKey
    });
    
  }

  const navigateToTriconRoute = (route,drawerKey) =>{
    props.setTriconType(drawerKey);
    navigation.navigate(route.name,{
      triconType: drawerKey
    });
  }

  useFocusEffect(
    useCallback(() => {
      // get Device name & Device ID
         getUniqueId().then(data=>{
            
            setDeviceId(data);
        });
        getDeviceName().then(data=>{
            
            setDeviceName(data);
        });

      //checkSongsDonated();
      async function getCustomerData() {
        await AsyncStorage.getItem("CUSTOMER_DATA").then(data=>{
            setCustmerData(JSON.parse(data));
        });
    }
    getCustomerData();

    }, [])
  )

  const prepareHomeGroup = (value) => {
    return state.routes?.map((route, index) => {
      const {
        drawerLabel,
        activeTintColor,
        groupName
      } = descriptors[route.key].options;
      return (
        groupName==='home'?
      <DrawerItem
          key={route.key}
          label={
            ({color}) =>
            <>
            <View style={styles.accordHeader1}>
              <Icon style={{paddingRight:15,width:40,textAlign:'right'}} name='home' size={25} color="#FFFFFF" />
                <View style={{flex: 1,flexDirection: 'row', justifyContent:'space-between'}}>
                  <Text style={{color:'#FFFFFF',fontSize:16, marginTop:2, marginLeft:3,fontFamily:Fonts.Font_Medium}}>{drawerLabel}</Text>
                </View>
                </View>
              </>
          }
          focused={
            state.routes.findIndex(
              (e) => e.name === route.name
            ) === state.index
          }
          onPress={() => navigation.navigate(route.name)}
      />:null
      )
  })
      
  }
  const prepareDFDProgramsGroup = (value) => {
    return state.routes?.map((route, index) => {
      const {
        drawerLabel,
        activeTintColor,
        groupName
      } = descriptors[route.key].options;
      return (
        groupName==='dfd-programs'?
      <DrawerItem
          key={route.key}
          label={
            ({color}) =>
            <>
            <View style={styles.accordHeader1}>
              <Icon style={{paddingRight:15,width:40,textAlign:'right'}} name='video-camera' size={25} color="#FFFFFF" />
                <View style={{flex: 1,flexDirection: 'row', justifyContent:'space-between'}}>
                  <Text style={{color:'#FFFFFF',fontSize:16, marginLeft:3, marginTop:2, fontFamily:Fonts.Font_Medium}}>{drawerLabel}</Text>
                </View>
                </View>
              </>
          }
          focused={
            state.routes.findIndex(
              (e) => e.name === route.name
            ) === state.index
          }
          onPress={() => navigation.navigate(route.name)}
      />:null
      )
  })
      
  }
  const prepareUpcommingProgramsGroup = (value) => {
    return state.routes?.map((route, index) => {
      const {
        drawerLabel,
        activeTintColor,
        groupName
      } = descriptors[route.key].options;
      return (
        groupName==='upcomming-programs'?
      <DrawerItem
          key={route.key}
          label={
            ({color}) =>
            <>
            <View style={styles.accordHeader1}>
              <Icon style={{paddingRight:15,width:40,textAlign:'right'}} name='list-alt' size={25} color="#FFFFFF" />
                <View style={{flex: 1,flexDirection: 'row', justifyContent:'space-between'}}>
                  <Text style={{color:'#FFFFFF',fontSize:16, marginLeft:3, marginTop:2, fontFamily:Fonts.Font_Medium}}>{drawerLabel}</Text>
                </View>
                </View>
              </>
          }
          focused={
            state.routes.findIndex(
              (e) => e.name === route.name
            ) === state.index
          }
          onPress={() => navigation.navigate(route.name)}
      />:null
      )
  })
      
  }

const prepareSongBookGroup = (value) => {
  return state.routes?.map((route, index) => {
    const {
      drawerLabel,
      activeTintColor,
      groupName,
      drawerKey
    } = descriptors[route.key].options;
    return (
      groupName==='song-book'?
    <DrawerItem style={{left:5,position:'relative'}}
        key={route.key}
        label={
          ({color}) =>

            <Text style={{color:'#FFFFFF',fontSize:15,paddingTop:-10,marginTop:-10,paddingBottom:-10,marginBottom:-10,marginLeft:12, fontFamily:Fonts.Font_Medium}}>
              {drawerLabel}
            </Text>
        }
        focused={
          state.routes.findIndex(
            (e) => e.name === route.name
          ) === state.index
        }
        activeTintColor={activeTintColor}
        onPress={() =>navigateToRoute(route,drawerKey) }
    />:null
    )
})
    
}
const prepareTriconGroup = (value) => {
  return state.routes?.map((route, index) => {
    const {
      drawerLabel,
      activeTintColor,
      groupName,
      drawerKey
    } = descriptors[route.key].options;
    return (
      groupName==='tricon'?
    <DrawerItem style={{padding:-10,margin:-10,left:5,position:'relative'}}
        key={route.key}
        label={
          ({color}) =>

            <Text style={{color:'#FFFFFF',fontSize:15,paddingTop:-10,marginTop:-10,paddingBottom:-10,marginBottom:-10,marginLeft:12,fontFamily:Fonts.Font_Medium}}>
              {drawerLabel}
            </Text>
        }
        focused={
          state.routes.findIndex(
            (e) => e.name === route.name
          ) === state.index
        }
        activeTintColor={activeTintColor}
        onPress={() =>navigateToTriconRoute(route,drawerKey) }
    />:null
    )
})
    
}
const prepareMagazinesGroup = (value) => {
  return state.routes?.map((route, index) => {
    const {
      drawerLabel,
      activeTintColor,
      groupName,
      drawerKey
    } = descriptors[route.key].options;
    return (
      groupName==='magazines'?
    <DrawerItem style={{padding:-10,margin:-10,left:5,position:'relative'}}
        key={route.key}
        label={
          ({color}) =>

            <Text style={{color:'#FFFFFF',fontSize:15,paddingTop:-10,marginTop:-10,paddingBottom:-10,marginBottom:-10,marginLeft:12,fontFamily:Fonts.Font_Medium}}>
              {drawerLabel}
            </Text>
        }
        focused={
          state.routes.findIndex(
            (e) => e.name === route.name
          ) === state.index
        }
        activeTintColor={activeTintColor}
        onPress={() =>navigateToMagazineRoute(route,drawerKey) }
    />:null
    )
})
    
}

const prepareDonateForAllSongsGroup = (value) => {
  return state.routes?.map((route, index) => {
    const {
      drawerLabel,
      activeTintColor,
      groupName
    } = descriptors[route.key].options;
    return (
      groupName==='donate'?
    <DrawerItem
        key={route.key}
        label={
          ({color}) =>
          <>
          <View style={styles.accordHeader1}>
            <Icon style={{paddingRight:15,width:40,textAlign:'right'}} name='money' size={28} color="#FFFFFF" />
              <View style={{flex: 1,flexDirection: 'row', justifyContent:'space-between'}}>
              <Text style={{color:'#FFFFFF',fontSize:16, marginLeft:3, marginTop:2, fontFamily:Fonts.Font_Medium}}>{drawerLabel}</Text>
              </View>
              </View>
            </>
        }
        focused={
          state.routes.findIndex(
            (e) => e.name === route.name
          ) === state.index
        }
        onPress={() => navigation.navigate(route.name)}
    />:null
    )
})
    
}
const prepareBookStoreGroup = (value) => {
  return state.routes?.map((route, index) => {
    const {
      drawerLabel,
      activeTintColor,
      groupName
    } = descriptors[route.key].options;
    return (
      groupName==='book-store'?
    <DrawerItem
        key={route.key}
        label={
          ({color}) =>
          <>
          <View style={styles.accordHeader1}>
            <Icon style={{paddingRight:15,width:40,textAlign:'right'}} name='shopping-basket' size={24} color="#FFFFFF" />
              <View style={{flex: 1,flexDirection: 'row', justifyContent:'space-between'}}>
              <Text style={{color:'#FFFFFF',fontSize:16, marginLeft:3, marginTop:2, fontFamily:Fonts.Font_Medium}}>{drawerLabel}</Text>
              </View>
              </View>
            </>
        }
        focused={
          state.routes.findIndex(
            (e) => e.name === route.name
          ) === state.index
        }
        onPress={() => navigation.navigate(route.name)}
    />:null
    )
})
    
}

const prepareVidyarthiVeluguGroup = (value) => {
  return state.routes?.map((route, index) => {
    const {
      drawerLabel,
      activeTintColor,
      groupName
    } = descriptors[route.key].options;
    return (
      groupName==='vidyarthi-velugu'?
    <DrawerItem
        key={route.key}
        label={
          ({color}) =>
          <>
          <View style={styles.accordHeader1}>
            <Icon style={{paddingRight:15,width:40,textAlign:'right'}} name='file-pdf-o' size={25} color="#FFFFFF" />
              <View style={{flex: 1,flexDirection: 'row', justifyContent:'space-between'}}>
                <Text style={{color:'#FFFFFF',fontSize:16, marginLeft:3, marginTop:2, fontFamily:Fonts.Font_Medium}}>{drawerLabel}</Text>
              </View>
              </View>
            </>
        }
        focused={
          state.routes.findIndex(
            (e) => e.name === route.name
          ) === state.index
        }
        onPress={() => navigation.navigate(route.name)}
    />:null
    )
})
    
}

const prepareCalendarGroup = (value) => {
  return state.routes?.map((route, index) => {
    const {
      drawerLabel,
      activeTintColor,
      groupName
    } = descriptors[route.key].options;
    return (
      groupName==='calendar'?
    <DrawerItem
        key={route.key}
        label={
          ({color}) =>
          <>
          <View style={styles.accordHeader1}>
            <Icon style={{paddingRight:15,width:40,textAlign:'right'}} name='calendar' size={25} color="#FFFFFF" />
              <View style={{flex: 1,flexDirection: 'row', justifyContent:'space-between'}}>
                <Text style={{color:'#FFFFFF',fontSize:16,marginLeft:3, marginTop:2, fontFamily:Fonts.Font_Medium}}>{drawerLabel}</Text>
              </View>
              </View>
            </>
        }
        focused={
          state.routes.findIndex(
            (e) => e.name === route.name
          ) === state.index
        }
        onPress={() => navigation.navigate(route.name)}
    />:null
    )
})
    
}

const prepareDonateFreeWillGroup = (value) => {
  return state.routes?.map((route, index) => {
    const {
      drawerLabel,
      activeTintColor,
      groupName
    } = descriptors[route.key].options;
    return (
      groupName==='donate-free-will'?
    <DrawerItem
        key={route.key}
        label={
          ({color}) =>
          <>
          <View style={styles.accordHeader1}>
            <Icon style={{paddingRight:15, width:40,textAlign:'right'}} name='rupee' size={25} color="#FFFFFF" />
              <View style={{flex: 1,flexDirection: 'row', justifyContent:'space-between'}}>
                <Text style={{color:'#FFFFFF',fontSize:16, marginLeft:3, marginTop:2, fontFamily:Fonts.Font_Medium}}>{drawerLabel}</Text>
              </View>
              </View>
            </>
        }
        focused={
          state.routes.findIndex(
            (e) => e.name === route.name
          ) === state.index
        }
        onPress={() => navigation.navigate(route.name)}
    />:null
    )
})
    
}

_googleAuth = async () => {
  
  try {
      const userInfo = await GoogleSignin.signIn();
      
      //logfunction("Google response ", userInfo)

      if (userInfo.idToken != '') {

          let email = userInfo.user.email;
          let image = userInfo.user.photo ? userInfo.user.photo : '';
          let sendData = new FormData();
          sendData.append("email", email)
          sendData.append("password", '123456789')
          sendData.append("creation", 'G')
          sendData.append('firebase_token', '')
          sendData.append('firstname', userInfo.user.name)
          sendData.append('telephone', '1111111111')
          sendData.append('device_id', deviceId );
          sendData.append('device_name', deviceName );

          
          setFormData({
              ...formData,
              loading: true
          });

          //login to our server 🧛🏻‍♀️
          try {
              getApi.postData(
                  'user/socialLogin',
                  sendData,
              ).then((response => {
                  
                  //logfunction("Social RESPONSE ", response)
                  if (response.status == 1) {
                      //logfunction("RESPONSE ", 'Success')
                      setFormData({
                          ...formData,
                          email: null,
                          password: null,
                          loading: false
                      });
                      props.doLogin(response, '');
                  }
              }));
          } catch (error) {
            console.log(error);
              logfunction("Error", error)
              setFormData({
                  ...formData,
                  loading: false
              });
          }
      }
  } catch (error) {
      console.log(error);
      logfunction("Errors ", error)
  }
}
const prepareLogInGroup = (value) => {
  return state.routes?.map((route, index) => {
    const {
      drawerLabel,
      activeTintColor,
      groupName
    } = descriptors[route.key].options;
    return (
      groupName==='login'?
    <DrawerItem
        key={route.key}
        label={
          ({color}) =>
          <>
          <View style={styles.accordHeader1}>
            <Icon style={{paddingRight:15, width:40,textAlign:'right'}} name='sign-in' size={25} color="#FFFFFF" />
              <View style={{flex: 1,flexDirection: 'row', justifyContent:'space-between'}}>
                <Text style={{color:'#FFFFFF',fontSize:16, marginLeft:3, marginTop:2, fontFamily:Fonts.Font_Medium}}>{drawerLabel}</Text>
              </View>
              </View>
            </>
        }
        focused={
          state.routes.findIndex(
            (e) => e.name === route.name
          ) === state.index
        }
        onPress={() => _googleAuth()}
    />:null
    )
})
    
}

const preparePrayerPointsGroup = (value) => {
  return state.routes?.map((route, index) => {
    const {
      drawerLabel,
      activeTintColor,
      groupName
    } = descriptors[route.key].options;
    return (
      groupName==='prayer-points'?
    <DrawerItem
        key={route.key}
        label={
          ({color}) =>
          <>
          <View style={styles.accordHeader1}>
            <Icon style={{paddingRight:15,textAlign:'right'}} name='list-ul' size={25} color="#FFFFFF" />
              <View style={{flex: 1,flexDirection: 'row', justifyContent:'space-between'}}>
                <Text style={{color:'#FFFFFF',fontSize:16, marginTop:2, fontFamily:Fonts.Font_Medium}}>{drawerLabel}</Text>
              </View>
              </View>
            </>
        }
        focused={
          state.routes.findIndex(
            (e) => e.name === route.name
          ) === state.index
        }
        onPress={() => navigation.navigate(route.name)}
    />:null
    )
})
    
}

const prepareAudioSongsGroup = (value) => {
  return state.routes?.map((route, index) => {
    const {
      drawerLabel,
      activeTintColor,
      groupName
    } = descriptors[route.key].options;
    return (
      groupName==='audio-songs'?
    <DrawerItem
        key={route.key}
        label={
          ({color}) =>
          <>
          <View style={styles.accordHeader1}>
            <Icon style={{paddingRight:15,width:40,textAlign:'right'}} name='volume-up' size={27} color="#FFFFFF" />
              <View style={{flex: 1,flexDirection: 'row', justifyContent:'space-between'}}>
                <Text style={{color:'#FFFFFF',fontSize:16, marginLeft:3, marginTop:2, fontFamily:Fonts.Font_Medium}}>{drawerLabel}</Text>
              </View>
              </View>
            </>
        }
        focused={
          state.routes.findIndex(
            (e) => e.name === route.name
          ) === state.index
        }
        onPress={() => navigation.navigate(route.name)}
    />:null
    )
})
    
}
const prepareSearchTheScriptureGroup = (value) => {
  return state.routes?.map((route, index) => {
    const {
      drawerLabel,
      activeTintColor,
      groupName
    } = descriptors[route.key].options;
    return (
      groupName==='search-the-scripture'?
    <DrawerItem
        key={route.key}
        label={
          ({color}) =>
          <>
          <View style={styles.accordHeader1}>
            <Icon style={{paddingRight:15,width:40,textAlign:'right'}} name='file-text-o' size={27} color="#FFFFFF" />
              <View style={{flex: 1,flexDirection: 'row', justifyContent:'space-between'}}>
                <Text style={{color:'#FFFFFF',fontSize:16, marginLeft:3, marginTop:2, fontFamily:Fonts.Font_Medium}}>{drawerLabel}</Text>
              </View>
              </View>
            </>
        }
        focused={
          state.routes.findIndex(
            (e) => e.name === route.name
          ) === state.index
        }
        onPress={() => navigation.navigate(route.name)}
    />:null
    )
})
    
}

const shareApp = ()=>{
  const shareOptions = {
    message:'\n UESI - Telangana Android App: \n https://play.google.com/store/apps/details?id=com.uesits.geethavali\n\n'
  };
  Share.open(shareOptions)
  .then((res) => {
      
  })
  .catch((err) => {
      err && console.log(err);
  });
}
const prepareAhareAppGroup = (value) => {
  return state.routes?.map((route, index) => {
    const {
      drawerLabel,
      activeTintColor,
      groupName
    } = descriptors[route.key].options;
    return (
      groupName==='share-app'?
    <DrawerItem
        key={route.key}
        label={
          ({color}) =>
          <>
          <View style={styles.accordHeader1}>
            <Icon style={{paddingRight:15,width:40,textAlign:'right'}} name='share-square-o' size={25} color="#FFFFFF" />
              <View style={{flex: 1,flexDirection: 'row', justifyContent:'space-between'}}>
                <Text style={{color:'#FFFFFF',fontSize:16, marginLeft:3, marginTop:2, fontFamily:Fonts.Font_Medium}}>{drawerLabel}</Text>
              </View>
              </View>
            </>
        }
        focused={
          state.routes.findIndex(
            (e) => e.name === route.name
          ) === state.index
        }
        onPress={() => shareApp()}
    />:null
    )
})
    
}

const prepareAboutUsGroup = (value) => {
  return state.routes?.map((route, index) => {
    const {
      drawerLabel,
      activeTintColor,
      groupName
    } = descriptors[route.key].options;
    return (
      groupName==='about-us'?
    <DrawerItem
        key={route.key}
        label={
          ({color}) =>
          <>
          <View style={styles.accordHeader1}>
            <Icon style={{paddingRight:15,width:40,textAlign:'right'}} name='group' size={25} color="#FFFFFF" />
              <View style={{flex: 1,flexDirection: 'row', justifyContent:'space-between'}}>
                <Text style={{color:'#FFFFFF',fontSize:16, marginLeft:3, marginTop:2, fontFamily:Fonts.Font_Medium}}>{drawerLabel}</Text>
              </View>
              </View>
            </>
        }
        focused={
          state.routes.findIndex(
            (e) => e.name === route.name
          ) === state.index
        }
        onPress={() => navigation.navigate(route.name)}
    />:null
    )
})
    
}

const prepareFeedbackGroup = (value) => {
  return state.routes?.map((route, index) => {
    const {
      drawerLabel,
      activeTintColor,
      groupName
    } = descriptors[route.key].options;
    return (
      groupName==='feedback'?
    <DrawerItem
        key={route.key}
        label={
          ({color}) =>
          <>
          <View style={styles.accordHeader1}>
            <Icon style={{paddingRight:15,width:40,textAlign:'right'}} name='pencil-square-o' size={25} color="#FFFFFF" />
              <View style={{flex: 1,flexDirection: 'row', justifyContent:'space-between'}}>
                <Text style={{color:'#FFFFFF',fontSize:16, marginLeft:3, marginTop:2, fontFamily:Fonts.Font_Medium}}>{drawerLabel}</Text>
              </View>
              </View>
            </>
        }
        focused={
          state.routes.findIndex(
            (e) => e.name === route.name
          ) === state.index
        }
        onPress={() => navigation.navigate(route.name)}
    />:null
    )
})
    
}

const prepareContactUsGroup = (value) => {
  return state.routes?.map((route, index) => {
    const {
      drawerLabel,
      activeTintColor,
      groupName
    } = descriptors[route.key].options;
    return (
      groupName==='contact-us'?
    <DrawerItem
        key={route.key}
        label={
          ({color}) =>
          <>
          <View style={styles.accordHeader1}>
            <Icon style={{paddingRight:15,width:40,textAlign:'right'}} name='phone' size={25} color="#FFFFFF" />
              <View style={{flex: 1,flexDirection: 'row', justifyContent:'space-between'}}>
                <Text style={{color:'#FFFFFF',fontSize:16,marginLeft:3, marginTop:2, fontFamily:Fonts.Font_Medium}}>{drawerLabel}</Text>
              </View>
              </View>
            </>
        }
        focused={
          state.routes.findIndex(
            (e) => e.name === route.name
          ) === state.index
        }
        onPress={() => navigation.navigate(route.name)}
    />:null
    )
})
    
}

const prepareTermsAndConditionsGroup = (value) => {
  return state.routes?.map((route, index) => {
    const {
      drawerLabel,
      activeTintColor,
      groupName
    } = descriptors[route.key].options;
    return (
      groupName==='terms-and-conditions'?
    <DrawerItem
        key={route.key}
        label={
          ({color}) =>
          <>
          <View style={styles.accordHeader1}>
            <Icon style={{paddingRight:15,width:40,textAlign:'right'}} name='warning' size={25} color="#FFFFFF" />
              <View style={{flex: 1,flexDirection: 'row', justifyContent:'space-between'}}>
                <Text style={{color:'#FFFFFF',fontSize:16, marginLeft:3, marginTop:2, fontFamily:Fonts.Font_Medium}}>{drawerLabel}</Text>
              </View>
              </View>
            </>
        }
        focused={
          state.routes.findIndex(
            (e) => e.name === route.name
          ) === state.index
        }
        onPress={() => navigation.navigate(route.name)}
    />:null
    )
})
    
}

const preparePrivacyPolicyGroup = (value) => {
  return state.routes?.map((route, index) => {
    const {
      drawerLabel,
      activeTintColor,
      groupName
    } = descriptors[route.key].options;
    return (
      groupName==='privacy-policy'?
    <DrawerItem
        key={route.key}
        label={
          ({color}) =>
          <>
          <View style={styles.accordHeader1}>
            <Icon style={{paddingRight:15,width:40,textAlign:'right'}} name='file-text-o' size={25} color="#FFFFFF" />
              <View style={{flex: 1,flexDirection: 'row', justifyContent:'space-between'}}>
                <Text style={{color:'#FFFFFF',fontSize:16, marginLeft:3, marginTop:2, fontFamily:Fonts.Font_Medium}}>{drawerLabel}</Text>
              </View>
              </View>
            </>
        }
        focused={
          state.routes.findIndex(
            (e) => e.name === route.name
          ) === state.index
        }
        onPress={() => navigation.navigate(route.name)}
    />:null
    )
})
    
}

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{height:140,width:'100%'}}>
      <Image
        source={sidenavImage}
        style={styles.sideMenuProfileIcon}
      />
      </View>
      <DrawerContentScrollView {...props} style={{backgroundColor:Colors().themeColor}}>
      <View style={styles.sectionContainer}>
      {prepareHomeGroup()}
    </View>
    <View style={styles.sectionContainer}>
    {prepareBookStoreGroup()}
    </View>
      <View style={styles.sectionContainer}>
        <AccordionItem title='Vidyarthi Geethavali' titleKey='song-book'>
        {prepareSongBookGroup()}
        </AccordionItem>
    </View>
    {/* {props.songsDonated==''?<View style={styles.sectionContainer}>
    {prepareDonateForAllSongsGroup()}
    </View>:null} */}
    <View style={styles.sectionContainer}>
      {prepareAudioSongsGroup()}
    </View>

    <View style={styles.sectionContainer}>
      {prepareSearchTheScriptureGroup()}
    </View>
    
    <View style={styles.sectionContainer}>
        <AccordionItem title="TRICON" titleKey='tricon'>
        {prepareTriconGroup()}
        </AccordionItem>
    </View>

    <View style={styles.sectionContainer}>
      {prepareDFDProgramsGroup()}
    </View>

    <View style={styles.sectionContainer}>
      {prepareUpcommingProgramsGroup()}
    </View>

    <View style={styles.sectionContainer}>
        <AccordionItem title='Magazines' titleKey='magazines'>
        {prepareMagazinesGroup()}
        </AccordionItem>
    </View>
    {/* <View style={styles.sectionContainer}>
      {prepareVidyarthiVeluguGroup()}
    </View> */}
    <View style={styles.sectionContainer}>
      {prepareCalendarGroup()}
    </View>
    <View style={styles.sectionContainer}>
      {prepareDonateFreeWillGroup()}
    </View>
    {!USER_AUTH?<View style={styles.sectionContainer}>
      {prepareLogInGroup()}
    </View>:null}
    <View style={styles.sectionContainer}>
      {preparePrayerPointsGroup()}
    </View>
    <Divider style={{ backgroundColor: '#fff',marginTop:20 }} />
    <View style={styles.sectionContainer}>
      {prepareFeedbackGroup()}
    </View>
    <View style={styles.sectionContainer}>
      {prepareAhareAppGroup()}
    </View>
    <View style={styles.sectionContainer}>
      {prepareAboutUsGroup()}
    </View>
    <View style={styles.sectionContainer}>
      {prepareContactUsGroup()}
    </View>
    
    <View style={styles.sectionContainer}>
      {prepareTermsAndConditionsGroup()}
    </View>
    <View style={styles.sectionContainer}>
      {preparePrivacyPolicyGroup()}
    </View>
    
      {/* {state.routes.map((route) => {
        console.log(route);
          const {
            drawerLabel,
            activeTintColor,
            groupName
          } = descriptors[route.key].options;
          if (lastGroupName !== groupName) {
            newGroup = true;
            sameGroup = false;
            lastGroupName = groupName;
          } else {
            newGroup = false;
            sameGroup = true;
            lastGroupName = groupName;
          }
          console.log(sameGroup);
          return (
            <>
                <View style={styles.sectionContainer}>
                  <AccordionItem title={groupName}>
                  <DrawerItem
                      key={route.key}
                      label={
                        ({color}) =>
                          <Text style={{color}}>
                            {drawerLabel}
                          </Text>
                      }
                      focused={
                        state.routes.findIndex(
                          (e) => e.name === route.name
                        ) === state.index
                      }
                      activeTintColor={activeTintColor}
                      onPress={() => navigation.navigate(route.name)}
                  />
                  </AccordionItem>
                  </View>
            </>
          );
        })} */}
        {/* <AccordionItem title="Song Book">
          <DrawerItem
          label="Telugu Songs"
          onPress={teluguSongBookClicked}
        />
        <DrawerItem
          label="English Songs"
          onPress={englishSongBookClicked}
        />
        <DrawerItem
          label="Hindi Songs"
          onPress={hindiSongBookClicked}
        />
        </AccordionItem> */}
        {/* <DrawerItemList {...props} /> */}
        {/* <DrawerItem
          label="Visit Us"
          onPress={() => Linking.openURL('https://aboutreact.com/')}
        />
        <View style={styles.customItem}>
          <Text
            onPress={() => {
              Linking.openURL('https://aboutreact.com/');
            }}>
            Rate Us
          </Text>
          <Image
            source={{uri: BASE_PATH + 'star_filled.png'}}
            style={styles.iconStyle}
          />
        </View> */}
      </DrawerContentScrollView>
      {/* <Text
        style={{
          fontSize: 16,
          textAlign: 'center',
          color: 'grey'
        }}>
        www.aboutreact.com
      </Text> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sideMenuProfileIcon: {
    width: '100%',
    height: 140,
    //borderRadius: 10,
    alignSelf: 'center',
  },
  iconStyle: {
    width: 15,
    height: 15,
    marginHorizontal: 5,
  },
  customItem: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  container: {
    flex: 1
  },
  accordContainer: {
    paddingBottom: 0
  },
  accordHeader: {
    padding: 10,
    color: '#FFFFFF',
    flex: 1,
    flexDirection: 'row'
  },
  accordHeader1: {
    padding: -5,
    margin: -5,
    color: '#FFFFFF',
    flex: 1,
    flexDirection: 'row',
    justifyContent:"flex-start", alignItems:'center'
  },
  accordTitle: {
    fontSize: 18,
    color: '#FFFFFF',
    //fontWeight: 'bold'
  },
  accordBody: {
    paddingLeft: 20
  },
  textSmall: {
    fontSize: 18
  },
  seperator: {
    height: 12
  }
});

function mapStateToProps(state) {
  return {
      selectedSong: state.song.selectedSong,
      songType: state.song.songType,
      magazineType: state.song.magazineType,
      songsDonated: state.song.songsDonated,
      triconType: state.song.triconType,
      USER_AUTH: state.auth.USER_AUTH,
  }
}

const mapDispatchToProps = dispatch => (
  bindActionCreators({
      setSongType,
      setMagazineType,
      setSongsDonated,
      setTriconType,
      doLogin
  }, dispatch)
);
export default connect(mapStateToProps, mapDispatchToProps) (CustomSidebarMenu);