import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AIcon from 'react-native-vector-icons/AntDesign';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import IIcon from 'react-native-vector-icons/Ionicons';
import { View, Text, StyleSheet, Dimensions, Alert } from 'react-native';
import HelpCenter from '../HelpCenter/HelpCenter';

import Chat from '../Chat/Chat';
import Home from '../Home/Home';
import Inbox from '../Inbox/Inbox';
import Matches from '../Matches/Matches';
import Prime from '../Prime/Prime';
import { enableScreens } from 'react-native-screens';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import ProfileDetails from '../ProfileDetails/ProfileDetails';
import CreateProfile from '../CreateProfile/CreateProfile';
import HomeStack from '../Home/HomeStack';
import MatchesStack from '../Matches/MatchesStack';
import PrimeStack from '../Prime/PrimeStack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import { errorToast, successToast } from '../../utils';


const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
enableScreens();

const { height } = Dimensions.get('window');

const BottomTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: '#D9D9D9', height: height / 16 },
        tabBarActiveTintColor: 'black',
        tabBarLabelStyle: { fontWeight: 'bold', fontSize: 15 },
      }}>
      <Tab.Screen
        name="HomeStack"
        component={HomeStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <IIcon name="home-outline" color={color} size={size} />
          ),
          title: 'Home',
        }}
      />

      <Tab.Screen
        name="MatchesStack"
        component={MatchesStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <IIcon name="heart-outline" color={color} size={size} />
          ),
          title: 'Matches',
        }}
      />
      <Tab.Screen
        name="PrimeStack"
        component={PrimeStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <IIcon name="star-outline" color={color} size={size} />
          ),
          title: 'Prime',
        }}
      />
    </Tab.Navigator>
  );
};

const Layout = ({ navigation }) => {
  const CustomDrawerContent = (props) => {
    const handleLogout = async () => {
      await AsyncStorage.removeItem('userToken');
      successToast('Logout Succcessful');

      navigation.replace('Auth');
    };

    const handleDeleteAccount = async () => {
      const userId = auth().currentUser?.uid;
      try {
        const userRef = firestore().collection('profiles').doc(userId);
        await userRef.delete();

        const requestsRef = firestore().collection('requests').where('fromUid', '==', userId);
        const requestsSnapshot = await requestsRef.get();
        requestsSnapshot.forEach(async (doc) => {
          await doc.ref.delete();
        });

        const queriesRef = firestore().collection('queries').where('userId', '==', userId);
        const queriesSnapshot = await queriesRef.get();
        queriesSnapshot.forEach(async (doc) => {
          await doc.ref.delete();
        });
        await AsyncStorage.removeItem('userToken');

        successToast(`Account Deleted Successfully`);

        navigation.replace('Auth');
      } catch (error) {
        console.log(error)
        errorToast('Something Went Wrong')
      }
    };


    return (
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
        <DrawerItem
          label="Logout"
          onPress={handleLogout} // Executes the function on press
          labelStyle={{ color: '#561825', fontWeight: 'bold' }}
          icon={() => <AIcon name="logout" size={20} color="#561825" />}
        />


        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
          <DrawerItem
            label="Delete Account"
            onPress={handleDeleteAccount}
            labelStyle={{ color: 'red', fontWeight: 'bold' }}
            icon={() => <AIcon name="delete" size={20} color="red" />}
          />
        </View>

      </DrawerContentScrollView>
    );
  };

  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: '#f5f5f5',
        },
        drawerLabelStyle: {
          color: '#561825', // Set your desired text color
          fontWeight: 'bold', // Optional: make text bold
        },
        drawerActiveTintColor: '#E9BA9B',
        drawerInactiveTintColor: '#000',
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen
        name="Tabs"
        component={BottomTabs}
        options={{
          drawerLabel: () => null,
          title: null,
          drawerItemStyle: { height: 0 },
        }}
      />
      <Drawer.Screen name="Create Profile" component={CreateProfile} options={{
        drawerIcon: ({ focused, size }) => (
          <MIcon
            name="create" // Change this to any icon you prefer
            size={size}
            color={focused ? '#E9BA9B' : '#561825'}  // Change color when active
          />
        ),

      }} />

      <Drawer.Screen name="Help Center" component={HelpCenter} options={{
        drawerIcon: ({ focused, size }) => (
          <MIcon
            name="add-call" // Change this to any icon you prefer
            size={size}
            color={focused ? '#E9BA9B' : '#561825'}  // Change color when active
          />
        ),
      }} />

    </Drawer.Navigator>
  );
};

export default Layout;
