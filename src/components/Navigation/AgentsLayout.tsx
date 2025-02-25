import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, Dimensions, Alert, SafeAreaView } from 'react-native';
import { enableScreens } from 'react-native-screens';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import useToastHook from '../../utils/useToastHook';
import AgentsHomeStack from '../AgentsHome/AgentsHomeStack';
import AgentsAssignStack from '../AgentsAssign/AgentsAssignStack';
import AgentsEarn from '../AgentsEarn/AgentsEarn';
import { HandCoins, House, LayoutDashboard, LogOut, PhoneOutgoing, Trash } from 'lucide-react-native'
import TabBar from './TabBar';
import DrawerSceneWrapper from './draw';
import AgentsHelpCenter from '../HelpCenter/AgentsHelpCenter';


const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
enableScreens();

const { height } = Dimensions.get('window');

const AgentsBottomTabs = () => {
  return (
    <DrawerSceneWrapper>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: { backgroundColor: '#D9D9D9', height: height / 16 },
          tabBarActiveTintColor: 'black',
          tabBarLabelStyle: { fontWeight: 'bold', fontSize: 15 },
        }}
        tabBar={props => <TabBar {...props} />}
      >
        <Tab.Screen
          name="AgentsHomeStack"
          component={AgentsHomeStack}
          options={{
            tabBarIcon: ({ color, size }) => (
              <House size={23} strokeWidth={1} />
            ),
            title: 'Home',
          }}
        />

        <Tab.Screen
          name="AgentsAssignStack"
          component={AgentsAssignStack}
          options={{
            tabBarIcon: ({ color, size }) => (
              <LayoutDashboard size={23} strokeWidth={1} />
            ),
            title: 'Dashboard',
          }}
        />
        <Tab.Screen
          name="AgentsEarn"
          component={AgentsEarn}
          options={{
            tabBarIcon: ({ color, size }) => (
              <HandCoins size={23} strokeWidth={1} />
            ),
            title: 'Earn',
          }}
        />
      </Tab.Navigator>
    </DrawerSceneWrapper>

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
        component={AgentsBottomTabs}
        options={{
          drawerLabel: () => null,
          title: null,
          drawerItemStyle: { height: 0 },
        }}
      />

      <Drawer.Screen name="Help Center" component={AgentsHelpCenter} options={{
        drawerIcon: ({ focused, size }) => (
          <PhoneOutgoing size={23} strokeWidth={1} color={'#fff'} />
        ),
        drawerLabelStyle: { color: '#fff' }
      }} />


    </Drawer.Navigator>
  );
};



export default AgentsLayout;
