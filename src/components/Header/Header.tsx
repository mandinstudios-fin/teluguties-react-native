import {
  Image,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/Ionicons';
import UserProfileDetails from '../Profiles/UserProfileDetails';

const { width, height } = Dimensions.get('window');

const Header = ({ navigation }) => {
  const [firestoreData, setFiretoreData] = useState<any>();

  const getCurrentUserDetails = async () => {
    const currentUser = auth().currentUser;

    if (currentUser) {
      try {
        const userDoc = await firestore()
          .collection('profiles')
          .doc(currentUser.uid)
          .get();

        if (userDoc.exists) {
          const userDataFirestore = userDoc.data();
          setFiretoreData(userDataFirestore);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    getCurrentUserDetails();
  }, []);

  useEffect(() => {
    const currentUser = auth().currentUser; 
    
    if (currentUser) {
      
      const unsubscribe = firestore()
        .collection('profiles')
        .doc(currentUser.uid)
        .onSnapshot((docSnapshot) => {
          if (docSnapshot.exists) {
            setFiretoreData(docSnapshot.data());
          }
        });
      return () => unsubscribe();
    }
  }, []);

  return (
    <SafeAreaView>
      <View>
        <View style={styles.topsection}>
          <TouchableOpacity
            onPress={() => navigation.navigate('ProfileDetails')}
            style={styles.profile}>
            <Image
              source={{ uri: firestoreData?.profile_pic }}
              height={50}
              width={50}
              borderRadius={500}
              resizeMode="cover"
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
            <Icon name="menu" size={40} color="#AFAFAF" />
          </TouchableOpacity>
        </View>

        <View style={styles.logo}>
          <Image
            style={styles.image}
            source={require('../../assets/logo.png')}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Header;

const styles = StyleSheet.create({
  main: {
    backgroundColor: 'white',
  },
  topsection: {
    paddingHorizontal: 10,
    paddingTop: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  profile: {
    backgroundColor: '#AFAFAF',
    height: 50,
    width: 50,
    borderRadius: 200,
  },

  logo: {
    alignItems: 'center',
    marginBottom: 10,
  },

  image: {
    height: 100,
    width: 300,
    resizeMode: 'contain',
  },
});
