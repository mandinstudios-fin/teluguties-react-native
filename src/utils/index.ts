import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth';
import messaging from '@react-native-firebase/messaging';
import { Platform, PermissionsAndroid } from 'react-native';
import AIcon from 'react-native-vector-icons/AntDesign';
import api from '../constants/axios';
import { API_ENDPOINTS } from '../constants';

const FCM_SERVER_KEY = "c4e5433f9d4bff9cab1de709533218061b4cdbab";
export const notificationBackend = `http://192.168.1.13:5000/`

export const DATA = Array.from({ length: 20 }, (_, i) => ({
  id: `${i + 1}`,
  imgSource: { uri: `https://picsum.photos/200/200?random=${i}` }, // Random image with a unique signature
  name: `Item ${i + 1}`,
}));

export const data = [
  { id: '1', heading: 'Boosted Profile Visibility: ', text: 'Stand out in searches.' },
  { id: '2', heading: 'Unlimited Messaging: ', text: 'Chat freely with matches.' },
  { id: '3', heading: 'Advanced Filters: ', text: 'Find matches based on specific criteria.' },
  { id: '4', heading: 'Profile Verification: ', text: 'Build trust with verified profiles .' },
  { id: '5', heading: 'Expert Matchmaking Help: ', text: 'Get personalized support in your search.' },
  { id: '6', heading: 'Enhanced Search Options: ', text: 'Discover matches that truly fit your perference.' },
  { id: '7', heading: 'Real-Time-Notification: ', text: 'Stay updated on message and profile views.' },
  { id: '8', heading: 'Community Engagement: ', text: 'Connect with like-minded singles in our forums.' },
];

export const MANAGED_PROFILES = [
  {
    id: 1,
    label: 'Delete',
    logo: '',
    screen: 'DeleteUserProfiles'
  },
  {
    id: 2,
    label: 'Edit',
    logo: '',
    screen: 'EditUserProfiles'
  },
  {
    id: 1,
    label: 'Uploaded Profiles',
    logo: '',
    screen: 'AgentUploadProfiles'
  },
  {
    id: 1,
    label: 'Accepted',
    logo: '',
    screen: 'AgentAcceptedProfiles'
  }
]

export const getFirstName = (name: string) => {
  return name && name.split(' ')[0];
};

export const getUsersAge = (date_of_birth: string | null | undefined): number => {
  if (!date_of_birth) return 0;

  try {
    // Replace slashes with dashes for consistent parsing
    const formattedDate = date_of_birth.replace(/\//g, '-');
    const birthDate = new Date(Date.parse(formattedDate));

    if (isNaN(birthDate.getTime())) {
      console.warn("Invalid date format for:", date_of_birth);
      return 0;
    }

    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();

    if (
      today.getMonth() < birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  } catch (error) {
    console.error("Date parsing error:", error);
    return 0;
  }
};

export const getTodaysDate = () => {
  const isoDate = new Date();

  const day = isoDate.getDate().toString().padStart(2, '0');
  const month = (isoDate.getMonth() + 1).toString().padStart(2, '0');
  const year = isoDate.getFullYear();
  const hours = isoDate.getHours().toString().padStart(2, '0');
  const minutes = isoDate.getMinutes().toString().padStart(2, '0');
  const seconds = isoDate.getSeconds().toString().padStart(2, '0');

  const customFormattedDate = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  return customFormattedDate;
};

export const compareDate = (dateToCompare) => {
  const today = new Date();

  const compareDate = new Date(dateToCompare);

  return today >= compareDate;
};

export const formatDate = (date) => {
  const isoDate = new Date(date);

  const customFormattedDate = `${isoDate.getDate()}/${isoDate.getMonth() + 1}/${isoDate.getFullYear()} ${isoDate.getHours()}:${isoDate.getMinutes()}:${isoDate.getSeconds()}`;

  return customFormattedDate
}

export const isUserAccepted = async (userId) => {
  try {
    const currentUser = auth().currentUser;
    if (!currentUser) {
      console.error("User not authenticated");
      return false;
    }

    const agentRef = firestore().collection('agents').doc(currentUser.uid);
    const agentDoc = await agentRef.get();

    if (!agentDoc.exists) {
      return false;
    }

    const acceptedRequests = agentDoc.data()?.accepted_requests || [];
    return acceptedRequests.includes(userId);

  } catch (error) {
    console.error("Error checking accepted requests:", error);
    return false;
  }
}

export const isUserRejected = async (userId) => {
  try {
    const currentUser = auth().currentUser;
    if (!currentUser) {
      console.error("User not authenticated");
      return false;
    }

    const agentRef = firestore().collection('agents').doc(currentUser.uid);
    const agentDoc = await agentRef.get();

    if (!agentDoc.exists) {
      return false;
    }

    const rejectedRequests = agentDoc.data()?.rejected_requests || [];
    return rejectedRequests.includes(userId);

  } catch (error) {
    console.error("Error checking accepted requests:", error);
    return false;
  }
}

export const getUserCategory = async () => {
  try {
    const currentUser = auth().currentUser;
    if (!currentUser) {
      console.error("Error: userToken is undefined or null");
      return;
    }

    const response = await api.get(API_ENDPOINTS.getCategory, {
      params: {
        uid: currentUser.uid,
      },
    });

    return response.data.origin;
  } catch (error) {
    console.error("Firestore query error:", error);
    return null;
  }
}

export const getUserDetailsByCategory = async () => {
  const uid = auth().currentUser?.uid;
  try {
    const response = await api.get(API_ENDPOINTS.profilesGetUserDetails, {
        params: { uid },
    });

    const updatedData = snakeToCamelCase(response.data)
    return updatedData;
} catch (error) {
    console.error("Error fetching user details:", error);
    return null;
}
}

export const getUserCategoryFromToken = async (token) => {
  try {
    if (!token) {
      console.error("Error: userToken is undefined or null");
      return;
    }

    const response = await api.get(API_ENDPOINTS.getCategory, {
      params: {
        uid: token
      },
    });

    return response.data.origin;
  } catch (error) {
    console.error("Firestore query error:", error);
    return null;
  }
}

export const isAgentAssignedForProfileB = async (profile_a_id, profile_b_id) => {
  const profile_a_id_Ref = firestore().collection('profiles').doc(profile_a_id);
  const profile_a_id_Doc = await profile_a_id_Ref.get();

  const agent_assigned = profile_a_id_Doc.data()?.agent_assigned || [];
  const alreadyAssigned = agent_assigned?.some((assigned) => assigned.profile_b_id === profile_b_id);

  if(alreadyAssigned) {
    return true;
  } else {
    return false;
  }
}

export const isProfileBInMatches = async (profile_a_id, profile_b_id) => {
  const profile_a_id_Ref = firestore().collection('profiles').doc(profile_a_id);
  const profile_a_id_Doc = await profile_a_id_Ref.get();

  const matches = profile_a_id_Doc.data()?.matches || [];
  const alreadyAssigned = matches.includes(profile_b_id)

  if(alreadyAssigned) {
    return true;
  } else {
    return false;
  }
}

export const fetchProfile = async (profileId) => {
  const profileDoc = await firestore().collection('profiles').doc(profileId).get();
  if (profileDoc.exists) {
      return { id: profileId, ...profileDoc.data() };
  }
  return null;
};

export const requestUserMessagingPermission = async () => {
  if (Platform.OS === 'ios') {
    await messaging().requestPermission();
  } else if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }
};

export const refreshFCMTokenIfNeeded = async () => {
  const user = auth().currentUser;
  if (!user) return;

  const userDoc = await firestore().collection('profiles').doc(user.uid).get();
  if (!userDoc.exists || !userDoc.data()?.fcmToken) {
    console.log("FCM token missing, refreshing...");
    
    const newToken = await messaging().getToken();
    await firestore().collection('profiles').doc(user.uid).update({ fcmToken: newToken });

    console.log("Updated FCM Token:", newToken);
  }
};

export const getFCMToken = async () => {
  try {
    const token = await messaging().getToken();
    console.log('FCM Token:', token);
    return token;
  } catch (error) {
    console.error('Error getting FCM token:', error);
  }
};

export const sendPushNotification = async (userId, title, body) => {
  try {
    const response = await fetch(`${notificationBackend}send-notification`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, title, body }),
    });

    const data = await response.json();
    if (response.ok) {
      console.log("Notification sent successfully:", data);
    } else {
      console.error("Failed to send notification:", data.error);
    }
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};

export function calculateAge(dateOfBirth) {
  // Split the date string into day, month, and year
  if(!dateOfBirth) return 0;

  const [day, month, year] = dateOfBirth.split('/').map(Number);

  // Create a birthdate object
  const birthDate = new Date(year, month - 1, day); // Month is 0-based in JS

  // Get today's date
  const today = new Date();

  // Calculate the age
  let age = today.getFullYear() - birthDate.getFullYear();

  // Adjust age if birthday hasn't occurred yet this year
  if (
    today.getMonth() < birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
}

const toCamelCase = (str: string): string =>
  str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());

export const snakeToCamelCase = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(snakeToCamelCase);
  } else if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((acc: any, key: string) => {
      const camelKey = toCamelCase(key);
      acc[camelKey] = snakeToCamelCase(obj[key]);
      return acc;
    }, {});
  }
  return obj;
};

const toSnakeCase = (str: string): string =>
  str.replace(/([A-Z])/g, '_$1').toLowerCase();

export const camelToSnakeCase = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(camelToSnakeCase);
  } else if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((acc: any, key: string) => {
      const snakeKey = toSnakeCase(key);
      acc[snakeKey] = camelToSnakeCase(obj[key]);
      return acc;
    }, {});
  }
  return obj;
};

export function getChangedFieldsWithOriginalValues(userData, fireStoreData) {
  const result = {};

  for (const key in userData) {
    const userVal = userData[key];
    const storeVal = fireStoreData ? fireStoreData[key] : undefined;

    if (
      typeof userVal === 'object' &&
      userVal !== null &&
      !Array.isArray(userVal)
    ) {
      const nested = getChangedFieldsWithOriginalValues(userVal, storeVal || {});
      if (Object.keys(nested).length > 0) {
        result[key] = nested;
      }
    } else if (userVal !== storeVal) {
      result[key] = userVal; // return updated value from userData
    }
  }

  return result;
}
