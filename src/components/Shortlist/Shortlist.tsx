import { Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '../Header/Header'
import ProfileGrid from '../Profiles/ProfileGrid'
import firestore, { Timestamp } from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'

const { width, height, fontScale } = Dimensions.get("window")

const Shortlist = ({ navigation }) => {
  const [data, setData] = useState<any>([]);

  useEffect(() => {
    const getShortlistedProfiles = async () => {
      try {
        const currentUser = auth().currentUser;
        if (!currentUser) {
          return;
        }

        const userRef = firestore().collection('profiles').doc(currentUser.uid);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
          return;
        }

        const shortlistedProfiles = userDoc?.data().shortlisted || [];

        if (shortlistedProfiles.length === 0) {
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
      }
    };

    getShortlistedProfiles();
  }, []);
  
  return (
    <SafeAreaView style={styles.safearea}>
      <ScrollView contentContainerStyle={styles.scrollview}>
        <View style={styles.main}>
          <Header navigation={navigation} />
          <View style={styles.boxContainer}>
            <View style={styles.box}></View>
          </View>
        

        <View style={styles.container}>
            <View style={styles.subnavigationbar}>
              <TouchableOpacity onPress={() => navigation.replace("Layout")}>
                <Text style={styles.subnavigationtext}>Daily</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.push('New')}>
                <Text style={styles.subnavigationtext}>New</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.push('Shortlist')}>
                <Text style={styles.subnavigationactivetext}>Shortlist</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.push('RecentlyViewed')}>
                <Text style={styles.subnavigationtext}>Recently Viewed</Text>
              </TouchableOpacity>
            </View>
          </View>
        {
          data.length === 0 ? (<View style={styles.warncontainer}><Text style={styles.warn}>No Shortlisted Profiles 😔</Text></View>) : (<ProfileGrid navigation={navigation} data={data} />)
        }
        </View>
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
  scrollview: {
    flex: 1
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
    flex: 1,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  warn: {
    fontSize: 20,
    color: '#000',
    textAlign: 'center'
  },
  
  subnavigationbar: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  subnavigationtext: {
    fontSize: 15,
    color: '#AFAFAF',
    fontWeight:'bold'
  },
  subnavigationactivetext: {
    fontSize: 15,
    color: '#7b2a39',
    fontWeight: 'bold'
  },
  container: {
    marginBottom: 10,
    paddingHorizontal: 10
  }
})