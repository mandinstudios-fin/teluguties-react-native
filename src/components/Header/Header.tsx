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
import { Bell, BellDot, BellRing, Menu } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming
} from "react-native-reanimated";

const { width, height } = Dimensions.get('window');

const Header = ({ navigation }) => {
  const [firestoreData, setFirestoreData] = useState<any>(null);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.07, { duration: 500 }), // Scale up
        withTiming(1, { duration: 500 }) // Scale down
      ),
      -1, // Infinite loop
      true
    );

    opacity.value = withRepeat(
      withSequence(
        withTiming(0.5, { duration: 500 }), // Fade out
        withTiming(1, { duration: 500 }) // Fade in
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  useEffect(() => {
    const handleUserCategory = async () => {
      const categoryData = await getUserDetailsByCategory();
      setFirestoreData(categoryData);
    };

    handleUserCategory();
  }, []);

  return (
    <SafeAreaView>
      <View>
        <View style={styles.topsection}>
          <TouchableOpacity
            onPress={() => navigation.navigate('ProfileDetails')}
            style={styles.profile}
          >
            {
              firestoreData?.contactInformation?.profilePicture ? (
                <Image
                  source={{ uri: firestoreData?.contactInformation?.profilePicture }}
                  style={{ height: 50, width: 50, borderRadius: 500 }}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.emptyview} />
              )
            }
          </TouchableOpacity>

          <View style={styles.iconcontainer}>
            <TouchableOpacity onPress={() => navigation.navigate("UserNotifications")}>
              <Animated.View style={animatedStyle}>
                <BellDot size={25} strokeWidth={1} color={'#7b2a38'} />
              </Animated.View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
              <Menu size={27} strokeWidth={1} />
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
    gap: 15,
    alignItems: 'center'
  }
});
