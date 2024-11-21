import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '../Header/Header'
import ProfileGrid from '../Profiles/ProfileGrid'
import firestore, { Timestamp } from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'

const New = ({ navigation }) => {
  const [data, setData] = useState<any>([]);

  useEffect(() => {
    const getUsersCreatedToday = async () => {
      const currentUser = auth().currentUser;
      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0));
      const endOfDay = new Date(today.setHours(23, 59, 59, 999));

      const startTimestamp = Timestamp.fromDate(startOfDay);
      const endTimestamp = Timestamp.fromDate(endOfDay);

      const userDoc = await firestore().collection('profiles').doc(currentUser?.uid).get();
      const userData = userDoc.data();

      if (!userData) {
        console.log('User data not found');
        return;
      }

      const userGender = userData.personal_info.gender;
      const genderFilter = userGender === 'Male' ? 'Female' : 'Male';

      try {
        firestore()
          .collection('profiles')
          .where('createdAt', '>=', startTimestamp)
          .where('createdAt', '<=', endTimestamp)
          .where('personal_info.gender', '==', genderFilter)
          .onSnapshot(snapshot => {
            const users = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
            }))
              .filter(user => user.id !== currentUser.uid);
            // Update the state with the users
            setData(users);
          }, error => {
            console.error("Error fetching users:", error);
          });
      } catch (error) {
        console.error("Error subscribing to users:", error);
      }
    };

    getUsersCreatedToday();
  }, []);
  
  return (
    <SafeAreaView style={styles.safearea}>
      <ScrollView>
        <View style={styles.main}>
          <Header navigation={navigation} />
          <View style={styles.boxContainer}>
            <View style={styles.box}></View>
          </View>
        </View>
        <ProfileGrid navigation={navigation} data={data} />
      </ScrollView>
    </SafeAreaView>
  )
}

export default New

const styles = StyleSheet.create({
  safearea: {
    flex: 1,
    backgroundColor: 'white'
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