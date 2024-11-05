import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import ProfileDetails from '../ProfileDetails/ProfileDetails';
import Matches from './Matches';

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
      />
    </Stack.Navigator>
  )
}

export default MatchesStack
