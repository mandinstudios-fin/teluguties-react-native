// import { initializeApp } from '@react-native-firebase/app';
// import { initializeAppCheck, setTokenAutoRefreshEnabled } from '@react-native-firebase/app-check'
// import { ReCaptchaEnterpriseProvider } from 'firebase/app-check';
// import { initializeAuth } from '@react-native-firebase/auth';
// import getReactNativePersistence from "@react-native-firebase/auth"
// import initializeRecaptchaConfig from "@react-native-firebase/auth"
// import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const firebaseConfig = {
//   apiKey: "AIzaSyDkRjan31TynlRz75aqtbGMqTA6qX3D0oo",
//   authDomain: "telugut-b62ec.firebaseapp.com",
//   projectId: "telugut-b62ec",
//   storageBucket: "telugut-b62ec.appspot.com",
//   messagingSenderId: "508238509019",
//   appId: "1:508238509019:web:71fee141db36a41a50adfe",
//   measurementId: "G-FL5MYZ2S9B"
// };

// const app = initializeApp(firebaseConfig);
// export const auth = initializeAuth(app, {
//   persistence: getReactNativePersistence(AsyncStorage)
// });

// const appCheck = initializeAppCheck(app, {
//   provider: new ReCaptchaEnterpriseProvider("1234567"),
//   isTokenAutoRefreshEnabled: true
// });

// const db = getF
// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import firebase from 'firebase/app';
// import { getAnalytics } from "firebase/analytics";
// import 'firebase/firestore';

// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries
// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyBjDdn0PvbC-14VcsKNH7CGJDbNuf5OQj0",
//   authDomain: "teluguties-777.firebaseapp.com",
//   projectId: "teluguties-777",
//   storageBucket: "teluguties-777.firebasestorage.app",
//   messagingSenderId: "500931788508",
//   appId: "1:500931788508:web:4038bb57a3dd546b363e19",
//   measurementId: "G-GVG1NDKV9N"
// };
// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
// const db = firebase.firestore();