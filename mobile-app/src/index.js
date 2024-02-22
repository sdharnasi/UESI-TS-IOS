import React, { useState } from "react";
import { LogBox,StatusBar } from 'react-native';
import { Provider } from 'react-redux';
import { NativeBaseProvider } from "native-base"
import AppNavigator from "./AppNavigator";
//import PaperProvider  from 'react-native-paper';
//import AppStack from "./AppStack";
import store from './redux/store/store';
import { NavigationContainer } from "@react-navigation/native";
import { LogLevel, OneSignal } from 'react-native-onesignal';

LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs()


App = () => {
    // Remove this method to stop OneSignal Debugging
OneSignal.Debug.setLogLevel(LogLevel.Verbose);

// OneSignal Initialization
OneSignal.initialize("b3f28429-870c-4764-8206-ac9da08a4b0f");

// requestPermission will show the native iOS or Android notification permission prompt.
// We recommend removing the following code and instead using an In-App Message to prompt for notification permission
OneSignal.Notifications.requestPermission(true);

// Method for listening for notification clicks
OneSignal.Notifications.addEventListener('click', (event) => {
  console.log('OneSignal: notification clicked:', event);
});

    return (
        <>
        <StatusBar backgroundColor={"#303c7e"}
                barStyle="light-content" />
         <Provider store={store}>
             <NativeBaseProvider>
            <AppNavigator/>
            
             </NativeBaseProvider>
         </Provider>
         </>
    )
}

export default App
