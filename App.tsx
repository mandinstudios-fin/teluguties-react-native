import { View, Text, SafeAreaView } from 'react-native'
import React, { useEffect, useState } from 'react'
import FirebaseAppProvider from '@react-native-firebase/app';
import SplashScreen from './src/components/SplashScreen/SplashScreen';
import Navigator from './src/components/Navigation/Navigator';

const firebaseConfig = {
  apiKey: "AIzaSyBjDdn0PvbC-14VcsKNH7CGJDbNuf5OQj0",
  authDomain: "teluguties-777.firebaseapp.com",
  projectId: "teluguties-777",
  storageBucket: "teluguties-777.firebasestorage.app",
  messagingSenderId: "500931788508",
  appId: "1:500931788508:web:4038bb57a3dd546b363e19",
  measurementId: "G-GVG1NDKV9N"
};

const App = () => {
  const [loading, setLoading] = useState(true);
  const user = false;



  useEffect(() => {
    // Simulate loading time with a timeout
    const timer = setTimeout(() => {
      setLoading(false); // Set loading to false after 2 seconds
    }, 2000);

    return () => clearTimeout(timer); // Cleanup the timer on unmount
  }, []);

  if(loading) {
    return <SplashScreen />
  }

  return (
        <Navigator />
    
  );
}

export default App