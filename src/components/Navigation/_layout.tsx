import React, { useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AIcon from 'react-native-vector-icons/AntDesign';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import IIcon from 'react-native-vector-icons/Ionicons';
import MCIcon from 'react-native-vector-icons/MaterialIcons';
import { View, Text, StyleSheet, Dimensions, Alert, SafeAreaView, Animated, Easing } from 'react-native';
import HelpCenter from '../HelpCenter/HelpCenter';
import Steps from '../Steps/Steps'
import Chat from '../Chat/Chat';
import Home from '../Home/Home';
import Inbox from '../Inbox/Inbox';
import Matches from '../Matches/Matches';
import Prime from '../Prime/Prime';
import { enableScreens } from 'react-native-screens';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import CreateProfile from '../CreateProfile/CreateProfile';
import HomeStack from '../Home/HomeStack';
import MatchesStack from '../Matches/MatchesStack';
import PrimeStack from '../Prime/PrimeStack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import useToastHook from '../../utils/useToastHook';
import AgentsStack from '../Agents/AgentsStack';
import { BadgeIndianRupee, Handshake, Heart, House, LogOut, Pencil, PhoneOutgoing, Trash } from 'lucide-react-native';
import TabBar from './TabBar';
import DrawerSceneWrapper from './draw';

const { width } = Dimensions.get("window");

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
const DRAWER_WIDTH = width * 0.75;
enableScreens();

const { height } = Dimensions.get('window');

const BottomTabs = () => {
  return (
    <DrawerSceneWrapper>
      <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      tabBar={props => <TabBar {...props}/>}
      >
      <Tab.Screen
        name="HomeStack"
        component={HomeStack}
        options={{
          
          title: 'Home',
        }}
      />

      <Tab.Screen
        name="MatchesStack"
        component={MatchesStack}
        options={{
          
          title: 'Matches',
        }}
      />
      <Tab.Screen
        name="PrimeStack"
        component={PrimeStack}
        options={{
          
          title: 'Packages',
        }}
      />
      <Tab.Screen
        name="AgentsStack"
        component={AgentsStack}
        options={{
          
          title: 'Agent',
        }}
      />
    </Tab.Navigator>
    </DrawerSceneWrapper>
  );
};

const Layout = ({ navigation }) => {
  const { successToast, errorToast } = useToastHook();
  const translateX = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  const openDrawer = () => {
    Animated.parallel([
      Animated.spring(translateX, {
        toValue: 0,
        bounciness: 8,
        speed: 10,
        useNativeDriver: true,
      }),
      Animated.timing(overlayOpacity, {
        toValue: 0.7,
        duration: 400,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeDrawer = () => {
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: -DRAWER_WIDTH,
        duration: 300,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const animatedOpen = () => {
    openDrawer();
    navigation.openDrawer();
  };

  const animatedClose = () => {
    closeDrawer();
    navigation.closeDrawer();
  };

  const CustomDrawerContent = (props) => {
    const handleLogout = async () => {
      await AsyncStorage.removeItem('userToken');
      successToast('Logout Successful');
      navigation.replace('Auth');
    };

    const handleDeleteAccount = async () => {
      const userId = auth().currentUser?.uid;
      try {
        const userRef = firestore().collection('profiles').doc(userId);
        await userRef.delete();

        const tempUserRef = firestore().collection('temp_profiles').doc(userId);
        await tempUserRef.delete();

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
        successToast('Account Deleted Successfully');
        navigation.replace('Auth');
      } catch (error) {
        console.log(error);
        errorToast('Something Went Wrong');
      }
    };

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <DrawerContentScrollView {...props}>
          <DrawerItemList {...props} />
          <DrawerItem
            label="Logout"
            onPress={handleLogout}
            labelStyle={{ color: '#fff', fontWeight: '500' }}
            icon={() => <LogOut size={23} strokeWidth={1} color={'#fff'} />}
          />
        </DrawerContentScrollView>
        <View style={{ flex: 1, justifyContent: 'flex-end', paddingBottom: 10 }}>
          <DrawerItem
            label="Delete Account"
            onPress={handleDeleteAccount}
            labelStyle={{ color: 'red', fontWeight: '500' }}
            icon={() => <Trash size={23} strokeWidth={1} color={'red'} />}
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
          backgroundColor: '#7b2a38',
          width:'61%'
        },
        drawerLabelStyle: {
          color: '#561825',
          fontWeight: '500',
        },
        sceneContainerStyle: {
          backgroundColor: 'white',
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
      <Drawer.Screen
        name="Edit Profile"
        component={CreateProfile}
        options={{
          drawerIcon: ({ focused, size }) => <Pencil size={23} strokeWidth={1} color={'#fff'} />,
          drawerLabelStyle: { color: '#fff' }
        }}
      />
      <Drawer.Screen
        name="Help Center"
        component={HelpCenter}
        options={{
          drawerIcon: ({ focused, size }) => <PhoneOutgoing size={23} strokeWidth={1} color={'#fff'} />,
          drawerLabelStyle: { color: '#fff' }
        }}
      />
    </Drawer.Navigator>
  );
};



export default Layout;