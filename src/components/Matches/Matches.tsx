import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '../Header/Header'
import ProfileGrid from '../Profiles/ProfileGrid'

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const Matches = ({ navigation }) => {
  const [data, setData] = useState<any>([]);

  const getMatchesForUser = async () => {
    try {
      const currentUser = auth().currentUser;
      
      if (!currentUser) {
        console.log("No user is logged in.");
        return;
      }
  
      const userDoc = await firestore().collection('profiles').doc(currentUser.uid).get();
  
      if (!userDoc.exists) {
        console.log('No user data found for this UID');
        return;
      }
  
      const userDataFirestore = userDoc.data();
      const religion = userDataFirestore?.religious_cultural?.religion;
      const caste = userDataFirestore?.religious_cultural?.caste;
      const city = userDataFirestore?.contact_info?.current_city;
      const state = userDataFirestore?.contact_info?.permanent_address?.state;

      console.log(religion, caste, city, state)
  
      const querySnapshot = await firestore().collection('profiles')
        .where('religious_cultural.religion', '==', religion)
        .where('religious_cultural.caste', '==', caste)
        .where('contact_info.current_city', '==', city)
        .where('contact_info.permanent_address.state', '==', state)
        .get();
  
      if (querySnapshot.empty) {
        console.log('No matching users found.');
        return;
      }
  
      const matchedUsersPromises = querySnapshot.docs.map(async (doc) => {
        const userSnapshot = await firestore().collection('profiles').doc(doc.id).get();
        if (userSnapshot.exists && userSnapshot.id !== currentUser.uid) {
          return { id: userSnapshot.id, ...userSnapshot.data() };
        }
        return null;
      });
  
      const matchedUsersData = await Promise.all(matchedUsersPromises);
      
      const filteredMatchedUsers = matchedUsersData.filter(user => user !== null);
      
      if (filteredMatchedUsers.length === 0) {
        console.log("No valid matches found.");
        return;
      }
  
      setData(filteredMatchedUsers);
    } catch (error) {
      console.error('Error fetching user matches:', error);
    }
  }

  useEffect(() => {
    getMatchesForUser();
  }, [])

  return (
    <SafeAreaView style={styles.safearea}>
      <View style={styles.main}>
        <Header navigation={navigation}/>
        <View style={styles.boxContainer}>
          <View style={styles.box}></View>
        </View>
        {
          data.length == 0 ? (<View style={styles.warncontainer}><Text style={styles.warn}>Please fill all details</Text></View>) : (<ProfileGrid navigation={navigation} data={data} />)
        }
      </View>
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
    height: 80,
    width: '100%',
    borderRadius: 15,
    marginBottom: 10
  },
  warncontainer: {
    paddingHorizontal: 10,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  warn: {
    fontSize: 20,
    color: '#000'
  }
})