import { StyleSheet, Text, View, Image, Dimensions, TouchableOpacity, Animated, Pressable } from 'react-native';
import React, { useState, useEffect } from 'react';
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import LinearGradient from 'react-native-linear-gradient';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';
import { getFirstName, getUsersAge } from '../../utils';
import { ChevronRight, MapPin } from 'lucide-react-native';

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient)
const shimmerColors = ['#D0D0D0', '#E5E5E5', '#D0D0D0'];


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
    navigation.navigate("UserProfileDetails", { user, hideTabBar: true, navigation });
  }

  return (
    <>
      {loading ?
        <ShimmerPlaceholder style={styles.container} shimmerColors={shimmerColors} linearGradientProps={{
          colors: shimmerColors, // Gradient colors
          start: { x: 0, y: 0 },
          end: { x: 1, y: 0 },
        }}>
        </ShimmerPlaceholder>
        :
        // <TouchableOpacity style={styles.touchable} onPress={handleProfile}>
        //   {user?.profile_pic ? <Image key={user?.profile_pic} source={{ uri: user.profile_pic || 'https://img.freepik.com/premium-vector/default-image-icon-vector-missing-picture-page-website-design-mobile-app-no-photo-available_87543-11093.jpg?w=996' }} style={styles.image}  /> : <View style={styles.image}/>}
        //   <LinearGradient
        //     colors={['rgba(255, 255, 255, 0.3)', 'rgba(0, 0, 0, 0.5)']}
        //     style={styles.overlay}
        //   >
        //     <Text style={styles.name}>{getFirstName(user?.personal_info?.name)} <Text style={styles.userage}>{getUsersAge(user?.personal_info?.date_of_birth)}</Text></Text>
        //     <Text style={styles.subname}>
        //       {user?.personal_info?.height ? `${user.personal_info.height}cm` : ''}
        //       {user?.religious_cultural?.religion ? `${user?.personal_info?.height ? ` /` : ''} ${user?.religious_cultural?.religion}` : ''}
        //     </Text>
        //   </LinearGradient>
        // </TouchableOpacity>
        <TouchableOpacity key={user.id} style={styles.touchable} onPress={handleProfile}>
          <Image source={{ uri: user?.contactInformation?.profilePicture || 'https://static.vecteezy.com/system/resources/thumbnails/004/141/669/small/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg' }} style={styles.cardImage} />
          <View style={styles.cardContent}>
            <Text style={styles.name}>{user?.personalInformation?.firstName || "Not Specified"}</Text>
            <View style={styles.locationRedirectContainer}>
              <View style={styles.locationContainer}>
                <MapPin size={16} color="#666" />
                <Text style={styles.location}>{user?.personalInformation?.location || 'Location Not Specified'}</Text>
              </View>
              <TouchableOpacity onPress={handleProfile}><ChevronRight size={24} color="#666" strokeWidth={1} /></TouchableOpacity>
            </View>
            <Text style={styles.age}>{user?.personalInformation?.age || 'Age Not Specified'}</Text>
          </View>
        </TouchableOpacity>
      }
    </>
  );
};

export default ProfileImage;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 120,
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 12
  },
  touchable: {
    width: '100%',
    height: 120,
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'row',
    elevation: 5,
    backgroundColor: 'white',
    padding: 12
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
    color: 'black',
    fontWeight: 'bold',
    fontSize: 18,
  },
  userage: {
    fontSize: 12,
  },
  subname: {
    paddingLeft: width / 80,
    paddingBottom: width / 80,
    color: 'white',
  },
  profileCard: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  cardImage: {
    width: 120,
    height: '100%',
    borderRadius: 8,
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 7
  },
  locationRedirectContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row'
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  location: {
    color: '#666',
    marginLeft: 4,
  },
  age: {
    color: '#666',
    fontSize: 12,
  },

});
