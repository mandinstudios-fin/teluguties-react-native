import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import UserProfileDetails from '../Profiles/UserProfileDetails';
import AgentsAssign from './AgentsAssign';
import AllAssignedUser from './AllAssignedUser';
import ProfileDetailsAgents from '../ProfileDetails/ProfileDetailsAgents';
import UploadedProfiles from '../UploadedProfiles/UploadedProfiles';
import AgentsAcceptedProfiles from './AgentsAcceptedProfiles';
import DeleteProfile from './DeleteProfile';
import AgentUploadProfiles from './AgentUploadProfiles';
import EditProfile from './EditProfile';
import EditProfilesByAgent from './EditProfilesByAgent';

const Stack = createStackNavigator();

const AgentsAssignStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false, }}>
      <Stack.Screen name="AgentsAssign" component={AgentsAssign} options={{ presentation: 'transparentModal' }}/>
      <Stack.Screen name="UserProfileDetails" component={UserProfileDetails} options={{ presentation: 'modal' }}/>
      <Stack.Screen name="ProfileDetailsAgents" component={ProfileDetailsAgents} options={{ presentation: 'transparentModal' }}/>
      <Stack.Screen name="AgentUploadProfiles" component={AgentUploadProfiles} options={{ presentation: 'transparentModal' }}/>
      <Stack.Screen name="UploadedProfiles" component={UploadedProfiles} options={{ presentation: 'transparentModal' }}/>
      <Stack.Screen name="AllAssignedUser" component={AllAssignedUser} options={{ presentation: 'transparentModal' }}/>
      <Stack.Screen name="AgentsAcceptedProfiles" component={AgentsAcceptedProfiles} options={{ presentation: 'transparentModal' }}/>
      <Stack.Screen name="DeleteProfile" component={DeleteProfile} options={{ presentation: 'transparentModal' }}/>
      <Stack.Screen name="EditProfile" component={EditProfile} options={{ presentation: 'transparentModal' }}/>
      <Stack.Screen name="EditProfilesByAgent" component={EditProfilesByAgent} options={{ presentation: 'modal' }}/>
    </Stack.Navigator>
  );
};

export default AgentsAssignStack;
