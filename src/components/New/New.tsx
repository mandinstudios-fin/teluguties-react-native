import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
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

      try {
        const snapshot = await firestore()
          .collection('users') 
          .where('createdAt', '>=', startTimestamp)
          .where('createdAt', '<=', endTimestamp)
          .get();

        const users = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter(user => user.id !== currentUser.uid);
        setData(users); 
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    getUsersCreatedToday();
  }, []); 
  return (
    <SafeAreaView style={styles.safearea}>
      <View style={styles.main}>
        <Header navigation={navigation} />
        <View style={styles.boxContainer}>
          <View style={styles.box}></View>
        </View>
        <View style={styles.profilegridcontainer}><ProfileGrid navigation={navigation} data={data} /></View>
      </View>
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