import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import ProfileDetails from '../ProfileDetails/ProfileDetails';
import Prime from './Prime';
import UserNotifications from '../Header/UserNotifications';
import DrawerSceneWrapper from '../Navigation/draw';

const Stack = createStackNavigator();

const PrimeStack = () => {
  return (
    <DrawerSceneWrapper>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="Prime"
          component={Prime}
        />
        <Stack.Screen
          name="ProfileDetails"
          component={ProfileDetails}
        />
        <Stack.Screen name="UserNotifications" component={UserNotifications} options={{ presentation: 'card' }} />
      </Stack.Navigator>
    </DrawerSceneWrapper>
  )
}

export default PrimeStack
