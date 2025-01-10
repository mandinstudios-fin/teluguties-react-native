import { View, Text, SafeAreaView, LogBox } from 'react-native';
import React, { useEffect, useState } from 'react';
import '@react-native-firebase/app';
import firebase from '@react-native-firebase/app';
import Navigator from './src/components/Navigation/Navigator';
import { ToastProvider } from 'react-native-toast-notifications';
import SplashScreen from 'react-native-splash-screen';
import Icon from 'react-native-vector-icons/Entypo'

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
 

  useEffect(() => {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    } else {
      firebase.app();
    }
  }, []);

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  

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
