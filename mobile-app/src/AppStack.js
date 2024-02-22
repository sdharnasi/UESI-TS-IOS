import React, { useState } from "react";
import { LogBox } from 'react-native';
import { Provider } from 'react-redux';
import { NativeBaseProvider } from "native-base"
import AppNavigator from "./AppNavigator";
import store from './redux/store/store';
import { NavigationContainer } from "@react-navigation/native";
AppStack = () => {
  return (
    <Provider store={store}>
    <NavigationContainer>
        <AppNavigator />
    </NavigationContainer>
</Provider>
  )
}

export default AppStack
