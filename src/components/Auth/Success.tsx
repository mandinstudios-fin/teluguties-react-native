import {
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
  BackHandler
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LottieView from 'lottie-react-native';
import auth from '@react-native-firebase/auth'
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import Agents from '../Agents/Agents';
import { getUserCategory } from '../../utils';

const { width, height } = Dimensions.get('window');

const Success = ({ navigation, route }) => {
  const { isRegistration, updatedFormData } = route.params;
  const [category, setCategory] = useState('');
  const currentUser = auth().currentUser;

  useEffect(() => {
    const handleGetUserCategory = async () => {
      const categoryLocal = await getUserCategory();
      setCategory(categoryLocal)
    }

    handleGetUserCategory()
  }, [category])

  useEffect(() => {
    let timeoutId;
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true);

    if (isRegistration !== undefined) {
      timeoutId = setTimeout(() => {
        // navigation.replace(isRegistration && updatedFormData.category === 'individual' ? "Steps" : "AgentsSteps");

        navigation.replace(
          isRegistration
            ? updatedFormData.category === "individual"
              ? "Steps"
              : "AgentsSteps"
            : category === 'agents' ?
                "AgentsLayout"
              : "Layout"
        );
      }, 2000);
    }

    return () => {
      clearTimeout(timeoutId);
      backHandler.remove();
    };
  }, [navigation, isRegistration, category]);

  const saveUserToAsyncStorage = () => {
    const user = auth().currentUser;

    AsyncStorage.setItem('userToken', user?.uid);
  };

  useEffect(() => {
    saveUserToAsyncStorage();
  }, [])

  return (
    <SafeAreaView style={styles.safearea}>
      <View style={styles.main}>
        <View style={styles.header}>
          {/* <TouchableOpacity>
            <Icon name="chevron-left" size={30} color="white" />
          </TouchableOpacity> */}
          <View style={styles.headertext}>
            <Text style={styles.headertextmain}>Phone Verification</Text>
          </View>
        </View>

        <View style={styles.verifiedcontainer}>
          <View>
            <Animated.View style={styles.lottiecontainer}><LottieView source={require('../../assets/animations/success.json')} autoPlay loop resizeMode='cover' style={styles.lottie} /></Animated.View>
            <Text style={styles.verifiedtext}>Phone Number Verified</Text>
            <View style={styles.textcontainer}>
              <Text style={styles.text}>
                You will redirected to the main page
              </Text>
              <Text style={styles.text}>in a few moments</Text>
            </View>
          </View>
        </View>

        <View style={styles.footerbody}>
          <View style={styles.footer}>
            <Text style={styles.footertext}>
              please review the terms and conditions before you proceed.
            </Text>
            <Text style={styles.footertext}>24/7 Customer service</Text>
            <Text style={styles.footertext}>www.mandinstudios.com</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Success;

const styles = StyleSheet.create({
  safearea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  main: {
    flex: 1,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#BE7356',
    paddingVertical: width / 20,
  },
  headertext: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headertextmain: {
    color: 'white',
  },
  verifiedcontainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  lottiecontainer: {
    height: 'auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  lottie: {
    height: width / 3,
    width: width / 10,
  },
  verifiedtext: {
    color: '#BE7356',
    fontSize: 25,
    fontWeight: '500',
    textAlign: 'center'
  },
  textcontainer: {
    alignItems: 'center',
  },
  text: {
    color: '#BE7356',
  },

  footerbody: {
    position: 'absolute',
    bottom: width / 40,
    left: 0,
    right: 0,
  },
  footer: {},
  footertext: {
    textAlign: 'center',
    color: 'black',
  },
});
