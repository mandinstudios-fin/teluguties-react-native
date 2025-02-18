import { Dimensions, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '../Header/Header'
import ProfileGrid from '../Profiles/ProfileGrid'

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import useFirestore from '../../hooks/useFirestore';

const { width, height } = Dimensions.get('window');

const Matches = ({ navigation }) => {
  const [data, setData] = useState<any>([]);
  const {getMatchesData} = useFirestore();

  useEffect(() => {
    const matchesData = async() => {
      const dataM = await getMatchesData();
      setData(dataM);
    }
    matchesData();
  },[])

  // useEffect(() => {
  //   const unsubscribe = async () => {
  //     try {
  //       const currentUser = auth().currentUser;
  //       if (!currentUser) {
  //         return;
  //       }

  //       const userRef = firestore().collection('profiles').doc(currentUser.uid);
        
  //       // Listen for real-time updates to the user's profile
  //       const unsubscribeProfile = userRef.onSnapshot((userDoc) => {
  //         if (!userDoc.exists) {
  //           return;
  //         }

  //         const shortlistedProfiles = userDoc.data().matches || [];

  //         if (shortlistedProfiles.length === 0) {
  //           setData([]);
  //           return;
  //         }

  //         // Fetch the profiles in real-time as well
  //         const userPromises = shortlistedProfiles.map(async (userId) => {
  //           const userSnapshot = await firestore().collection('profiles').doc(userId).get();
  //           if (userSnapshot.exists) {
  //             return { id: userSnapshot.id, ...userSnapshot.data() };
  //           }
  //           return null;
  //         });

  //         // Subscribe to changes for each shortlisted profile
  //         const unsubscribeProfiles = shortlistedProfiles.map(userId => {
  //           return firestore()
  //             .collection('profiles')
  //             .doc(userId)
  //             .onSnapshot(userSnapshot => {
  //               if (userSnapshot.exists) {
  //                 setData(prevData => {
  //                   const updatedData = prevData.filter(item => item.id !== userSnapshot.id);
  //                   updatedData.push({ id: userSnapshot.id, ...userSnapshot.data() });
  //                   return updatedData;
  //                 });
  //               }
  //             });
  //         });

  //         // Clean up the real-time listeners for each profile when done
  //         return () => {
  //           unsubscribeProfiles.forEach(unsub => unsub());
  //         };
  //       });

  //       // Cleanup the profile listener on component unmount
  //       return () => unsubscribeProfile();
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };

  //   unsubscribe();

  //   // Clean up the listeners on component unmount
  //   return () => {
  //     setData([]);
  //   };
  // }, []);



  return (
    <SafeAreaView style={styles.safearea}>
      <ScrollView contentContainerStyle={styles.main}>
        <Header navigation={navigation} />
        <View style={styles.boxContainer}>
          <View style={styles.box}></View>
        </View>

        {
          data.length == 0 ? (
          <View style={styles.warncontainer}>
            <View style={styles.imagecontainer}>
              <Image style={styles.image} source={require('../../assets/star.png')}/>
            </View>
            <Text style={styles.warn}>Woo...!</Text>
            <Text style={styles.warn2}>something awaits on your way! </Text>
            {/* <TouchableOpacity style={styles.creat} onPress={() => navigation.toggleDrawer('CreateProfile')}>
              <Text style={styles.creattext}>Create Profile</Text>
            </TouchableOpacity> */}
          </View>) : (<ProfileGrid navigation={navigation} data={data} />)
        }




      </ScrollView>
    </SafeAreaView>
  )
}

export default Matches

const styles = StyleSheet.create({
  safearea: {
    flex: 1,
    backgroundColor: 'white',
  },
  main: {
    flexGrow: 1
  },
  boxContainer: {
    paddingHorizontal: 10
  },
  box: {
    backgroundColor: 'transparent',
    borderColor: '#AFAFAF',
    borderWidth: 0.5,
    height: 60,
    width: '100%',
    borderRadius: 15,
    marginBottom: 10
  },
  warncontainer: {
    paddingHorizontal: 10,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  warn: {
    fontSize: 20,
    color: '#7b2a38',
    textAlign: 'center'
  },
  warn2: {
    fontSize: 20,
    color: '#000',
    textAlign: 'center'
  },
  creat: {
    borderRadius: 12,
    backgroundColor: '#7b2a38',
    padding: width / 30,
    marginTop: 20,
  },
  creattext: {
    color: 'white',
    textAlign: 'center',
  },
  imagecontainer:{
    height:height*0.1,
    width:width,
    display:'flex',
    alignItems:'center'
  },
  image:{
    height:'100%',
    resizeMode:'contain'
  }
})