import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import ProfileDetails from '../ProfileDetails/ProfileDetails';
import Matches from './Matches';
import UserProfileDetails from '../Profiles/UserProfileDetails';
import UserNotifications from '../Header/UserNotifications';
import DrawerSceneWrapper from '../Navigation/draw';

const Stack = createStackNavigator();

const MatchesStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="Matches"
        component={Matches}
      />
      <Stack.Screen
        name="ProfileDetails"
        component={ProfileDetails}
        options={{ presentation: 'transparentModal' }}
      />
      <Stack.Screen name="UserProfileDetails" component={UserProfileDetails} options={{ presentation: 'modal' }} />
      <Stack.Screen name="UserNotifications" component={UserNotifications} options={{ presentation: 'modal' }} />
    </Stack.Navigator>
  )
}

export default MatchesStack
