import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, Dimensions, Alert, SafeAreaView, Image, TouchableOpacity } from 'react-native';
import { enableScreens } from 'react-native-screens';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import useToastHook from '../../utils/useToastHook';
import AgentsHomeStack from '../AgentsHome/AgentsHomeStack';
import AgentsAssignStack from '../AgentsAssign/AgentsAssignStack';
import AgentsEarn from '../AgentsEarn/AgentsEarn';
import { ArrowLeft, HandCoins, House, LayoutDashboard, LogOut, Phone, PhoneOutgoing, Trash } from 'lucide-react-native'
import TabBar from './TabBar';
import DrawerSceneWrapper from './draw';
import AgentsHelpCenter from '../HelpCenter/AgentsHelpCenter';
import LinearGradient from 'react-native-linear-gradient';


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


  );
};

const AgentsLayout = ({ navigation }) => {
  const { successToast, errorToast } = useToastHook();
  const CustomDrawerContent = (props) => {
    const currentUser = auth().currentUser;
    const [agentData, setAgentData] = useState();

    useEffect(() => {
      const getAgentData = async () => {
        const userDoc = await firestore().collection('agents').doc(currentUser?.uid).get();
        const userDataFirestore = userDoc.data();

        setAgentData(userDataFirestore)
      }

      getAgentData();
    }, [])

    const handleLogout = async () => {
      await AsyncStorage.removeItem('userToken');
      successToast('Logout Succcessful');

      navigation.replace('Auth');
    };

    const handleDeleteAccount = async () => {
      const userId = auth().currentUser?.uid;
      try {
        const userRef = firestore().collection('agents').doc(userId);
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
      <SafeAreaView style={styles.container}>
        <View style={styles.backButtonContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => props.navigation.goBack()}
          >
            <ArrowLeft size={24} color="#E9BA9B" />
          </TouchableOpacity>
        </View>
        <LinearGradient
          colors={['#7b2a38', '#7b2a38', '#7b2a38']}
          style={styles.headerGradient}
        >
          <View style={styles.profileContainer}>
            <View style={styles.profileImageContainer}>
              <Image
                source={{
                  uri: agentData?.profilepic ||
                    'https://static.vecteezy.com/system/resources/thumbnails/004/141/669/small/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg'
                }}
                style={styles.profileImage}
              />
            </View>
            <Text style={styles.userName}>{agentData?.fullname || 'User Name'}</Text>

            <View style={styles.infoRow}>
              <Phone size={16} color="#fff" />
              <Text style={styles.userInfo}>{agentData?.phonenumber || 'Phone Number'}</Text>
            </View>
          </View>
        </LinearGradient>

        <DrawerContentScrollView
          {...props}
          contentContainerStyle={styles.scrollViewContent}
        >
          <DrawerItemList
            {...props}
            activeTintColor="#4c669f"
            activeBackgroundColor="rgba(76, 102, 159, 0.1)"
            inactiveTintColor="#333"
            itemStyle={styles.drawerItem}
            labelStyle={styles.drawerLabel}
          />

          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <LogOut size={20} color="#fff" strokeWidth={1} />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </DrawerContentScrollView>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDeleteAccount}
        >
          <Trash size={18} color="#ff6b6b" strokeWidth={1} />
          <Text style={styles.deleteText}>Delete Account</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  };

  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: '#7b2a38',
          width: '100%'
        },
        drawerPosition: 'right',
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
          <PhoneOutgoing size={20} strokeWidth={1} color={'#fff'} />
        ),
        drawerLabelStyle: { color: '#fff', fontSize: 14 },
        drawerItemStyle: { backgroundColor: "rgba(255, 255, 255, 0.1)", borderRadius: 8, },
      }} />


    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#7b2a38',
  },
  backButtonContainer: {
    display: 'flex',
    alignItems: 'flex-start',
    padding: 10
  },
  backButton: {
    zIndex: 10, // Ensure it's above other elements
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 8,
    borderRadius: 20,
  },
  headerGradient: {
    paddingVertical: 30,
    paddingHorizontal: 16,
    borderBottomRightRadius: 30,
    borderTopLeftRadius: 30,
  },
  profileContainer: {
    alignItems: 'center',
  },
  profileImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.7)',
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  profileImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 12,
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  userInfo: {
    fontSize: 14,
    color: '#fff',
    marginLeft: 6,
  },
  scrollViewContent: {
    paddingTop: 20,
  },
  drawerItem: {
    borderRadius: 10,
    marginHorizontal: 10,
    marginVertical: 4,
  },
  drawerLabel: {
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  logoutText: {
    marginLeft: 26,
    fontSize: 14,
    fontWeight: '500',
    color: '#fff',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
  },
  deleteText: {
    marginLeft: 16,
    fontSize: 14,
    fontWeight: '500',
    color: '#ff6b6b',
  },
});

export default AgentsLayout;
