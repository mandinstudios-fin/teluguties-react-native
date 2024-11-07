import firebase from '@react-native-firebase/app';

const firebaseConfig = {
    apiKey: "AIzaSyBjDdn0PvbC-14VcsKNH7CGJDbNuf5OQj0",
    authDomain: "teluguties-777.firebaseapp.com",
    databaseURL: "https://teluguties-777-default-rtdb.firebaseio.com",
    projectId: "teluguties-777",
    storageBucket: "teluguties-777.firebasestorage.app",
    messagingSenderId: "500931788508",
    appId: "1:500931788508:web:4038bb57a3dd546b363e19",
    measurementId: "G-GVG1NDKV9N"
  };

  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  } else {
    firebase.app(); // Use the already initialized instance
  }

export { firebase }