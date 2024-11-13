import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import Header from '../Header/Header'
import ProfileGrid from '../Profiles/ProfileGrid'

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const Matches = ({ navigation }) => {
  const [data, setData] = useState<any>([]);

  const getMatchesForUser = async () => {
    const currentUser = auth().currentUser;

    if (currentUser) {
      try {
        const userDoc = await firestore().collection('users').doc(currentUser.uid).get();

        if (userDoc.exists) {
          const userDataFirestore = userDoc.data();
          const { religion, caste } = userDataFirestore();

          const querySnapshot = await firestore().collection('users')
          .where('religion', '==', religion)
          .where('caste', '==', caste)
          .get();

          const matchedUsers = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data }));
          setData(matchedUsers);
        } else {
          console.log('No user data found for this UID');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    } else {
      console.log('No user is currently authenticated.');
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
        <View style={styles.profilegridcontainer}><ProfileGrid navigation={navigation} data={data} /></View>
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
})