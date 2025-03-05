import React, { useEffect, useRef, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, Dimensions, Alert, SafeAreaView, Animated, Easing, Modal, Image, TouchableOpacity } from 'react-native';
import HelpCenter from '../HelpCenter/HelpCenter';
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
import { ArrowLeft, BadgeIndianRupee, Handshake, Heart, House, LogOut, Pencil, PhoneOutgoing, Trash, Trash2 } from 'lucide-react-native';
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
  );
};

const Layout = ({ navigation }) => {
  const { successToast, errorToast } = useToastHook()

  const CustomDrawerContent = (props) => {
    const [logoutModalVisible, setLogoutModalVisible] = useState(false)
    const [deleteModalVisible, setDeleteModalVisible] = useState(false)
    const [userProfile, setUserProfile] = useState({
      name: "John Doe",
      email: "john.doe@example.com",
      photoURL: "https://placeholder.svg?height=80&width=80",
    })

    // Fetch user profile on component mount
    useEffect(() => {
      const fetchUserProfile = async () => {
        const userId = auth().currentUser?.uid
        if (userId) {
          try {
            const userDoc = await firestore().collection("profiles").doc(userId).get()
            if (userDoc.exists) {
              setUserProfile({
                name: userDoc.data()?.personalInformation?.firstName,
                email: userDoc.data()?.contactInformation.phone,
                photoURL: userDoc.data()?.contactInformation?.profilePicture || "https://placeholder.svg?height=80&width=80",
              })
            }
          } catch (error) {
            console.log("Error fetching user profile:", error)
          }
        }
      }

      fetchUserProfile()
    }, [])

    const handleLogout = async () => {
      setLogoutModalVisible(true) // Show modal
      await AsyncStorage.removeItem("userToken")
      successToast("Logout Successful")
      setTimeout(() => {
        setLogoutModalVisible(false)
        props.navigation.replace("Auth")
      }, 1200)
    }

    const handleDeleteAccount = async () => {
      setDeleteModalVisible(true)
      const userId = auth().currentUser?.uid
      try {
        const userRef = firestore().collection("profiles").doc(userId)
        await userRef.delete()
        const tempUserRef = firestore().collection("temp_profiles").doc(userId)
        await tempUserRef.delete()
        const requestsRef = firestore().collection("requests").where("fromUid", "==", userId)
        const requestsSnapshot = await requestsRef.get()
        requestsSnapshot.forEach(async (doc) => {
          await doc.ref.delete()
        })
        const queriesRef = firestore().collection("queries").where("userId", "==", userId)
        const queriesSnapshot = await queriesRef.get()
        queriesSnapshot.forEach(async (doc) => {
          await doc.ref.delete()
        })
        await AsyncStorage.removeItem("userToken")
        successToast("Account Deleted Successfully")
        props.navigation.replace("Auth")
      } catch (error) {
        console.log(error)
        errorToast("Something Went Wrong")
      }
      setDeleteModalVisible(false)
    }

    return (
      <SafeAreaView style={styles.container}>
        {/* Profile Section */}

        <View style={styles.backButtonContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => props.navigation.goBack()}
          >
            <ArrowLeft size={24} color="#E9BA9B" />
          </TouchableOpacity>
        </View>
        <View style={styles.profileContainer}>
          {/* Back Arrow */}

          <View style={styles.profileImageContainer}>
            <Image
              source={{ uri: userProfile.photoURL }}
              style={styles.profileImage}
            />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{userProfile.name}</Text>
            <Text style={styles.profileEmail}>{userProfile.email}</Text>
          </View>
          <TouchableOpacity style={styles.editProfileButton} onPress={() => props.navigation.navigate("Edit Profile")}>
            <Pencil size={16} color="#E9BA9B" />
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        {/* Drawer Items */}
        <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerContent}>
          <DrawerItemList {...props} />

          <DrawerItem
            label="Logout"
            onPress={handleLogout}
            labelStyle={styles.drawerItemLabel}
            style={styles.drawerItem}
            icon={() => <LogOut size={23} strokeWidth={1} color={"#fff"} />}
          />
        </DrawerContentScrollView>

        {/* Bottom Actions */}
        <View style={styles.bottomActions}>
          <DrawerItem
            label="Delete Account"
            onPress={handleDeleteAccount}
            labelStyle={styles.deleteButtonText}
            style={styles.deleteButton}
            icon={() => (
              <Animated.View>
                <Trash2 size={23} strokeWidth={1} color={"#D3D3D3"} />
              </Animated.View>
            )}
          />
        </View>

        {/* Modals */}
        <Modal visible={logoutModalVisible} transparent animationType="fade">
          <View style={styles.overlay}>
            <View style={styles.modalContainer}>
              <Animated.View style={styles.lottieContainer}>
                <LottieView
                  source={require("../../assets/animations/logout.json")}
                  autoPlay
                  loop={false}
                  resizeMode="cover"
                  style={styles.lottie}
                />
              </Animated.View>
              <Text style={styles.modalText}>Logging out...</Text>
            </View>
          </View>
        </Modal>

        <Modal visible={deleteModalVisible} transparent animationType="fade">
          <View style={styles.overlay}>
            <Animated.View style={styles.lottieContainer}>
              <LottieView
                source={require("../../assets/animations/logout.json")}
                autoPlay
                loop={false}
                resizeMode="cover"
                style={styles.lottie}
              />
              <Text style={styles.modalText}>Deleting account...</Text>
            </Animated.View>
          </View>
        </Modal>
      </SafeAreaView>
    )
  }

  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: "#7B2A38",
          width: "100%",
          borderTopRightRadius: 15,
          borderBottomRightRadius: 15,
        },
        drawerPosition: "right",
        drawerLabelStyle: {
          color: "#fff",
          fontWeight: "500",
          marginLeft: -15,
        },
        sceneContainerStyle: {
          backgroundColor: "white",
        },
        drawerActiveTintColor: "#E9BA9B",
        drawerInactiveTintColor: "#fff",
        drawerActiveBackgroundColor: "rgba(233, 186, 155, 0.15)",
        swipeEnabled: true,
        swipeEdgeWidth: 50,
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
          drawerIcon: ({ focused, size }) => <Pencil size={23} strokeWidth={1} color={"#fff"} />,
          drawerLabelStyle: { color: "#fff" },
        }}
      />
      <Drawer.Screen
        name="Help Center"
        component={HelpCenter}
        options={{
          drawerIcon: ({ focused, size }) => <PhoneOutgoing size={23} strokeWidth={1} color={"#fff"} />,
          drawerLabelStyle: { color: "#fff" },
        }}
      />
    </Drawer.Navigator>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7B2A38",
    width: '100%'
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
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
  },

  profileImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#E9BA9B20",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
    borderWidth: 1,
    borderColor: "rgba(233, 186, 155, 0.3)",
  },
  profileImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: "#E9BA9B",
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  profileEmail: {
    color: "#E9BA9B",
    fontSize: 14,
    opacity: 0.8,
  },
  editProfileButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(233, 186, 155, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    marginHorizontal: 20,
    marginBottom: 15,
  },
  drawerContent: {
    paddingTop: 10,
  },
  drawerItem: {
    borderRadius: 8,
    marginVertical: 4,
  },
  drawerItemLabel: {
    color: "#fff",
    fontWeight: "500",
    fontSize: 14,
  },
  bottomActions: {
    padding: 10,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
    marginTop: "auto",
  },
  deleteButton: {
    borderRadius: 8,
    backgroundColor: "rgba(255, 0, 0, 0.1)",
  },
  deleteButtonText: {
    color: "#D3D3D3",
    fontWeight: "500",
    fontSize: 14,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: width * 0.8,
    maxWidth: 300,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  lottieContainer: {
    width: 120,
    height: 120,
    justifyContent: "center",
    alignItems: "center",
  },
  lottie: {
    width: "100%",
    height: "100%",
  },
  modalText: {
    fontSize: 18,
    color: "#333",
    fontWeight: "500",
    textAlign: "center",
    marginTop: 10,
  },
});



export default Layout;