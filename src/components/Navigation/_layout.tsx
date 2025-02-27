import React, { useEffect, useRef, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AIcon from 'react-native-vector-icons/AntDesign';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import IIcon from 'react-native-vector-icons/Ionicons';
import MCIcon from 'react-native-vector-icons/MaterialIcons';
import { View, Text, StyleSheet, Dimensions, Alert, SafeAreaView, Animated, Easing, Modal } from 'react-native';
import HelpCenter from '../HelpCenter/HelpCenter';
import Steps from '../Steps/Steps'
import Chat from '../Chat/Chat';
import Home from '../Home/Home';
import Inbox from '../Inbox/Inbox';
import Matches from '../Matches/Matches';
import Prime from '../Prime/Prime';
import { enableScreens } from 'react-native-screens';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList, useDrawerStatus } from '@react-navigation/drawer';
import CreateProfile from '../CreateProfile/CreateProfile';
import HomeStack from '../Home/HomeStack';
import MatchesStack from '../Matches/MatchesStack';
import PrimeStack from '../Prime/PrimeStack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import useToastHook from '../../utils/useToastHook';
import AgentsStack from '../Agents/AgentsStack';
import { BadgeIndianRupee, Handshake, Heart, House, LogOut, Pencil, PhoneOutgoing, Trash, Trash2 } from 'lucide-react-native';
import TabBar from './TabBar';
import DrawerSceneWrapper from './draw';
import LottieView from 'lottie-react-native';

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
        tabBar={props => <TabBar {...props} />}
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
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const CustomDrawerContent = (props) => {
    const handleLogout = async () => {
      setLogoutModalVisible(true); // Show modal

      await AsyncStorage.removeItem('userToken');
      successToast('Logout Successful');

      setTimeout(() => {
        setLogoutModalVisible(false);
        navigation.replace('Auth');
      }, 1200);
    };

    const handleDeleteAccount = async () => {
      setDeleteModalVisible(true);
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
      setDeleteModalVisible(false);
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
            labelStyle={{ color: '#d3d3d3', fontWeight: '500' }}
            icon={() => <Animated.View>
              <Trash2 size={23} strokeWidth={1} color={'#d3d3d3'} />
            </Animated.View>}
          />
        </View>
        <Modal visible={logoutModalVisible} transparent animationType="fade">
          <View style={styles.overlay}>
            <View style={styles.modalContainer}>
              <Animated.View style={styles.lottiecontainer}><LottieView source={require('../../assets/animations/logout.json')} autoPlay loop={false} resizeMode='cover' style={styles.lottie} /></Animated.View>
            </View>
          </View>
        </Modal>

        <Modal visible={deleteModalVisible} transparent animationType="fade">
          <View style={styles.overlay}>
            <Animated.View style={styles.lottiecontainer}><LottieView source={require('../../assets/animations/logout.json')} autoPlay loop={false} resizeMode='cover' style={styles.lottie} /></Animated.View>
          </View>
        </Modal>
      </SafeAreaView >
    );
  };

  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: '#7b2a38',
          width: '61%'
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

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  lottiecontainer: {
    height: 'auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  lottie: {
    height: width / 2.5,
    width: width / 10,
  },
});



export default Layout;