import { Dimensions, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '../Header/Header'
import ProfileGrid from '../Profiles/ProfileGrid'

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const { width, height } = Dimensions.get('window');

const Matches = ({ navigation }) => {
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

        const shortlistedProfiles = userDoc?.data().matches || [];

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
    flex: 1
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