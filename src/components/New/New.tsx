import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Header from '../Header/Header';
import ProfileGrid from '../Profiles/ProfileGrid';
import firestore, {Timestamp} from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const {width, height, fontScale} = Dimensions.get('window');

const New = ({navigation}) => {
  const [data, setData] = useState<any>([]);

  useEffect(() => {
    const getUsersCreatedToday = async () => {
      const currentUser = auth().currentUser;
      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0));
      const endOfDay = new Date(today.setHours(23, 59, 59, 999));

      const startTimestamp = Timestamp.fromDate(startOfDay);
      const endTimestamp = Timestamp.fromDate(endOfDay);

      const userDoc = await firestore()
        .collection('profiles')
        .doc(currentUser?.uid)
        .get();
      const userData = userDoc.data();

      if (!userData) {
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
          .onSnapshot(
            snapshot => {
              const users = snapshot.docs
                .map(doc => ({
                  id: doc.id,
                  ...doc.data(),
                }))
                .filter(user => user.id !== currentUser.uid);
              // Update the state with the users
              setData(users);
            },
            error => {},
          );
      } catch (error) {}
    };

    getUsersCreatedToday();
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
              <TouchableOpacity onPress={() => navigation.replace('Layout')}>
                <Text style={styles.subnavigationtext}>Daily</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.push('New')}>
                <Text style={styles.subnavigationactivetext}>New</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.push('Shortlist')}>
                <Text style={styles.subnavigationtext}>Shortlist</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.push('RecentlyViewed')}>
                <Text style={styles.subnavigationtext}>Recently Viewed</Text>
              </TouchableOpacity>
            </View>
          </View>
          {data.length === 0 ? (
            <View style={styles.warncontainer}>
              <View style={styles.imagecontainer}>
              <Image style={styles.image} source={require('../../assets/star.png')}/>
            </View>
            <Text style={styles.warn}>Woo...!</Text>
            <Text style={styles.warn2}>something awaits on your way! </Text>
            </View>
          ) : (
            <ProfileGrid navigation={navigation} data={data} />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default New;

const styles = StyleSheet.create({
  safearea: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollview: {
    flex: 1
  },
  main: {
    flexGrow: 1,
  },
  boxContainer: {
    paddingHorizontal: 10,
  },
  box: {
    backgroundColor: 'transparent',
    borderColor: '#AFAFAF',
    borderWidth: 0.5,
    height: 60,
    width: '100%',
    borderRadius: 15,
    marginBottom: 10,
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
    fontWeight: 'bold',
  },
  subnavigationactivetext: {
    fontSize: 15,
    color: '#7b2a39',
    fontWeight: 'bold',
  },
  container: {
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  warncontainer: {
    flex: 1,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  warn: {
    fontSize: 20,
    color: '#7b2a38',
    textAlign: 'center',
  },
  warn2: {
    fontSize: 20,
    color: '#000',
    textAlign: 'center'
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
});
