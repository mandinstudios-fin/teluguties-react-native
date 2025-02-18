import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import AgentsHome from './AgentsHome';
import UploadedProfiles from '../UploadedProfiles/UploadedProfiles';
import UserProfileDetails from '../Profiles/UserProfileDetails';
import ProfileDetailsAgents from '../ProfileDetails/ProfileDetailsAgents';

const Stack = createStackNavigator();

const AgentsHomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false, }}>
      <Stack.Screen name="AgentsHome" component={AgentsHome} options={{ presentation: 'transparentModal' }}/>
      <Stack.Screen name="UploadedProfiles" component={UploadedProfiles} options={{ presentation: 'transparentModal' }}/>
      <Stack.Screen name="UserProfileDetails" component={UserProfileDetails} options={{ presentation: 'transparentModal' }}/>
      <Stack.Screen name="ProfileDetailsAgents" component={ProfileDetailsAgents} options={{ presentation: 'transparentModal' }}/>
    </Stack.Navigator>
  );
};

export default AgentsHomeStack;
