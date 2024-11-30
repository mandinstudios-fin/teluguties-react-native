import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Home from './Home';
import ProfileDetails from '../ProfileDetails/ProfileDetails';
import Daily from '../Daily/Daily';
import New from '../New/New';
import Shortlist from '../Shortlist/Shortlist';
import RecentlyViewed from '../RecentlyViewed/RecentlyViewed';
import UserProfileDetails from '../Profiles/UserProfileDetails';
import Likely from '../Likely/Likely';

const Stack = createStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="ProfileDetails" component={ProfileDetails} />
      <Stack.Screen name="Daily" component={Daily} />
      <Stack.Screen name="New" component={New} />
      <Stack.Screen name="Shortlist" component={Shortlist} />
      <Stack.Screen name="RecentlyViewed" component={RecentlyViewed} />
      <Stack.Screen name="Likely" component={Likely} />
      <Stack.Screen name="UserProfileDetails" component={UserProfileDetails} />
    </Stack.Navigator>
  );
};

export default HomeStack;
