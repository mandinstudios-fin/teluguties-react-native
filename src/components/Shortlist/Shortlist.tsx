import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '../Header/Header'
import ProfileGrid from '../Profiles/ProfileGrid'
import firestore, { Timestamp } from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'

const Shortlist = ({ navigation }) => {
  const [data, setData] = useState<any>([]);

  useEffect(() => {
    const getShortlistedProfiles = async () => {
      try {
        const currentUser = auth().currentUser;
        if (!currentUser) {
          console.log("No user is logged in.");
          return;
        }

        const userRef = firestore().collection('profiles').doc(currentUser.uid);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
          console.log("User document not found.");
          return;
        }

        const shortlistedProfiles = userDoc?.data().shortlisted || [];

        if (shortlistedProfiles.length === 0) {
          console.log("No users in Shortlist.");
          return;
        }

        const userPromises = shortlistedProfiles.map(async (userId) => {
          const userSnapshot = await firestore().collection('profiles').doc(userId).get();
          if (userSnapshot.exists) {
            return { id: userSnapshot.id, ...userSnapshot.data() };
          }
          return null;
        });

        const usersData = await Promise.all(userPromises);

        const filteredUsersData = usersData.filter(user => user !== null);
        setData(filteredUsersData);
      } catch (error) {
        console.error("Error fetching Shortlist users:", error);
      }
    };

    getShortlistedProfiles();
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
        {
          data.length === 0 ? (<View style={styles.warncontainer}><Text style={styles.warn}>No Shortlisted Profiles</Text></View>) : (<ProfileGrid navigation={navigation} data={data} />)
        }
      </ScrollView>
    </SafeAreaView>
  )
}

export default Shortlist

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
  warncontainer: {
    paddingHorizontal: 10,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  warn: {
    fontSize: 20,
    color: '#000',
    textAlign: 'center'
  }
})