import React, { useEffect } from "react";
import {
    View,
    TouchableOpacity,
    Text,
    useWindowDimensions,
    StyleSheet,
    StatusBar,
    ScrollView,
    Image,
    Alert,
    Linking,
    ToastAndroid,
    SafeAreaView,
    Modal,
    Pressable
} from "react-native";
import { Input } from "native-base"
import { connect } from 'react-redux';
import {
    OtrixContainer, OtrixHeader, OtrixDivider, OtirxBackButton, OtrixContent, OtrixLoader,OtirxHomeButton
} from '@component';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { GlobalStyles, Colors } from '@helpers';
import Fonts from "@helpers/Fonts";
import getApi from "@apis/getApi";
import { logfunction } from "@helpers/FunctionHelper";
import RenderHtml from 'react-native-render-html';
import FastImage from 'react-native-fast-image';
import { Button,Card,Avatar,List, Divider } from 'react-native-paper';
import { position } from "native-base/lib/typescript/theme/styled-system";
import { homeScreen } from '../common';
import AsyncStorage from '@react-native-community/async-storage';
import DeviceInfo from 'react-native-device-info';
import { useNetInfo } from "@react-native-community/netinfo";
import messaging from '@react-native-firebase/messaging';
import firebase from '@react-native-firebase/app';
import { bindActionCreators } from 'redux';
import { addToWishList, storeFCM, doLogin, setReloginVerified } from '@actions';
import { getUniqueId, getManufacturer, getDeviceName } from 'react-native-device-info';
import {
    GoogleSignin,
    GoogleSigninButton,
    statusCodes,//
} from '@react-native-google-signin/google-signin';
GoogleSignin.configure({
    webClientId: '910722162039-gisd4ja9a00dhor501jckvajhsk47c57.apps.googleusercontent.com',
    scopes: ['profile', 'email']
});

function UESIHomeScreen(props) {
    const [state, setState] = React.useState({  email: null, homePageData: [], loading: true, profileImageURL: null });
    const { width } = useWindowDimensions();
    const [expanded, setExpanded] = React.useState(true);
    const handlePress = () => setExpanded(!expanded);
    const netInfo = useNetInfo();
    const [homePageStoredData, setHomeData] = React.useState(null);
    const [modalVisible, setModalVisible] = React.useState(false);
    const [updateAvailable, setUpdateAvailable] = React.useState(false);
    const [emailRequired, setEmailRequired] = React.useState(false);
    const [validEmail, setValidEmail] = React.useState('');
    const [deviceId, setDeviceId] = React.useState('');
    const [deviceName, setDeviceName] = React.useState('');
    const [fcmTocken, setFcmTocken] = React.useState('');

    useEffect(() => {
        // get Device name & Device ID
         getUniqueId().then(data=>{
      
            setDeviceId(data);
        });
        getDeviceName().then(data=>{
           
            setDeviceName(data);
        });

        // Initialize Firebase
        if (!firebase.apps.length) {
            
            firebase.initializeApp({
                apiKey: 'AIzaSyCZZPbHfrcZrjDoHiXJiCGVnzFhUlcIdgA',
                authDomain: 'uesits-55284.firebaseapp.com',
                databaseURL: '',
                projectId: 'uesits-55284',
                storageBucket: 'uesits-55284.appspot.com',
                appId: "1:839752534297:android:42dd721c8a14ee7de5dd88",
                messagingSenderId: '839752534297'
            });
        }

        // Check App update
        async function CheckAppUpdate() {
            
            try {
                getApi.getData(
                    "getAppVersion",
                    []
                    ).then(( async response => {
                    
                    if(response.status === 1){
                        
                      if(Number(response.data[0].version)!=Number(DeviceInfo.getVersion())){
                            //setUpdateAvailable(true);
                            Alert.alert('New Update:', response.data[0].update_message, [
                                {text: 'Update', onPress: () => okayPressed(response.data[0].update_url)},
                              ]);
                      }else{
                        getCustomerData();
                      }
                    }else{
                        
                    }
                }));
            } catch (error) {
              console.log(error);
            }
          }

        function okayPressed(url){
            Linking.openURL(url);
        }
        
        // get Songs
        async function fetchData() {
       
            await AsyncStorage.getItem('TOTAL_SONGS').then(data=>{
              if(data){
                CheckAppUpdate();
              }else{
                AsyncStorage.setItem('SONG_UPDATE_VERSION','1');
                callAPI();
              }
            });
          }
          async function callAPI() {
             try {
              getApi.getData(
                  "getSongs",
                  [],
              ).then(( async response => {
                CheckAppUpdate();
                  if(response.status === 1){
                    await AsyncStorage.setItem('TOTAL_SONGS', JSON.stringify(response.data));
                  }
              }));
          } catch (error) {
            CheckAppUpdate();
            console.log(error);
          }
          }

          fetchData();

         // Do user Login
         function login(email1,password){
            let sendData = new FormData();
            sendData.append('email', email1);
            sendData.append('password', password);
            sendData.append('firebase_token', fcmTocken);
            sendData.append('device_id', deviceId );
            sendData.append('device_name', deviceName );
            try {
                getApi.postData(
                    'user/relogin',
                    sendData,
                ).then((response => {
                    if (response.status == 1) {
                        props.doLogin(response, '');
                    }
                }));
            } catch (error) {
                console.log(error);
                
            }
    }
    // Get Customer Data & Check Fire base updated or not
    async function getCustomerData(tocken) {
        await AsyncStorage.getItem("CUSTOMER_DATA").then(data=>{
            if(data){
                data = JSON.parse(data);
                if(data.id){
                    getUserAccessData(data.id);
                    //checkFCM(tocken,data.email);
                }else{
                    //checkRelogin(data);
                    _googleAuth();
                }
            }else{
                //checkRelogin(data);
                _googleAuth();
            }
            //setCustmerData(JSON.parse(data));
        });
    }

        const getUserAccessData = (user_id) => {
            let sendData = new FormData();
            sendData.append('user_id', user_id);
            //sendData.append('status', '1');
            try {
                getApi.postData(
                    'user/getUserAccessData',
                    sendData,
                ).then((response => {
                    
                    logfunction("RESPONSE ", response)
                    if (response.status == 1) {
                        let user_access = {};
                        if(response.data && response.data.length>0){
                            response.data.map((access,index)=>{
                                user_access[access.module_type] = access.status;
                                if(index == response.data.length-1){
                                    AsyncStorage.setItem('USER_ACCESS', JSON.stringify(user_access));
                                }
                            });
                        }
                    }
                    else {}
                }));
            } catch (error) {
                logfunction("Error", error)
            }
    }
    }, [props.navigation]);

     //google sigin
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

              
                setState({
                    ...state,
                    loading: true
                });

                //login to our server 🧛🏻‍♀️
                try {
                    getApi.postData(
                        'user/socialLogin',
                        sendData,
                    ).then((response => {
                        
                        logfunction("Social RESPONSE ", response)
                        if (response.status == 1) {
                            logfunction("RESPONSE ", 'Success')
                            setState({
                                ...state,
                                email: null,
                                password: null,
                                loading: false
                            });
                            props.doLogin(response, '');
                        }
                        // else {
                        //     //navigation part  😎
                        //     if (response.new == 1) {
                        //         props.navigation.navigate("SocialRegisterScreen", { s_email: email, s_socialID: userInfo.user.id, s_image: image, s_firstName: userInfo.user.name, s_lastName: '', s_creation: 'G' });
                        //     }
                        //     else {
                        //         setState({
                        //             ...state,
                        //             type: 'error',
                        //             message: response.message,
                        //             loading: false
                        //         });
                        //         setTimeout(() => {
                        //             setState({
                        //                 ...state,
                        //                 message: null,
                        //                 loading: false
                        //             })
                        //         }, 3000);
                        //     }

                        // }
                    }));
                } catch (error) {
                    console.log(error);
                    logfunction("Error", error)
                    setState({
                        ...state,
                        loading: false
                    });
                }

                //  this.setState({
                // socialName: userInfo.user.name,
                // socialEmail: userInfo.user.email,
                // creation_mode: 'G',
                // social_link: userInfo.user.photo,
                //  });
                // const data = new FormData()
                // data.append("email", userInfo.user.name)
                // data.append("name", userInfo.user.email)
                // data.append("fcm_key", this.state.fcmToken)
                // this.props.socialLogin(data, this.state.returnTo, this.state.stringReturn);
            }
        } catch (error) {
            console.log(error);
            logfunction("Errors ", error)
        }
    }

//     const login = (email1,password) =>{
//         console.log('login');
//         let sendData = new FormData();
//         sendData.append('email', email1);
//         sendData.append('password', password);
//         sendData.append('firebase_token', fcmTocken);
//         sendData.append('device_id', deviceId );
//         sendData.append('device_name', deviceName );
//         try {
//             getApi.postData(
//                 'user/relogin',
//                 sendData,
//             ).then((response => {
//                 setModalVisible(false);
//                 if (response.status == 1) {
//                     props.doLogin(response, '');
//                 }else if(response.status == 2){
//                     setValidEmail('Enter a valid Email');
//                 }
//             }));
//         } catch (error) {
//             console.log(error);
            
//         }
// }
    return (
        // <>
        <SafeAreaView>
        <View customStyles={{ backgroundColor: Colors().light_white }}>
            <TouchableOpacity style={{position:'absolute',top:10,zIndex:9,left:10}} onPress={() => props.navigation.toggleDrawer()}>
                <OtirxHomeButton />
            </TouchableOpacity>
            </View>
        <ScrollView>
        <View customStyles={{ backgroundColor: Colors().light_white }}>
            {/* <TouchableOpacity style={{position:'absolute',top:10,zIndex:9,left:10}} onPress={() => props.navigation.toggleDrawer()}>
                <OtirxHomeButton />
            </TouchableOpacity> */}
            <Image
              source={require("../assets/images/home_screen.jpeg")}
              style={{
                height: 250,
                width: width
              }}
            />
       </View >
       
       {/* <View style={styles1.centeredView}>
       <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          
          //setModalVisible(!modalVisible);
        }}>
        <View style={styles1.centeredView}>
          <View style={styles1.modalView}>
            <Text style={styles1.modalText}>Confirm Your Email</Text>
            <Input variant="outline" placeholder='Email Address' style={GlobalStyles.textInputStyle}
                        keyboardType="email-address"
                        onChangeText={(value) => { setState({ ...state, email: value })}}
                    />
                    {emailRequired?<Text style={{color:'#d10000'}}>Email is Required</Text>:null}
                    {validEmail!=''?<Text style={{color:'#d10000'}}>{validEmail}</Text>:null}
            <Pressable
              style={[styles1.button, styles1.buttonClose]}
              onPress={() => confirmClick()}>
              <Text style={styles1.textStyle}>Confirm</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
       </View> */}
       <View>
       
        <Card mode="outlined">
            <Card.Title title={<Text style={styles.cardTitle}>Vision</Text> }
            />
            <Card.Content>
                <Text style={[styles.contentText,{marginTop:-10}]}>Transformed students impacting the campuses and the nation as disciples of the Lord Jesus Christ</Text>
            </Card.Content>
        </Card>
       </View>
       <View>
        <Card mode="outlined">
            <Card.Title title={<Text style={styles.cardTitle}>Mission</Text> }
            />
            <Card.Content>
                <Text variant="bodyMedium" style={[styles.contentText,{marginTop:-10}]}>UESI seeks to evangelize post-matric students in India, nurture them as disciples of the Lord Jesus Christ, that they may serve the Church and the society</Text>
            </Card.Content>
        </Card>
       </View>
       <View>
        <Card mode="outlined">
            <Card.Title title={<Text style={styles.cardTitle}>Aims</Text> }/>
            <Card.Content>
                <List.Accordion style={styles.ListAccordion}
                    title="1. Evangelism" 
                    left={props => <Text style={styles.contentText}></Text> }>
                        <View style={{marginLeft:-60}}>
                    <Text style={styles.contentText}>      To present the claims of Christ so that other students may come to a personal experience of Jesus Christ as Saviour, Lord and God through the new birth. Exposition: Evangelism is the cutting edge of UESI. This must be the hall mark of every EU. Student’s community has been a force to reckon with. They have enormous potentials. They shape the destiny of the future India. Hence many political parties and religious movements appeal to their psychology and exploit them for their ends. God has called us to reach the students with the claims of Jesus Christ. The need of the hour in India is regeneration (having new life). It could be done by the effective implementation of our first aim. The aim states clearly that our field is the student community only. Students stay in the campus only for the short time. If they are not reached during their student days, it will be difficult to reach them afterwards</Text>
                    
                    <Text style={styles.contentText}>Suggested Activities:</Text>
                    
                    <Text style={styles.contentText}>1. One day Retreats.</Text>
                    
                    <Text style={styles.contentText}>2. Musical Rallies / Evenings.</Text>
                    
                    <Text style={styles.contentText}>3. Evangelistic Camps.</Text>
                    
                    <Text style={styles.contentText}>4. Tracts Distribution.</Text>
                    
                    <Text style={styles.contentText}>5. Personal Evangelism.</Text>
                    
                    <Text style={styles.contentText}>6. Informal Evangelistic Gathering.</Text>
                    
                    <Text style={styles.contentText}>7. Undated Evangelistic Magazine.</Text>
                    
                    <Text style={styles.contentText}>8. Season of Evangelism.</Text>
                    
                    <Text style={styles.contentText}>9. Evangelistic Christmas Programme.</Text>
                    </View>
                </List.Accordion>
                <OtrixDivider></OtrixDivider>
                <List.Accordion style={styles.ListAccordion}
                    title="2. Fellowship"
                    left={props => <Text style={styles.contentText}></Text> }>
                        <View style={{marginLeft:-60}}>
                    <Text style={styles.contentText}>      To have Fellowship with all students of like precious faith for mutual help and growth in the Christian life, especially by means of Bible Study and Prayer, and to encourage one another in witness for Christ” Exposition: The second aim show us the way to the healthy growth as Christians. The purpose is to help the believing students to grow in Christian life. Bible Study and Prayer are the ways of building the basis for the true fellowship and oneness in Christ.</Text>
                    
                    <Text style={styles.contentText}>Suggested Activities:</Text>
                    
                    <Text style={styles.contentText}>1. Bible Study (GBS) and Prayer.</Text>
                    
                    <Text style={styles.contentText}>2. Prayer Meet.</Text>
                    
                    <Text style={styles.contentText}>3. Fellowship Meeting.</Text>
                    
                    <Text style={styles.contentText}>4. Believers Meet.</Text>
                    
                    <Text style={styles.contentText}>5. Discipleship Training Camp.</Text>
                    
                    <Text style={styles.contentText}>6. Leadership Training Camp.</Text>
                    
                    <Text style={styles.contentText}>7. Committee Members Training Camp.</Text>
                    
                    <Text style={styles.contentText}>8. Annual Thanksgiving Meet.</Text>
                    
                    <Text style={styles.contentText}>9. Informal activities.</Text>
                    
                    <Text style={styles.contentText}>9. Visit to a nearby EU.</Text>
                    
                    <Text style={styles.contentText}>10. Fellowship Evenings with EGF families</Text>
                    </View>
                </List.Accordion>
                <OtrixDivider></OtrixDivider>
                <List.Accordion style={styles.ListAccordion}
                    title="3. Testimony"
                    left={props => <Text style={styles.contentText}></Text> }>
                        <View style={{marginLeft:-60}}>
                    <Text style={styles.contentText}>      To raise a testimony in the colleges to the truths of the Historic Christian faith and to present its message for the whole of life and problems of mankind” Exposition: The EU students are to show, through their lives in the campuses, that they are different because of the Lord they believe in and the convictions they by. In order to present the Gospel as the solution, one needs to be aware of the problems. This means sharing the Gospel as well as raising a Christian voice when there is injustice, ragging, discrimination etc... on the campus.</Text>
                    
                    <Text style={styles.contentText}>Suggested Activities:</Text>
                    
                    <Text style={styles.contentText}>1. Doctrinal Messages.</Text>
                    
                    <Text style={styles.contentText}>2. Special Doctrine.</Text>
                    
                    <Text style={styles.contentText}>3. Science Lectures.</Text>
                    
                    <Text style={styles.contentText}>4. Gifting Books to Library.</Text>
                    
                    <Text style={styles.contentText}>5. Articles for College Magazine.</Text>
                    
                    </View>
                </List.Accordion>
                <OtrixDivider></OtrixDivider>
                <List.Accordion style={styles.ListAccordion}
                    title="4. Missions"
                    left={props => <Text style={styles.contentText}></Text> }>
                        <View style={{marginLeft:-60}}>
                    <Text style={styles.contentText}>      To present God’s missionary command and so to help students discover and obey His will for them at home and abroad in world evangelization” Exposition: The first part speaks of presenting God’s command and the second part about helping the students discover and obey His will for their lives in relation to World evangelization. The students should be challenged and prepared to serve God anywhere, willing to give up ‘small ambitions’ in order to fulfill His calling.</Text>
                    
                    <Text style={styles.contentText}>Suggested Activities:</Text>
                    
                    <Text style={styles.contentText}>1. Missions Meetings.</Text>
                    
                    <Text style={styles.contentText}>2. Contact with Missionaries.</Text>
                    
                    <Text style={styles.contentText}>3. Missions Conference.</Text>
                    
                    <Text style={styles.contentText}>4. MTC</Text>
                    
                    <Text style={styles.contentText}>5. SVP</Text>
                    </View>
                </List.Accordion>
            </Card.Content>
        </Card>
       </View>
       <View>
        <Card mode="outlined">
            <Card.Title title={<Text style={styles.cardTitle}>Distinctives</Text> }/>
            <Card.Content>
                
                <Text variant="bodyMedium" style={styles.contentTitle}>Union Of Evangelical Students Of India Is:</Text>
                
                <Text style={styles.contentText}>1. Bible believing</Text>
                
                <Text style={styles.contentText}>2. Evangelical</Text>
                
                <Text style={styles.contentText}>3. Evangelistic</Text>
                
                <Text style={styles.contentText}>4. Fellowship of new life</Text>
                
                <Text style={styles.contentText}>5. Interdenominational</Text>
                
                <Text style={styles.contentText}>6. Spiritually centered</Text>
                
                <Text style={styles.contentText}>7. Financially independent</Text>
                
                <Text style={styles.contentText}>8. Indian organization</Text>
                
                <Text style={styles.contentText}>9. International in its sympathies</Text>
                
                <OtrixDivider></OtrixDivider><OtrixDivider></OtrixDivider>
                <Text variant="bodyMedium" style={styles.contentTitle}>Union Of Evangelical Students Of India Is NOT:</Text>
                
                <Text style={styles.contentText}>1. A Church</Text>
                
                <Text style={styles.contentText}>2. A Sect</Text>
                
            </Card.Content>
        </Card>
       </View>
       
       <View>
        <Card mode="outlined">
            <Card.Title title={<Text style={styles.cardTitle}>Core Values</Text> }/>
            <Card.Content>
                <List.Accordion style={styles.ListAccordion}
                    title="Introduction"
                    left={props => <Text style={styles.contentText}></Text> }>
                        <View style={{marginLeft:-60}}>
                    <Text style={styles.contentText}>      Core values are intrinsic factors, essential and enduring tenets of an organization. They are the foundational characteristics and timeless guiding principles for which the organization stands and is known for and, therefore, no compromise can be made on them under any circumstance. Core values give qualitative identity and inner focus points for an organization in its outward working for its mission and goals. Core values stand the test of time and members come to a realization of these values as they work together in common pursuit of reaching out to their vision. UESI, as a movement of God’s people in this country, has lived out these core values since its inception, enabled by the grace and power of God.</Text>
                    </View>
                </List.Accordion>
                <OtrixDivider></OtrixDivider>
                <List.Accordion style={styles.ListAccordion}
                    title="1. Centrality Of The Word Of God"
                    left={props => <Text style={styles.contentText}></Text> }>
                        <View style={{marginLeft:-60}}>
                    <Text style={styles.contentText}>      For UESI, the Word of God shall be the touchstone. It provides the standards and light for life and ministry. This envisages teaching and practising Quiet Time and Bible Study which lead to humble, honest, and thoughtful application of the Scripture in every area of life, both as students and graduates. Particularly, emphasis is focused on Bible truth as well as formation of a Christian mind and lifestyle which reflect the Lordship of Jesus Christ.</Text>
                    <OtrixDivider></OtrixDivider>
                    
                    </View>
                </List.Accordion>
                <OtrixDivider></OtrixDivider>
                <List.Accordion style={styles.ListAccordion}
                    title="2. Relationship With God"
                    left={props => <Text style={styles.contentText}></Text> }>
                        <View style={{marginLeft:-60}}>
                    <Text style={styles.contentText}>      Relationship with God is to have an intimate fellowship with God all through the day in all the things we do, say, or think. The quality of our intimacy with God will be reflected and lived out in our attitude and quality of our relationship to others. Our relationship to Christ and the Word of God should so permeate our life that our thinking and action will always be biblical. A member of UESI is required to enjoy and experience this relationship before he or she involves in the work. The regular Quite Time with God, personal study of His word and communication with God in prayer are utmost importance in the life of every believer, so that one’s involvement and activities are the result of his/her deep love for the Lord.</Text>
                    <OtrixDivider></OtrixDivider>
                    <Text style={styles.contentText}>      Truth in inner part, fellowshipping, and inner communication with the Triune God and divine guidance from within are essential for the members. We need to be God’s holy people practising His righteousness and love (first and foremost) at home, college campuses, and in our workspots. Therefore, our programmes will be focused on developing this aspect.</Text>
                    <OtrixDivider></OtrixDivider>
                    
                    </View>
                </List.Accordion>
                <OtrixDivider></OtrixDivider>
                <List.Accordion style={styles.ListAccordion}
                    title="3. Fellowship"
                    left={props => <Text style={styles.contentText}></Text> }>
                        <View style={{marginLeft:-60}}>
                    <Text style={styles.contentText}>      Fellowship represents spiritual unity among members of UESI family. We are not basically task-oriented people. While task is important, fellowship is more important. Ministry is ushered in and sustained through fellowship. This includes caring, sharing, and bearing one another in love for Christ’s sake and as enabled by the Holy Spirit. Transparent sharing of one another’s problems and confidentiality should mark the fellowship. The fellowship as a family needs to exhibit the influence of the Word of God in their lives. Nurture and discipling are received as members learn from one another when they meet as a cell group to share and study His Word. Each member of UESI family is quite unique and different in terms of call, gifts, and personhood and endeavours to minister to one another in humble dependence on God. Interdenominational stand is taken to respect each believer.</Text>
                    
                    </View>
                </List.Accordion>
                <OtrixDivider></OtrixDivider>
                <List.Accordion style={styles.ListAccordion}
                    title="4. Personal Care"
                    left={props => <Text style={styles.contentText}></Text> }>
                        <View style={{marginLeft:-60}}>
                    <Text style={styles.contentText}>      Every individual is given importance in UESI and is expected to make his unique contribution to the Kingdom of God. Each member of UESI has the privilege given by God to take care of the people of God, young or old, to enable them to blossom to their God-given potential, to lend their hands in support and building of His kingdom in this country and beyond. Thus personal evangelism, one to one discipling, and open homes are encouraged so that each individual is cared for. This will enable him to receive moral, prayer, and resource support from members of UESI family. Students will have the freedom to approach graduates to share their problems.</Text>
                    <OtrixDivider></OtrixDivider>
                    </View>
                </List.Accordion>
                <OtrixDivider></OtrixDivider>
                <List.Accordion style={styles.ListAccordion}
                    title="5. Student Initiative"
                    left={props => <Text style={styles.contentText}></Text> }>
                        <View style={{marginLeft:-60}}>
                    <Text style={styles.contentText}>      UESI ministry is a ministry among students where the initiative and direct responsibility for the witness to the Lord Jesus Christ on campuses are in the hands of the students themselves rather than fulltime workers, experienced graduates or the organization. UESI believes that students – led and enabled by the Holy Spirit – are best equipped to reach other students. They are best aware of existing philosophies and paradigms among students and they are in touch with the issues and challenges. In the EUs, students, under the initiation of the Holy Spirit, voluntarily accept the initiative and responsibility of their united witness and evangelistic outreach. They believe that this is entrusted to them by the Lord and they fulfil their charge in dependence on Him. The staff and graduates are to aid, advise, encourage, and support. They are only spiritual coaches. Students have the freedom to choose, to decide to plan, to be and to do things in the EU, as a group under the guidance of the Holy Spirit and in consultation with the senior adviser.</Text>
                    <OtrixDivider></OtrixDivider>
                    </View>
                </List.Accordion>
                <OtrixDivider></OtrixDivider>
                <List.Accordion style={styles.ListAccordion}
                    title="6. Life Of Faith And Prayer"
                    left={props => <Text style={styles.contentText}></Text> }>
                        <View style={{marginLeft:-60}}>
                    <Text style={styles.contentText}>      UESI is known as a movement of prayer. It is called to a life of faith which depends on God for all its needs and not just for finance. This value has to be part of the lives of graduates, students, and staff. Hence, the mutual help and support among members of UESI family. Students should be able to see this life of faith seen in the graduates and staff so that they are challenged to imitate them. The needs of the members as well as the movement are met by the members out of Christian love and responsibility. Public appeals and pledges are not made. Simplicity and contented life should mark the life of every member.</Text>
                    <OtrixDivider></OtrixDivider>
                    </View>
                </List.Accordion>
                <OtrixDivider></OtrixDivider>
                <List.Accordion style={styles.ListAccordion}
                    title="7. Moral Purity and Financial Integrity"
                    left={props => <Text style={styles.contentText}></Text> }>
                        <View style={{marginLeft:-60}}>
                    <Text style={styles.contentText}>      UESI shall maintain high standards of moral and ethical purity in relationships and responsibilities. UESI is committed to maintain integrity in the way we obtain financial and material resources, in maintaining accounts and in utilizing such God given resources. This principle is also applicable to all members of the fellowship.</Text>
                    <OtrixDivider></OtrixDivider>
                    </View>
                </List.Accordion>
                <OtrixDivider></OtrixDivider>
                <List.Accordion style={styles.ListAccordion}
                    title="8. Shared Leadership"
                    left={props => <Text style={styles.contentText}></Text> }>
                        <View style={{marginLeft:-60}}>
                    <Text style={styles.contentText}>      Leadership in UESI is and shall be based on Christlike humble servanthood. The focus is loving and faithful stewardship of responsibilities for His sake and for His glory.</Text>
                    <OtrixDivider></OtrixDivider>
                    <Text style={styles.contentText}>      There is no one-person-show in UESI. Decisions in the working of the movement shall be made by waiting on God, humble dependence on the leading of the Spirit, and consensus among those who are called to give direction to the movement.</Text>
                    <OtrixDivider></OtrixDivider>
                    </View>
                </List.Accordion>
                <OtrixDivider></OtrixDivider>
                <List.Accordion style={styles.ListAccordion}
                    title="9. Responsibility to society"
                    left={props => <Text style={styles.contentText}></Text> }>
                        <View style={{marginLeft:-60}}>
                    <Text style={styles.contentText}>      UESI believes that we are called to be responsible citizens of the land. This means that both individually and corporately we will obey the laws of the land be exemplary citizens of India.</Text>
                    <OtrixDivider></OtrixDivider>
                    <Text style={styles.contentText}>      UESI is called to promote peace and harmony. It is also committed to the growth and development of a just and righteous society and will take a stand against social evils and corruption.</Text>
                    <OtrixDivider></OtrixDivider>
                    </View>
                </List.Accordion>
                <OtrixDivider></OtrixDivider>
                <List.Accordion style={styles.ListAccordion}
                    title="Conclusion"
                    left={props => <Text style={styles.contentText}></Text> }>
                        <View style={{marginLeft:-60}}>
                    <Text style={styles.contentText}>      Core values are caught rather than taught. They have to be walked rather than talked about. Therefore, the members need to live out these Core Values and impart them to next generation by and through their lives as propelled by the Spirit of God.</Text>
                    <OtrixDivider></OtrixDivider>
                    <Text style={styles.contentText}>      As we look back to see how the Lord has led us thus far, it is important that we track down the core-values that have emerged in our movement and about ourselves and solemnly affirm in Christ to practise these core-values in our lives and ministries.</Text>
                    <OtrixDivider></OtrixDivider>
                    </View>
                </List.Accordion>
            </Card.Content>
        </Card>
       </View>
        
       <View>
        <Card mode="outlined">
            <Card.Title 
            title={<Text style={styles.cardTitle}>Doctrinal Basis</Text> }
            />
            <Card.Content>
                
                <Text variant="bodyMedium" style={styles.contentTitle}>Doctrinal Statement Of UESI:</Text>
                
                <Text variant="bodyMedium" style={styles.contentText}>      There are ten doctrinal statements that together form the UESI Statements of Faith. They are evangelical, interdenominational, historical and scriptural in nature and are as follows:</Text>
                
                <Text style={styles.contentText}>1. The unity of the Father, the Son and the Holy Spirit in the Godhead.</Text>
                
                <Text style={styles.contentText}>2. The Sovereignty of God in creation, revelation, redemption and final judgment.</Text>
                
                <Text style={styles.contentText}>3. The divine inspiration and infallibility of Holy Scripture (by which we understand the 66 books of the Bible), as originally given, and its supreme authority in all matters of faith and conduct.</Text>
                
                <Text style={styles.contentText}>4. The universal sinfulness and guilt of human nature since the fall, rendering man subject to God's wrath and condemnation.</Text>
                
                <Text style={styles.contentText}>5. Redemption from the guilt, penalty and power of sin only through the sacrificial death (as our Representative and Substitute) of Jesus Christ, the incarnate Son of God.</Text>
                
                <Text style={styles.contentText}>6. The resurrection of Jesus Christ from the dead.</Text>
                
                <Text style={styles.contentText}>7. The necessity of the work of the Holy Spirit to make the death of Christ effective to the individual sinner, granting him repentance towards God and faith in Jesus Christ.</Text>
                
                <Text style={styles.contentText}>8. The indwelling and work of the Holy Spirit in the believer.</Text>
                
                <Text style={styles.contentText}>9. The only holy universal Church, which is the Body of Christ, and to which all believers belong.</Text>
                
                <Text style={styles.contentText}>10. The expectation of the personal return of the Lord Jesus Christ.</Text>
                
            </Card.Content>
        </Card>
       </View>
       
       <View>
        <Card mode="outlined">
            <Card.Title title={<Text style={styles.cardTitle}>History</Text> } />
            <Card.Content>
            <List.Accordion style={styles.ListAccordion}
                    title="Humble Beginning"
                    left={props => <Text style={styles.contentText}></Text> }>
                        <View style={{marginLeft:-60}}>
                    <Text style={styles.contentText}>      A Friday evening, a group of college students meets at 190, Poonamallee High Road, Madras - the home of Prof H Enoch. This continues week after week, growing in number and in spirit. Little does the group or the Professor imagine that this is to grow into a nationwide movement of evangelical students and graduates. At roughly the same time, little groups of believing students meet in prayer cells in Christian Medical College, CMC, Vellore and in Government College of Technology, (GCT), Coimbatore with similar faith and conviction. The union of these 3 groups at a retreat in Katpadi near Vellore gives birth to Union of Evangelical Students of India (UESI) in 1954. Professor Hannington Enoch was a teacher of zoology in Visakhapatnam Medical College in Andhra Pradesh. He believed that the Lord was encouraging him to raise a student movement which would be true to the Word of God. In 1949 he was transferred to Presidency College, Madras. Prof. Enoch shared his concern with students and senior friends from different churches in the city. The prayer meeting in Madras was the result of his inner urge to begin a fellowship of university students, though he was unaware of the work of God abroad through evangelical student movements like Inter Varsity Fellowship (IVP), now Universities and Colleges Christian Fellowship (UCCF) of UK and Inter Varsity Christian Fellowship (IVCF) of USA. He did not realize that he was being instrumental in initiating a student witness in India. A little fellowship group was brought into being and it met in the home of Prof. Enoch. He invited other Bible-believing leaders to attend the fellowship that met in his house. Among them were Ms H Eckmann, David CC Watson, and M D Paul.</Text>
                    </View>
                </List.Accordion>
                <OtrixDivider></OtrixDivider>
                <List.Accordion style={styles.ListAccordion}
                    title="ICEU Madras"
                    left={props => <Text style={styles.contentText}></Text> }>
                        <View style={{marginLeft:-60}}>
                    <Text style={styles.contentText}>      In 1950, Bro.Bakht Singh told Prof Enoch about Dr T Norton Sterrett, then a teacher in a Bible School at Jhansi, U. P. Prof Enoch also heard that Dr Sterrett was in touch with International Fellowship of Evangelical Students (IFES) and was keen to pioneer evangelical student witness in India. He invited him to come to Madras to help with the work. Dr Sterrett came to Madras in 1951 with the Moody science film, 'God and Creation'. The film, which was screened in many colleges, caught the attention of the students and helped the seniors to find those who were interested in the things of the Lord. They had a real breakthrough in Stanley Medical College which gave them many contacts. The persons contacted through film shows were encouraged to join the Friday Prayer meeting at Poonamallee High Road. As the number of participants for this meeting grew steadily, they formed many small prayer groups in Madras. The constant interaction and prayer among students and graduates led to the formation of the committee for Inter Collegiate Evangelical Union (ICEU) of Madras in 1951. A student magazine, entitled The Evangelical Student, began to appear with Watson as Editor. Tom Thurley, a veterinary student, became the first President of Madras ICEU. This group in some ways had the most encouraging beginning as it was mainly started through student initiative. ICEU was a small group of students meeting regularly for prayer at Prof Enoch's residence. Some of the students included Sam Kamaleson (now Vice President of World Vision International) Nesarathina Carunya (now Administrator, Dohnavur Fellowship), C T Rajarathnam (Philadelphia, USA) and Ebenezer Christadoss (Tennessee, USA). Three or four students in a Government College in Madras had kept faith, stood for the Lord by means of weekly Bible study. They brought in their friends students to hear the Word and won some for Christ.</Text>
                </View>
                </List.Accordion>
                <OtrixDivider></OtrixDivider>
                <List.Accordion style={styles.ListAccordion}
                    title="Fear Not, Little Flock.."
                    left={props => <Text style={styles.contentText}></Text> }>
                        <View style={{marginLeft:-60}}>
                    <Text style={styles.contentText}>      Sometime early in 1948, a small gathering of about half a dozen students of CMC, Vellore, without any senior adviser felt the need for a deeper fellowship than what was provided by the existing Christian organization in the College SCM. There was a growing discontentment among the few believing students on the SCM committee. In March 1951, the President - Meena Biswas, Vice President - Sarala Elisha and Secretary - Annamma Varghese resigned with a strong conviction that they could not be in SCM and witness for the Lord effectively. These Christian students were asked to give their reasons for their resignations. After much prayer and claiming the promise. "Fear not, little flock, for it is your Father's good pleasure to give you the kingdom," Luke 12.32, the President read out the resignation with reasons. It was accepted without much discussion. Another Staff member advised her "to be with SCM and leaven the lump". But she decided to obey God rather than man. Those who left the SCM had a great longing to start a witnessing evangelical group. Their struggle were not over with separation for they could feel Satan as a very real person. "There were struggles within and without", for some born-again Christians were opposed to the formation of an evangelical union. It was felt, however, that it was desirable to unite as an evangelical union for effective witness. God sent Dr. John Moody from Australia in 1950 to be on the staff of the C M C, Vellore. He had been actively involved with IVF movement in Australia during his student days. He held a regular Bible study for the members of the fellowship and gave advice in times of their struggle and despair. The members grew in spiritual nurture. Sound doctrine was taught and good literature was spread, to make the Word known more clearly. Battles were fought and won. This deepened the spiritual lives of the believers. In August 1951, they decided to have regular Gospel meetings during weekends. The first meeting was held on 26 August 1951. The Lord, they believed, had His own seal on it. The following week, the fellowship members met together for prayer again. Some suggestions were put forward by those who felt that an organization was necessary, to affirm their position as evangelicals. There was growing conviction in their hearts that those who knew the Lord as their Saviour had a great responsibility to those around in the college. So it was necessary to have a well organized group of those who were ready for the task, based on firm and sure grounds, such as the doctrinal basis they had accepted. Regular gospel and prayer meetings went on till end-1951. In November 1951 Dr Sterrett paid a visit to Vellore on request by the members. He along with John Moody helped members form an Evangelical Union. The doctrinal basis was discussed in detail. The whole Constitution was drawn up and the name Evangelical Union was accepted. The first CMC EU Committee consisted of Joanna Gurupatham (President), Meena Biswas (Secretary), Samuel Devadatta (Treasurer). On 2 December 1951, a letter was sent to the CMC Principal requesting the College to give the EU an official recognition. It was not received well. However, the Medical College Committee met on 13 February1952 and decided to give E.U. official recognition. There is further evidence of God's leading in the fact that the seniors and students associated with the formation of Madras and Vellore Unions were entirely unaware of each other's existence until they met sometime in 1951. The first step towards coming together was made when the Vellore Union, after formulating its constitution, adopted the Statement of Aims drawn up by the Madras Union five months earlier.

                    </Text>
                    
                    </View>
                </List.Accordion>
                <OtrixDivider></OtrixDivider>
                <List.Accordion style={styles.ListAccordion}
                    title="Union Of Evangelical Students Of India"
                    left={props => <Text style={styles.contentText}></Text> }>
                        <View style={{marginLeft:-60}}>
                    <Text style={styles.contentText}>      The third EU to be formed was Coimbatore. In 1948, D Jayapaul, was a student of the College of Engineering, Madras. He was a regular member of the prayer cell functioning there. The following year he moved to GCT, Coimbatore as a second year student. He had no Christian fellowship. However, he used to go out into the open field and pray that the Lord would raise up prayer cell in G C T hostel. In answer to prayer, the Lord sent H S Ponnuraj (then a student) from Madras, for his second year, to Coimbatore. His coming to G C T hostel was a great help and due to his dynamic leadership and zeal for evangelism, the Lord raised up a small prayer cell which grew up steadily. He was nicknamed "Little God" for his stand for the Lord. They showed the film God and Creation to all hostel students and staff. They did some outreach in the nearby colleges including the Agricultural College. Later, in 1952 with H S Ponnuraj's initiative, the Coimbatore ICEU was officially inaugurated. There were now three similar groups in three different places. It was then felt that the three groups should be united. Both Moody of Vellore and Ponnuraj of Coimbatore were invited by the ICEU Executive Committee to come to Madras. The aims and objectives of the three prayer cells were found to be similar. As a result of a united conviction that it would be good to have a movement for students covering the whole nation, the 3 groups from Madras, Vellore, and Coimbatore - alongwith senior friends - met for a retreat at Katpadi Farm near Vellore. There was a full discussion on the name to be given to the national movement. Finally it was decided to adopt the name Union of Evangelical Students of India to distinguish this from other students movements in India and to underline the indigenous origin of the movement.
                        </Text>
                    </View>
                </List.Accordion>
                <OtrixDivider></OtrixDivider>
                <List.Accordion style={styles.ListAccordion}
                    title="The Spreading Flame"
                    left={props => <Text style={styles.contentText}></Text> }>
                        <View style={{marginLeft:-60}}>
                    <Text style={styles.contentText}>      The groups at Madras, Vellore, and Coimbatore had a burden and vision not only for their own places but also for the other students in India. The representatives of these three groups launched UESI as a national movement on 18 September 1954, with M D Paul as President and Vijaya Benjamin as Secretary. As they gathered from time to time, the leaders shared the convictions which the Lord had put in their hearts. M D Paul, Dr Sterrett, Joe Devadatta, M Selvaraj, Vijaya Benjamin, Leela Martin, and David C C Watson participated in the Central Committee in Madras in 1954 and a Constitution with by-laws was adopted. Apart from the emphasis on the Word of God and rebirth, the three unions felt that they should look to God in faith for their financial and other needs. They believed that since his movement was of God, He would supply not only workers but also money and every need the work required. Earlier at the General Committee meeting in March 1954 at Coimbatore, The Evangelical Student was accepted as the official magazine of UESI. Till then for a number of issues it had been a periodical published by the Madras ICEU. Later the magazine was renamed as OUR LINK and is now published as CAMPUS LINK, the national magazine. Campus Link is a bimonthly campus magazine, It seeks to sensitize believing college students to reason out issues, and stand for Christ, creating an awareness of UESI ministry and leading them to maturity and involvement.
                        </Text>
                    <Text style={styles.contentText}>      Its 60+ Years since the Flame started Spreading. Now UESI has its presence in all the states of India. It has been transforming thousands of students since then, as the Lord leads the movement. The transformed students themselves are transforming many more and the impact of UESI is seen in many ways in many Campuses and the Society.
                        </Text>
                    </View>
                </List.Accordion>
                <OtrixDivider></OtrixDivider>
                <List.Accordion style={styles.ListAccordion}
                    title="UESI - Telangana"
                    left={props => <Text style={styles.contentText}></Text> }>
                        <View style={{marginLeft:-60}}>
                    <Text style={styles.contentText}>      Telangana State is formed by Indian Government on 2-Jun-2014. Subsequently UESI Telangana became a decentralized unit of UESI in 2015. UESI Telangana has its head office in Hyderabad and is working in all the districts of Telangana State.
                    </Text>
                    </View>
                </List.Accordion>
                
                    
            </Card.Content>
        </Card>
       </View>

       </ScrollView>
       </SafeAreaView>
        // </>

    )
}

function mapStateToProps(state) {
    return {
        USER_AUTH: state.auth.USER_AUTH,
        wishlistData: state.wishlist.wishlistData,
        wishlistCount: state.wishlist.wishlistCount,
        customerData: state.auth.USER_DATA,
        strings: state.mainScreenInit.strings,
        reloginVerified: state.song.reloginVerified
    }
}

const mapDispatchToProps = dispatch => (
    bindActionCreators({
        addToWishList,
        storeFCM,
        doLogin,
        setReloginVerified
    }, dispatch)
);


export default connect(mapStateToProps, mapDispatchToProps)(UESIHomeScreen);

const styles = StyleSheet.create({
    contentText:{
        fontFamily:Fonts.Font_Reguler,
        fontSize: 15,
        color:'#000000',
        marginTop:10,
        lineHeight:25,
        textAlign:'justify'
    },
    contentTitle:{
        fontFamily:Fonts.Font_Medium,
        fontSize: 15,
        color:'#000000'
    },
    cardTitle:{
        fontFamily:Fonts.Font_Medium,
        fontSize: 18,
        color: Colors().themeSecondColor
    },
    box: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: hp('1.5%'),
        backgroundColor: Colors().white,
        marginVertical: hp('1%'),
        marginHorizontal: wp('1%'),
        borderRadius: wp('2%'),
        borderWidth: 0.5,
        borderColor: Colors().custom_gray,
        fontFamily:'Poppins-Medium'
    },
    txt: {
        fontSize: wp('4%'),
        fontFamily: Fonts.Font_Medium,
        color: Colors().text_color,
        textAlign: 'left'
    },
    image: {
        resizeMode: 'contain',
        alignSelf: 'center',
        height: hp('16%'),
        width: wp('30%'),
    },
    ListAccordion:{
        marginTop:-10,
        marginBottom:-10
    }

});

const styles1 = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      //marginTop: 22,
    },
    modalView: {
      margin: 20,
      backgroundColor: 'white',
      borderRadius: 10,
      borderWidth:2,
      borderColor:Colors().themeSecondColor,
      padding: 35,
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
      borderRadius: 5,
      padding: 10,
      marginTop:30,
      elevation: 2,
    },
    buttonOpen: {
      backgroundColor: '#F194FF',
    },
    buttonClose: {
      backgroundColor: Colors().themeColor,
    },
    textStyle: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    modalText: {
      fontFamily: Fonts.Font_Bold,
      marginBottom: 15,
      textAlign: 'center',
    },
  });