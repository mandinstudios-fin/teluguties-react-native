import { StyleSheet, Text, View, Image, Dimensions, TouchableOpacity, Animated } from 'react-native';
import React, { createRef, useEffect, useState } from 'react';
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import LinearGradient from 'react-native-linear-gradient';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';
import { getFirstName, getUsersAge } from '../../utils';

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient)

const { width } = Dimensions.get('window');
const IMAGE_SIZE = width / 2 - 25; // Two columns with some spacing

const ProfileImage = ({ user, navigation }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const addToRecelyViewed = async () => {
    try {
      const currentUser = auth().currentUser;

      if (!currentUser) {
        return;
      }

      const userRef = firestore().collection('profiles').doc(currentUser.uid);

      await userRef.update({
        recentlyViewed: firestore.FieldValue.arrayUnion(user.id)
      });

    } catch (error) {
    }
  }

  const handleProfile = () => {
    addToRecelyViewed();
    navigation.navigate("UserProfileDetails", { user, navigation });
  }

  return (
    <>
      {loading ?
        <ShimmerPlaceholder style={styles.container} >
        </ShimmerPlaceholder>
        :
        <TouchableOpacity style={styles.touchable} onPress={handleProfile}>
          {user?.profile_pic ? <Image source={{ uri: user.profile_pic }} style={styles.image} /> : <View style={styles.image}/>}
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.3)', 'rgba(0, 0, 0, 0.5)']}
            style={styles.overlay}
          >
            <Text style={styles.name}>{getFirstName(user?.personal_info?.name)} <Text style={styles.userage}>{getUsersAge(user?.personal_info?.date_of_birth)}</Text></Text>
            <Text style={styles.subname}>
              {user?.personal_info?.height ? `${user.personal_info.height}cm` : ''}
              {user?.religious_cultural?.religion ? `${user?.personal_info?.height ? ` /` : ''} ${user?.religious_cultural?.religion}` : ''}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      }
    </>
  );
};

export default ProfileImage;

const styles = StyleSheet.create({
  container: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    position: 'relative',
    aspectRatio: 3 / 4,
    borderRadius: 12,
    overflow: 'hidden',
    marginLeft: width / 50,
    marginRight: width / 50,
    marginBottom: width / 25,
  },
  touchable: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    position: 'relative',
    aspectRatio: 3 / 4,
    borderRadius: 12,
    overflow: 'hidden',
    marginLeft: width / 50,
    marginRight: width / 50,
    marginBottom: width / 25,
  },
  image: {
    height: '100%',
    objectFit: 'cover',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  name: {
    color: 'white',
    fontWeight: 'bold',
    paddingLeft: width / 80,
    fontSize: 15,
  },
  userage: {
    fontSize: 12,
  },
  subname: {
    paddingLeft: width / 80,
    paddingBottom: width / 80,
    color: 'white',
  },

});
