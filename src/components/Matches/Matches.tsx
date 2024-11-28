import { Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '../Header/Header'
import ProfileGrid from '../Profiles/ProfileGrid'

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const { width, height } = Dimensions.get('window');

const Matches = ({ navigation }) => {
  const [data, setData] = useState<any>([]);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('profiles')
      .onSnapshot(async (snapshot) => {
        try {
          const currentUser = auth().currentUser;

          if (!currentUser) {
            return;
          }

          const userDoc = await firestore().collection('profiles').doc(currentUser.uid).get();

          if (!userDoc.exists) {
            return;
          }

          const userDataFirestore = userDoc.data();
          const religion = userDataFirestore?.religious_cultural?.religion;
          const caste = userDataFirestore?.religious_cultural?.caste;
          const city = userDataFirestore?.contact_info?.current_city;
          const state = userDataFirestore?.contact_info?.permanent_address?.state;

          const matchingDocs = snapshot.docs.filter(doc => {
            const data = doc.data();
            return (
              data.religious_cultural.religion === religion &&
              data.religious_cultural.caste === caste &&
              data.contact_info.current_city === city &&
              data.contact_info.permanent_address.state === state
            );
          });

          const matchedUsersData = await Promise.all(
            matchingDocs.map(async (doc) => {
              if (doc.id !== currentUser.uid) {
                return { id: doc.id, ...doc.data() };
              }
              return null;
            })
          );

          const filteredMatchedUsers = matchedUsersData.filter(user => user !== null);

          if (filteredMatchedUsers.length === 0) {
            return;
          }

          setData(filteredMatchedUsers);
        } catch (error) {
        }
      });

    return () => unsubscribe();
  }, []);


  return (
    <SafeAreaView style={styles.safearea}>
      <ScrollView style={styles.main}>
        <Header navigation={navigation} />
        <View style={styles.boxContainer}>
          <View style={styles.box}></View>
        </View>
        {
          data.length == 0 ? (<View style={styles.warncontainer}><Text style={styles.warn}>Please fill all details😉 (Religion, Caste, Currenct City, State)</Text>
            <TouchableOpacity style={styles.creat} onPress={() => navigation.toggleDrawer('CreateProfile')}>
              <Text style={styles.creattext}>Creat Profile</Text>
            </TouchableOpacity>
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
    justifyContent: 'center'
  },
  warn: {
    fontSize: 20,
    color: '#000',
    textAlign: 'center'
  },
  creat: {
    borderRadius: 12,
    backgroundColor: '#a4737b',
    padding: width / 30,
    marginTop: 20,
  },
  creattext: {
    color: 'white',
    textAlign: 'center',
  },
})