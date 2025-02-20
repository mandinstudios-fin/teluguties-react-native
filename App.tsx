import { View, Text, SafeAreaView, LogBox, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import '@react-native-firebase/app';
import firebase from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';
import SplashScreen from './src/components/SplashScreen/SplashScreen';
import Navigator from './src/components/Navigation/Navigator';
import { ToastProvider } from 'react-native-toast-notifications';
import Icon from 'react-native-vector-icons/Entypo'
import { refreshFCMTokenIfNeeded, requestUserMessagingPermission } from './src/utils';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
  'VirtualizedLists should never be nested inside plain ScrollViews with the same orientation because it can break windowing and other functionality',
]);

const firebaseConfig = {
  apiKey: 'AIzaSyBB5BIlokO-Ym7svGGpOhwQJgVhr8hToqQ',
  authDomain: 'teluguties-87c0d.firebaseapp.com',
  projectId: 'teluguties-87c0d',
  storageBucket: 'teluguties-87c0d.firebasestorage.app',
  messagingSenderId: '870581908802',
  appId: '1:870581908802:web:9d6938863cca27c9af84db',
  measurementId: 'G-W1Z145H9Y4',
};

const SuccessIcon = () => {
  return (
    <Icon name="check" size={20} color="#f5f5f5" />
  )
}

const DangerIcon = () => {
  return (
    <Icon name="cross" size={20} color="#f5f5f5" />
  )
}

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    requestUserMessagingPermission();
    refreshFCMTokenIfNeeded();
  }, []);

  useEffect(() => {
    const unsubscribe = messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('New notification:', remoteMessage);
      Alert.alert(remoteMessage.notification.title, remoteMessage.notification.body);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    } else {
      firebase.app();
    }
  }, []);

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <ToastProvider
      placement="top"
      duration={2000}
      animationType="slide-in"
      animationDuration={250}
      successColor="#7b2a38"
      dangerColor="#ff0033"
      successIcon={<SuccessIcon />}
      dangerIcon={<DangerIcon />}>
      <Navigator />
    </ToastProvider>
  );
};

export default App;
