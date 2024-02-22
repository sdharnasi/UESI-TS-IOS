import React from 'react';
import { Platform, StyleSheet, Image, Text, View } from 'react-native';
import { NavigationContainer, createNavigationContainerRef } from "@react-navigation/native";
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { connect } from 'react-redux';
import {
    SplashScreen, HomeScreen, SettingScreen, LoginScreen, RegisterScreen, RegisterSuccessScreen, ForgotPasswordScreen, CategoryScreen,
    CartScreen, ProfileScreen, ProductListScreen, ProductDetailScreen, CheckoutScreen, EditProfileScreen, ChangePasswordScreen,
    ManageAddressScreen, WishlistScreen, OrderScreen, OrderDetailScreen, LanguageScreen, TermsandconditionScreen, PrivacyPolicyScreen,
    NotificationScreen, SearchScreen, UnauthorizeScreen, MenufecturerScreen, SocialRegisterScreen, RefundScreen, ShippingDeliveryScreen,
    VerifyOTPScreen, ResetPasswordScreen, DeleteAccountScreen
} from './screens/index';
import { bottomHome, bottomHomeFill, bottomCategory, bottomCategoryFill, bottomCart, bottomProfile, bottomProfileFill, bottomSetting, bottomSettingFill } from '@common';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Colors, GlobalStyles } from '@helpers';
import { Badge } from "native-base"
import Fonts from './helpers/Fonts';
import { _roundDimensions } from './helpers/util';
import VerifyMobileOTPScreen from './screens/VerifyMobileOTPScreen';
import store from './redux/store/store';
const SettingStack = createStackNavigator();
export const navigationRef = createNavigationContainerRef()
import {createDrawerNavigator} from '@react-navigation/drawer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { bindActionCreators } from 'redux';
import { addToWishList, storeFCM } from '@actions';

import Home from './song-book/Home';
import MessagesScreen from './screens/MessagesScreen';
import CustomSidebarMenu from './CustomSidebarMenu';
import TeluguSongsScreen from './song-book/TeluguSongsScreen';
import EnglishSongsScreen from './song-book/EnglishSongsScreen';
import HindiSongsScreen from './song-book/HindiSongsScreen';
import SongSearchScreen from './song-book/SongSearchScreen';
import NewSongsScreen from './song-book/NewSongsScreen';
import SongRegisterScreen from './song-book/SongRegisterScreen';
import PaymentScreen from './song-book/PaymentScreen';
import UESIHomeScreen from './home/UESIHomeScreen';
import UpComingProgramsScreen from './upcoming-programs/UpComingProgramsScreen';
import MagazineScreen from './Velugu/MagazineScreen';
import PrayerPointsScreen from './prayer-points/PrayerPointsScreen';
import AudioSongsScreen from './audio-songs/AudioSongsScreen';
import ShareScreen from './about-uesi/ShareScreen';
import AboutUsScreen from './about-uesi/AboutUsScreen';
import FeedbackScreen from './about-uesi/FeedbackScreen';
import ContactUsScreen from './about-uesi/ContactUsScreen';
import UESIPrivacyPolicyScreen from './about-uesi/UESIPrivacyPolicyScreen';
import TermsAndConditionsScreen from './about-uesi/TermsAndConditionsScreen';
import SubscriptionScreen from './Velugu/SubscriptionScreen';
import CalendarScreen from './calendar/CalendarScreen';
import PraisePointsScreen from './prayer-points/PraisePointsScreen';
import PlaylistScreen from './audio-songs/PlaylistScreen';
import DonateFreeWillScreen from './song-book/DonateFreeWillScreen';
import DonationSuccessScreen from './song-book/DonationSuccessScreen';
import Tricon2023Screen from './song-book/Tricon2023Screen';
import Tricon2020Screen from './song-book/Tricon2020Screen';
import VideoPlayerScreen from './song-book/VideoPlayerScreen';
import TeachingTrainingScreen from './song-book/TeachingTrainingScreen';
import SearchTheScriptureScreen from './song-book/SearchTheScriptureScreen';

let cartCount = 0;
let globalAuthStatus = false;
export function navigate(name, params) {
    if (navigationRef.isReady()) {
        navigationRef.navigate(name, params);
    }
}

function SettingStackNavigation() {
    return (
        <SettingStack.Navigator initialRouteName="SettingScreen">
            <SettingStack.Screen name="SettingScreen" component={SettingScreen} options={{ headerShown: false }} />
        </SettingStack.Navigator>
    );
}

//Auth Stack
const AuthStack = createStackNavigator();
function AuthNavigator() {
    return (
        <AuthStack.Navigator initialRouteName="LoginScreen">
            <AuthStack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS }} />
            <AuthStack.Screen name="RegisterScreen" component={RegisterScreen} options={{ headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS }} />
            <AuthStack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} options={{ headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS }} />
        </AuthStack.Navigator>
    );
}

const BottomTab = createMaterialBottomTabNavigator();
function MyTabs(props) {
    const { cartCount, authStatus,USER_AUTH } = props;
    return (
        <BottomTab.Navigator
            initialRouteName="HomeScreen"
            backBehavior={'order'}
            labeled={false}
            barStyle={styles.tabbarStyle}
            screenOptions={{
                // tabBarStyle: { position: 'absolute' },
                unmountOnBlur: true,
                tabBarShowLabel: false,
                lazy: false,
                // tabBarStyle: styles.tabbarStyle
            }}>
            <BottomTab.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }}
                options={{
                    headerShown: false,
                    cardStyleInterpolator: CardStyleInterpolators.forScaleFromCenterAndroid,
                    tabBarIcon: ({ focused, tintColor }) => (
                        <Image
                            square
                            source={focused ? bottomHomeFill : bottomHome}
                            style={[styles.bottomTabIcon]}
                        />
                    ),
                }} />
            <BottomTab.Screen name="CategoryScreen" component={CategoryScreen} options={{ headerShown: false }}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ focused, tintColor }) => (
                        <Image
                            square
                            source={focused ? bottomCategoryFill : bottomCategory}
                            style={[styles.bottomTabIcon]}
                        />
                    ),
                }} />
            <BottomTab.Screen name="CartScreen" component={globalAuthStatus == true ? CartScreen : AuthNavigator} options={{ headerShown: false }}
                options={{
                    headerShown: false,
                    cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
                    tabBarIcon: ({ focused, tintColor }) => (
                        <View style={styles.cartIconView}>
                            <Image
                                square
                                source={focused ? bottomCart : bottomCart}
                                style={[styles.bottomTabIcon, {
                                    top: cartCount > 9 ? hp('0.8%') : hp('0.2%'),
                                    right: wp('1%'),
                                    height: wp('7%'),
                                    width: wp('7%'),
                                }]}
                            />
                            {
                                cartCount > 0 && <Badge style={[GlobalStyles.badge, styles.count, {
                                    height: cartCount > 9 ? _roundDimensions()._height * 0.039 : _roundDimensions()._height * 0.032,
                                    width: cartCount > 9 ? _roundDimensions()._height * 0.039 : _roundDimensions()._height * 0.032,
                                    borderRadius: _roundDimensions()._borderRadius,
                                    right: cartCount > 9 ? wp('0.3') : wp('1.2%'),
                                    top: cartCount > 9 ? hp('0.1%') : hp('0.6%')
                                }]}>

                                    <Text style={[GlobalStyles.badgeText, styles.countText, { fontSize: cartCount > 9 ? wp('2.4%') : wp('3%') }]}>{cartCount}</Text>
                                </Badge>
                            }


                        </View>
                    ),
                }} />
            <BottomTab.Screen name="ProfileScreen" component={globalAuthStatus == true ? ProfileScreen : AuthNavigator} options={{ headerShown: false }}
                options={{
                    headerShown: false,
                    cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,

                    tabBarIcon: ({ focused, tintColor }) => (
                        <Image
                            square
                            source={focused ? bottomProfileFill : bottomProfile}
                            style={[styles.bottomTabIcon]}
                        />
                    ),
                }} />
            < BottomTab.Screen name="SettingScreen" component={SettingStackNavigation} options={{ headerShown: false }}
                options={{
                    headerShown: false,
                    cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
                    tabBarIcon: ({ focused, tintColor }) => (
                        <Image
                            square
                            source={focused ? bottomSettingFill : bottomSetting}
                            style={[styles.bottomTabIcon]}
                        />
                    ),
                }} />

        </BottomTab.Navigator >
    );
}

const PrayerPointsTab = createMaterialBottomTabNavigator();
function PrayerPointsTabs(props) {
    let cartCount = props.cartCounts;
    let authStatus = props.auth;
    return (
        <PrayerPointsTab.Navigator
            initialRouteName="PraisePointsScreen"
            backBehavior={'order'}
            labeled={false}
            barStyle={styles.tabbarStyle}
            screenOptions={{
                // tabBarStyle: { position: 'absolute' },
                unmountOnBlur: true,
                tabBarShowLabel: false,
                lazy: false,
                // tabBarStyle: styles.tabbarStyle
            }}>
            <PrayerPointsTab.Screen name="PraisePointsScreen" component={PraisePointsScreen} options={{ headerShown: false }}
                options={{
                    headerShown: true,
                    cardStyleInterpolator: CardStyleInterpolators.forScaleFromCenterAndroid,
                    tabBarIcon: ({ focused, tintColor }) => (
                        <Image
                            square
                            source={focused ? bottomHomeFill : bottomHome}
                            style={[styles.bottomTabIcon]}
                        />
                    ),
                }} />
            <PrayerPointsTab.Screen name="PrayerPointsScreen" component={PrayerPointsScreen} options={{ headerShown: false }}
                options={{
                    headerShown: true,
                    tabBarIcon: ({ focused, tintColor }) => (
                        <Image
                            square
                            source={focused ? bottomCategoryFill : bottomCategory}
                            style={[styles.bottomTabIcon]}
                        />
                    ),
                }} />
        </PrayerPointsTab.Navigator >
    );
}

const Drawer = createDrawerNavigator();
const DrawerNavigator = () => {
    return (
        <Drawer.Navigator screenOptions={{
            itemStyle: {marginVertical: 5}
          }}
          drawerContent={props => <CustomSidebarMenu {...props} />}>
        {/* <Drawer.Screen name="Songs Book" component={SongBookNavigator}/> */}
        <Drawer.Screen name="UESIHomeScreen" component={UESIHomeScreen} options={{
            headerShown: false,
            drawerLabel: 'Home',
            title: 'Home',
            groupName: 'home',
            headerStyle: {
                backgroundColor: Colors().themeColor,
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
            },
            drawerKey:'home'
          }}/>
          <Drawer.Screen name="Upcoming Programs" component={UpComingProgramsScreen} options={{
            drawerLabel: 'Upcoming Programs',
            title: 'Upcoming Programs',
            groupName: 'upcomming-programs',
            headerStyle: {
                backgroundColor: Colors().themeColor,
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
            }
          }}/>
        <Drawer.Screen name="Telugu Songs" component={TeluguSongsScreen} options={{
            drawerLabel: 'Telugu Songs',
            title: 'Telugu Songs',
            groupName: 'song-book',
            headerStyle: {
                backgroundColor: Colors().themeColor,
              shadowOffset: {
                width: 0,
                height: 3,
              },
              shadowColor: 'black',
              shadowOpacity: 1,
              shadowRadius: 3.84,
              elevation: 15,
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
            },
            drawerKey:'telugu'
          }}/>
        <Drawer.Screen name="English Songs" component={EnglishSongsScreen} options={{
            drawerLabel: 'English Songs',
            title: 'English Songs',
            groupName: 'song-book',
            headerStyle: {
                backgroundColor: Colors().themeColor,
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
            },
            drawerKey:'english'
          }}/>
        <Drawer.Screen name="Hindi Songs" component={HindiSongsScreen} options={{
            drawerLabel: 'Hindi Songs',
            title: 'Hindi Songs',
            groupName: 'song-book',
            headerStyle: {
                backgroundColor: Colors().themeColor,
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
            },
            drawerKey:'hindi'
          }}/>
          <Drawer.Screen name="New Songs" component={NewSongsScreen} options={{
            drawerLabel: 'New Songs',
            title: 'New Songs',
            groupName: 'song-book',
            headerStyle: {
                backgroundColor: Colors().themeColor,
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
            },
            drawerKey:'new'
          }}/>
          {/* <Drawer.Screen name="Get all Songs" component={AuthNavigator} options={{
            drawerLabel: 'Get all Songs',
            title: 'Get all Songs',
            groupName: 'song-book',
            headerStyle: {
                backgroundColor: Colors().themeColor,
              shadowOffset: {
                width: 0,
                height: 3,
              },
              shadowColor: 'black',
              shadowOpacity: 1,
              shadowRadius: 3.84,
              elevation: 15,
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
            },
            drawerKey:'get-all-songs'
          }}/> */}
        <Drawer.Screen name="Order Books" component={MyTabs}  options={{
            headerShown: false,
            drawerLabel: 'Order Books',
            title: 'Order Books',
            groupName: 'book-store',
            headerStyle: {
                backgroundColor: Colors().themeColor,
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
            },
          }}/>
        <Drawer.Screen name="TRICON-2023" component={Tricon2023Screen} options={{
            drawerLabel: 'TRICON-2023',
            title: 'TRICON-2023',
            groupName: 'tricon',
            headerStyle: {
                backgroundColor: Colors().themeColor,
              shadowOffset: {
                width: 0,
                height: 3,
              },
              shadowColor: 'black',
              shadowOpacity: 1,
              shadowRadius: 3.84,
              elevation: 15,
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
            },
            drawerKey:'tricon-2023'
          }}/>
          <Drawer.Screen name="TRICON-2020" component={Tricon2020Screen} options={{
            drawerLabel: 'TRICON-2020',
            title: 'TRICON-2020',
            groupName: 'tricon',
            headerStyle: {
                backgroundColor: Colors().themeColor,
              shadowOffset: {
                width: 0,
                height: 3,
              },
              shadowColor: 'black',
              shadowOpacity: 1,
              shadowRadius: 3.84,
              elevation: 15,
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
            },
            drawerKey:'tricon-2020'
          }}/>
          <Drawer.Screen name="DFDProgramsScreen" component={TeachingTrainingScreen} options={{
            drawerLabel: 'Teaching & Training',
            title: 'Teaching & Training',
            groupName: 'dfd-programs',
            headerStyle: {
                backgroundColor: Colors().themeColor,
              shadowOffset: {
                width: 0,
                height: 3,
              },
              shadowColor: 'black',
              shadowOpacity: 1,
              shadowRadius: 3.84,
              elevation: 15,
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
            },
            drawerKey:'dfd-programs'
          }}/>
        <Drawer.Screen name="Vidyarthi Velugu" component={MagazineScreen}  options={{
            drawerLabel: 'Vidyarthi Velugu',
            title: 'Vidyarthi Velugu',
            groupName: 'magazines',
            headerStyle: {
                backgroundColor: Colors().themeColor,
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
            },
            drawerKey:'vidyarthi-velugu'
          }}/>

        <Drawer.Screen name="Campus Connect" component={MagazineScreen}  options={{
            drawerLabel: 'Campus Connect',
            title: 'Campus Connect',
            groupName: 'magazines',
            headerStyle: {
                backgroundColor: Colors().themeColor,
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
            },
            drawerKey:'campus-connect'
          }}/>
          <Drawer.Screen name="In Touch" component={MagazineScreen}  options={{
            drawerLabel: 'In Touch',
            title: 'In Touch',
            groupName: 'magazines',
            headerStyle: {
                backgroundColor: Colors().themeColor,
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
            },
            drawerKey:'in-touch'
          }}/>
          {/* <Drawer.Screen name="Our Field" component={MagazineScreen}  options={{
            drawerLabel: 'Our Field',
            title: 'Our Field',
            groupName: 'magazines',
            headerStyle: {
                backgroundColor: Colors().themeColor,
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
            },
            drawerKey:'our-field'
          }}/> */}
          <Drawer.Screen name="subscription" component={SubscriptionScreen}  options={{
            drawerLabel: 'Subscriptions',
            title: 'Subscriptions',
            groupName: 'magazines',
            headerStyle: {
                backgroundColor: Colors().themeColor,
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
            },
            drawerKey:'subscription'
          }}/>
        <Drawer.Screen name="Calendar" component={CalendarScreen}  options={{
            drawerLabel: 'Calendar',
            title: 'Calendar',
            groupName: 'calendar',
            headerStyle: {
                backgroundColor: Colors().themeColor,
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
            },
          }}/>
          <Drawer.Screen name="DonateFreeWillScreen" component={DonateFreeWillScreen}  options={{
            drawerLabel: 'Donate a Gift',
            title: 'Donate a Gift',
            groupName: 'donate-free-will',
            headerStyle: {
                backgroundColor: Colors().themeColor,
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
            },
          }}/>
        {/* <Drawer.Screen name="Prayer Points" component={PrayerPointsScreen}  options={{
            drawerLabel: 'Prayer Points',
            title: 'Prayer Points',
            groupName: 'prayer-points',
            headerStyle: {
                backgroundColor: Colors().themeColor,
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
            },
          }}/> */}
          <Drawer.Screen name="Audio Songs" component={AudioSongsScreen}  options={{
            drawerLabel: 'Audio Songs',
            title: 'Audio Songs',
            groupName: 'audio-songs',
            headerStyle: {
                backgroundColor: Colors().themeColor,
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
            },
          }}/>

          <Drawer.Screen name="SearchTheScriptureScreen" component={SearchTheScriptureScreen}  options={{
            drawerLabel: 'Search the Scriptures',
            title: 'Search the Scriptures',
            groupName: 'search-the-scripture',
            headerStyle: {
                backgroundColor: Colors().themeColor,
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
            },
          }}/>

          <Drawer.Screen name="Login" component={AuthNavigator}  options={{
            drawerLabel: 'Login',
            title: 'Login',
            groupName: 'login',
            headerStyle: {
                backgroundColor: Colors().themeColor,
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
            },
          }}/>
          <Drawer.Screen name="Share App" component={ShareScreen}  options={{
            drawerLabel: 'Share App',
            title: 'Share App',
            groupName: 'share-app',
            headerStyle: {
                backgroundColor: Colors().themeColor,
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
            },
          }}/>
          <Drawer.Screen name="About Us" component={AboutUsScreen}  options={{
            drawerLabel: 'About Us',
            title: 'About Us',
            groupName: 'about-us',
            headerStyle: {
                backgroundColor: Colors().themeColor,
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
            },
          }}/>
          <Drawer.Screen name="Send Complaints" component={FeedbackScreen}  options={{
            drawerLabel: 'Send Complaints',
            title: 'Complaints',
            groupName: 'feedback',
            headerStyle: {
                backgroundColor: Colors().themeColor,
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
            },
          }}/>
          <Drawer.Screen name="Contact Us" component={ContactUsScreen}  options={{
            drawerLabel: 'Contact Us',
            title: 'Contact Us',
            groupName: 'contact-us',
            headerStyle: {
                backgroundColor: Colors().themeColor,
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
            },
          }}/>
          <Drawer.Screen name="Terms and Conditions" component={TermsAndConditionsScreen}  options={{
            drawerLabel: 'Terms and Conditions',
            title: 'Terms and Conditions',
            groupName: 'terms-and-conditions',
            headerStyle: {
                backgroundColor: Colors().themeColor,
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
            },
          }}/>
          <Drawer.Screen name="Privacy Policy" component={UESIPrivacyPolicyScreen}  options={{
            drawerLabel: 'Privacy Policy',
            title: 'Privacy Policy',
            groupName: 'privacy-policy',
            headerStyle: {
                backgroundColor: Colors().themeColor,
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
            },
          }}/>
      </Drawer.Navigator>
      
    );
  }


const Stack = createStackNavigator();
function AppNavigator(props) {
    const { cartCount, authStatus } = props;
    globalAuthStatus = authStatus;
    return (
        <NavigationContainer ref={navigationRef}>
            <Stack.Navigator initialRouteName="SplashScreen">
                <Stack.Screen name='SplashScreen' component={SplashScreen}
                    options={{
                        headerShown: false,
                    }}
                />
                {/* <Stack.Screen {...props} name="MainScreen" component={() => <MyTabs cartCounts={cartCount} auth={authStatus}></MyTabs>} options={{ headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS, }} countProp={cartCount} initialParams={{ 'count': cartCount }} /> */}

                <Stack.Screen {...props} name="MainScreen" options={{ headerShown: false, }} >
                    {props => <DrawerNavigator cartCounts={cartCount} auth={authStatus} />}
                </Stack.Screen>
                <Stack.Screen name="Home" component={Home} options={({ navigation, route }) =>({
                    headerShown: true,
                    headerStyle: {
                        backgroundColor: Colors().themeColor,
                    },
                    headerTintColor: '#fff',
                    headerTitle: props.songType==='telugu'?'Telugu Songs':(props.songType==='english'?'English Songs':(props.songType==='hindi'?'Hindi Songs':'New Songs')),
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    }
                })} />
                <Stack.Screen name="VideoPlayerScreen" component={VideoPlayerScreen} options={({ navigation, route }) =>({
                    headerShown: false,
                    headerStyle: {
                        backgroundColor: Colors().themeColor,
                    },
                    headerTintColor: '#fff',
                    headerTitle: 'TRICON-2023',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    }
                })} />
                <Stack.Screen name="SongSearchScreen" component={SongSearchScreen} options={{
                    headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forModalPresentationIOS
                }} />
                <Stack.Screen name="PlaylistScreen" component={PlaylistScreen} options={{
                    headerShown: true,
                    cardStyleInterpolator: CardStyleInterpolators.forModalPresentationIOS,
                    headerStyle: {
                        backgroundColor: Colors().themeColor,
                    },
                    headerTintColor: '#fff',
                    headerTitle: 'Play List',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    }
                }} />
                <Stack.Screen name="SongRegisterScreen" component={SongRegisterScreen} options={{
                    headerShown: false
                }} />
                <Stack.Screen name="PaymentScreen" component={PaymentScreen} options={{
                    headerShown: true,
                    headerShown: true,
                    headerStyle: {
                        backgroundColor: Colors().themeColor,
                    },
                    headerTintColor: '#fff',
                    headerTitle: props.paymentModuleType=='song_book'?'Get all songs':'Get all videos',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    }
                }} />
                <Stack.Screen name="DeleteAccountScreen" component={DeleteAccountScreen} options={{
                    headerShown: true,
                    headerShown: true,
                    headerStyle: {
                        backgroundColor: Colors().themeColor,
                    },
                    headerTintColor: '#fff',
                    headerTitle: 'Delete Account',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    }
                }} />
                <Stack.Screen name="DonationSuccessScreen" component={DonationSuccessScreen} options={{
                    headerShown: false
                }} />
                <Stack.Screen name="LoginScreen" component={AuthNavigator} options={{ headerShown: false, }} />
                <Stack.Screen name="ProductListScreen" component={ProductListScreen} options={{ headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS, }} />
                <Stack.Screen name="ProductDetailScreen" component={ProductDetailScreen} options={{ headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS, }} />
                <Stack.Screen name="CheckoutScreen" component={CheckoutScreen} options={{
                    headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
                }} />
                <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} options={{
                    headerShown: false,
                    cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
                }} />
                <Stack.Screen name="ChangePasswordScreen" component={ChangePasswordScreen} options={{
                    headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
                }} />
                <Stack.Screen name="RegisterSuccessScreen" component={RegisterSuccessScreen} options={{
                    headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
                }} />
                <Stack.Screen name="SocialRegisterScreen" component={SocialRegisterScreen} options={{
                    headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
                }} />
                <Stack.Screen name="ManageAddressScreen" component={ManageAddressScreen} options={{
                    headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
                }} />
                <Stack.Screen name="WishlistScreen" component={WishlistScreen} options={{
                    headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
                }} />
                <Stack.Screen name="OrderScreen" component={OrderScreen} options={{
                    headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
                }} />
                <Stack.Screen name="OrderDetailScreen" component={OrderDetailScreen} options={{
                    headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
                }} />
                <Stack.Screen name="LanguageScreen" component={LanguageScreen} options={{
                    headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
                }} />
                <Stack.Screen name="TermsandconditionScreen" component={TermsandconditionScreen} options={{
                    headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
                }} />
                <Stack.Screen name="PrivacyPolicyScreen" component={PrivacyPolicyScreen} options={{
                    headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
                }} />
                <Stack.Screen name="NotificationScreen" component={NotificationScreen} options={{
                    headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
                }} />
                <Stack.Screen name="SearchScreen" component={SearchScreen} options={{
                    headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forModalPresentationIOS,
                }} />
                <Stack.Screen name="UnauthorizeScreen" component={UnauthorizeScreen} options={{
                    headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forModalPresentationIOS,
                }} />
                <Stack.Screen name="MenufecturerScreen" component={MenufecturerScreen} options={{
                    headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
                }} />
                <Stack.Screen name="RefundScreen" component={RefundScreen} options={{
                    headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
                }} />
                <Stack.Screen name="ShippingDeliveryScreen" component={ShippingDeliveryScreen} options={{
                    headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
                }} />
                <Stack.Screen name="VerifyOTPScreen" component={VerifyOTPScreen} options={{
                    headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
                }} />
                <Stack.Screen name="VerifyMobileOTPScreen" component={VerifyMobileOTPScreen} options={{
                    headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
                }} />
                <Stack.Screen name="ResetPasswordScreen" component={ResetPasswordScreen} options={{
                    headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
                }} />
                

            </Stack.Navigator>


        </NavigationContainer>
    )
}


//export default connect(mapStateToProps, {})(AppNavigator);

function mapStateToProps(state) {
    return {
        cartCount: state.cart.cartCount ? state.cart.cartCount : null,
        authStatus: state.auth.USER_AUTH,
        songType: state.song.songType,
        USER_AUTH: state.auth.USER_AUTH,
        paymentModuleType: state.song.paymentModuleType
    }
}

const mapDispatchToProps = dispatch => (
    bindActionCreators({
        addToWishList,
        storeFCM
    }, dispatch)
);


export default connect(mapStateToProps, mapDispatchToProps)(AppNavigator);

const styles = StyleSheet.create({
    bottomTabIcon: {
        height: wp('6%'),
        width: wp('6%'),
    },
    tabbarStyle: {
        backgroundColor: Colors().white,
    },
    cartIconView: {
        backgroundColor: Colors().light_white,
        height: _roundDimensions()._height * 0.068,
        width: _roundDimensions()._height * 0.068,
        borderRadius: _roundDimensions()._borderRadius,
        justifyContent: 'center',
        alignItems: 'center',
        bottom: hp('2%'),
        position: 'relative',
        zIndex: 9999999999
    },
    count: {
        backgroundColor: Colors().white,
    },
    countText: {
        color: Colors().link_color,
        fontFamily: Fonts.Font_Bold
    }
});