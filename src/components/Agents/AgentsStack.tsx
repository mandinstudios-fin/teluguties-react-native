import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import Agents from './Agents';
import AgentsProfileDetails from '../AgentsProfileImage/AgentsProfileDetails';
import ProfileDetails from '../ProfileDetails/ProfileDetails';
import UserNotifications from '../Header/UserNotifications';
import DrawerSceneWrapper from '../Navigation/draw';

const Stack = createStackNavigator();

export default function AgentsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name={"Agents"}
        component={Agents}
      />
      <Stack.Screen name="ProfileDetails" component={ProfileDetails} options={{ presentation: 'transparentModal' }} />
      <Stack.Screen
        name={"AgentsProfileDetails"}
        component={AgentsProfileDetails}
        options={{ presentation: 'modal' }}
      />
      <Stack.Screen name="UserNotifications" component={UserNotifications} options={{ presentation: 'modal' }} />

    </Stack.Navigator>
  )
}

const styles = StyleSheet.create({})