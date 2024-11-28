import { View, Text, SafeAreaView, LogBox } from 'react-native'
import React, { useEffect, useState } from 'react'
import '@react-native-firebase/app';
import firebase from '@react-native-firebase/app'
import SplashScreen from './src/components/SplashScreen/SplashScreen';
import Navigator from './src/components/Navigation/Navigator';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
  'VirtualizedLists should never be nested inside plain ScrollViews with the same orientation because it can break windowing and other functionality'
]);


const firebaseConfig = {
  apiKey: "AIzaSyBB5BIlokO-Ym7svGGpOhwQJgVhr8hToqQ",
  authDomain: "teluguties-87c0d.firebaseapp.com",
  projectId: "teluguties-87c0d",
  storageBucket: "teluguties-87c0d.firebasestorage.app",
  messagingSenderId: "870581908802",
  appId: "1:870581908802:web:9d6938863cca27c9af84db",
  measurementId: "G-W1Z145H9Y4"
};

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false); 
    }, 3000);

    return () => clearTimeout(timer); 
  }, []);

  useEffect(() => {
    if(!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig)
    } else {
      firebase.app();
    }
  }, [])

  if(loading) {
    return <SplashScreen />
  }

  return (
        <Navigator />
    
  );
}

export default App