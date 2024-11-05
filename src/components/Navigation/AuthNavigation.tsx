import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import Login from '../Auth/Login';
import Register from '../Auth/Register';
import Otp from '../Auth/Otp';
import Success from '../Auth/Success';

const Stack = createStackNavigator();

const AuthNavigation = () => {
  return (
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Otp" component={Otp} />
        <Stack.Screen name="Success" component={Success} />
      </Stack.Navigator>
  );
};

export default AuthNavigation;
