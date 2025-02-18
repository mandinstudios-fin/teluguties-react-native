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
import UserNotifications from '../Header/UserNotifications';

const Stack = createStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false, }}>
      <Stack.Screen name="Home" component={Home} options={{ presentation: 'transparentModal' }}/>
      <Stack.Screen name="ProfileDetails" component={ProfileDetails} options={{ presentation: 'transparentModal' }}/>
      <Stack.Screen name="Daily" component={Daily} options={{ presentation: 'transparentModal' }}/>
      <Stack.Screen name="New" component={New} options={{ presentation: 'transparentModal' }} />
      <Stack.Screen name="Shortlist" component={Shortlist} options={{ presentation: 'transparentModal' }}/>
      <Stack.Screen name="RecentlyViewed" component={RecentlyViewed} options={{ presentation: 'transparentModal' }}/>
      <Stack.Screen name="Likely" component={Likely} options={{ presentation: 'transparentModal' }}/>
      <Stack.Screen name="UserProfileDetails" component={UserProfileDetails}  options={{presentation:'modal'}}/>
      <Stack.Screen name="UserNotifications" component={UserNotifications}  options={{presentation:'card'}}/>
    </Stack.Navigator>
  );
};

export default HomeStack;
