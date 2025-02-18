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
import Icon from 'react-native-vector-icons/Ionicons';
import { getUserCategory, getUserDetailsByCategory } from '../../utils';

const { width, height } = Dimensions.get('window');

const Header = ({ navigation }) => {
  const [category, setCategory] = useState<string | null>(null);
  const [firestoreData, setFirestoreData] = useState<any>(null);

  useEffect(() => {
    const handleCategory = async () => {
      const categoryData = await getUserCategory();
      setCategory(categoryData);
    }

    handleCategory();
  }, [])

  useEffect(() => {
    if (category) {
      const handleUserCategory = async () => {
        const categoryData = await getUserDetailsByCategory(category);
        setFirestoreData(categoryData);
      };

      handleUserCategory();
    }
  }, [category])

  return (
    <SafeAreaView>
      <View>
        <View style={styles.topsection}>
          <TouchableOpacity
            onPress={() => navigation.navigate(category === 'profiles' ? 'ProfileDetails' : 'ProfileDetailsAgents')}
            style={styles.profile}
          >
            {
              firestoreData?.profile_pic || firestoreData?.profilepic ? (
                <Image
                  source={{ uri: firestoreData.profile_pic || firestoreData.profilepic }}
                  style={{ height: 50, width: 50, borderRadius: 500 }}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.emptyview} />
              )
            }
          </TouchableOpacity>

          <View style={styles.iconcontainer}>
            {category === 'profiles' &&
            <TouchableOpacity onPress={() => navigation.navigate('UserNotifications')}>
              <Icon name="notifications-outline" size={30} color="#AFAFAF" />
            </TouchableOpacity>}
            <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
              <Icon name="menu" size={40} color="#AFAFAF" />
            </TouchableOpacity>
          </View>

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
    marginTop: -30,
  },

  image: {
    height: 60,
    width: 300,
    resizeMode: 'contain',
  },
  emptyview: {
    height: 50,
    width: 50,
    borderRadius: 500,
    backgroundColor: '#AFAFAF',
  },
  iconcontainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center'
  }
});
