import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AIcon from 'react-native-vector-icons/AntDesign';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import IIcon from 'react-native-vector-icons/Ionicons';
import FIcon from 'react-native-vector-icons/AntDesign';
import { View, Text, StyleSheet, Dimensions, Alert, SafeAreaView } from 'react-native';
import HelpCenter from '../HelpCenter/HelpCenter';
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
import useToastHook from '../../utils/useToastHook';
import AgentsStack from '../Agents/AgentsStack';
import AgentsHomeStack from '../AgentsHome/AgentsHomeStack';
import Category from '../Auth/Category';
import AgentsAssign from '../AgentsAssign/AgentsAssign';
import AgentsAssignStack from '../AgentsAssign/AgentsAssignStack';
import AgentsEarn from '../AgentsEarn/AgentsEarn';


const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
enableScreens();

const { height } = Dimensions.get('window');

const AgentsBottomTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: '#D9D9D9', height: height / 16 },
        tabBarActiveTintColor: 'black',
        tabBarLabelStyle: { fontWeight: 'bold', fontSize: 15 },
      }}>
      <Tab.Screen
        name="AgentsHomeStack"
        component={AgentsHomeStack}
        options={{  
          tabBarIcon: ({ color, size }) => (
            <IIcon name="home-outline" color={color} size={size} />
          ),
          title: 'Home',
        }}
      />

      <Tab.Screen
        name="AgentsAssignStack"
        component={AgentsAssignStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FIcon name="dashboard" color={color} size={size} />
          ),
          title: 'Dashboard',
        }}
      />
      <Tab.Screen
        name="AgentsEarn"
        component={AgentsEarn}
        options={{
          tabBarIcon: ({ color, size }) => (
            <IIcon name="star-outline" color={color} size={size} />
          ),
          title: 'Earn',
        }}
      />
    </Tab.Navigator>
  );
};

const AgentsLayout = ({ navigation }) => {
  const { successToast, errorToast } = useToastHook();
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
      <SafeAreaView style={{ flex: 1 }}>
        <DrawerContentScrollView {...props}>
          <DrawerItemList {...props} />
          <DrawerItem
            label="Logout"
            onPress={handleLogout}
            labelStyle={{ color: '#561825', fontWeight: 'bold' }}
            icon={() => <AIcon name="logout" size={20} color="#561825" />}
          />
        </DrawerContentScrollView>
        <View style={{ flex: 1, justifyContent: 'flex-end', paddingBottom: 10 }}>
          <DrawerItem
            label="Delete Account"
            onPress={handleDeleteAccount}
            labelStyle={{ color: 'red', fontWeight: 'bold' }}
            icon={() => <AIcon name="delete" size={20} color="red" />}
          />
        </View>
      </SafeAreaView>
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
          color: '#561825',
          fontWeight: 'bold',
        },
        drawerActiveTintColor: '#E9BA9B',
        drawerInactiveTintColor: '#000',
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen
        name="Tabs"
        component={AgentsBottomTabs}
        options={{
          drawerLabel: () => null,
          title: null,
          drawerItemStyle: { height: 0 },
        }}
      />

      <Drawer.Screen name="Help Center" component={HelpCenter} options={{
        drawerIcon: ({ focused, size }) => (
          <MIcon
            name="add-call"
            size={size}
            color={focused ? '#E9BA9B' : '#561825'}
          />
        ),
      }} />


    </Drawer.Navigator>
  );
};



export default AgentsLayout;
