import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  Linking,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import firestore, {Timestamp} from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { compareDate, getTodaysDate, parseDate } from '../../utils';

const {width, height} = Dimensions.get('window');

const membershipData = [
  {id: '1', title: 'Silver Package', price: '₹499'},
  {id: '2', title: 'Gold Package', price: '₹999'},
  {id: '3', title: 'Diamond Plus', price: '₹6000'},
];

const Prime = ({navigation}) => {
  const [user, setUser] = useState();
  const [paymentData, setPaymentData] = useState({
    packageName: 'Gold',
    status: 'success',
    phoneNumber: 1234567890,
    amount: 4,
    createdAt: 'December 3, 2024 at 2:08:56 PM UTC+5:30',
    expiryDate:'March 3, 2025 at 3:00:06 PM UTC+5:30'
  });
  const isValidSubscription = paymentData?.status === 'success'
  console.log(isValidSubscription)

  useEffect(() => {
    const getCurrentUserDetails = async () => {
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

        const data = userDoc?.data();

        setUser(data);
      } catch (error) {}
    };

    getCurrentUserDetails();
  }, []);

  // useEffect(() => {
  //   const getUserPaymentDetails = async () => {
  //     try {
  //       const currentUser = auth().currentUser;
  //       if (!currentUser) {
  //         return;
  //       }

  //       const userRef = firestore().collection('payments').doc(currentUser.uid);
  //       const userDoc = await userRef.get();

  //       if (!userDoc.exists) {
  //         return;
  //       }

  //       const data = userDoc?.data();

  //       setPaymentData(data);
  //     } catch (error) {}
  //   };

  //   getUserPaymentDetails();
  // }, []);

  const openPaymentWebsite = () => {
    Linking.openURL(
      `https://payments.mandinstudios.com/direct-verify?phone=${user?.contact_info?.phone}`,
    ).catch(err => Alert.alert('Failed to initiate Payment'));
  };

  const renderItem = ({item}) => (
    <View style={styles.box}>
      <View style={styles.membershipcontainer}>
        <Text style={styles.membershiptext}>{item.title}</Text>
        <Text style={styles.validity}>3months validity</Text>
      </View>
      <View>
        <Text style={styles.price}>{item.price}</Text>
      </View>
      <View style={styles.boxContainer}>
        <TouchableOpacity style={styles.subscribe} onPress={openPaymentWebsite}>
          <Text style={styles.subscribetext}>Subscribe</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safearea}>
      <ScrollView contentContainerStyle={styles.main} style={styles.scrollView}>
        <View style={styles.logo}>
          <Image
            style={styles.image}
            source={require('../../assets/logo.png')}
          />
        </View>

        <View style={styles.boxesholder}>
          {isValidSubscription ? (
            <View style={styles.box}>
              <View style={styles.membershipcontainer}>
                <Text style={styles.membershiptext}>{paymentData?.packageName}</Text>
                <Text style={styles.validity}>3months validity</Text>
              </View>
              <View>
                <Text style={styles.price}>Rs. {paymentData.amount}</Text>
                <Text style={styles.price}>Expiry Date: {paymentData.expiryDate}</Text>
              </View>
              <View style={styles.boxContainer}>
                <TouchableOpacity
                  style={styles.subscribe}>
                  <Text style={styles.subscribetext}>Active</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <FlatList
              data={membershipData}
              renderItem={renderItem}
              keyExtractor={item => item.id}
              contentContainerStyle={{
                paddingBottom: 20,
                flexGrow: 1,
                justifyContent: 'space-between',
              }}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Prime;

const styles = StyleSheet.create({
  safearea: {
    flex: 1,
    backgroundColor: 'white',
  },
  main: {
    flexGrow: 1,
  },
  scrollView: {
    flex: 1,
  },
  logo: {
    marginTop: width / 10,
    height: height / 10,
    width: width,
    alignItems: 'center',
  },
  image: {
    height: 60,
    width: '100%',
    resizeMode: 'contain',
  },
  boxesholder: {
    flex: 1,
    paddingLeft: width / 25,
    marginRight: width / 25,
    gap: 25,
    alignItems:'center',
    justifyContent:'center'
  },
  boxContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  box: {
    backgroundColor: 'transparent',
    borderColor: '#AFAFAF',
    borderWidth: 0.7,
    width: width - width / 12,
    borderRadius: 15,
    marginBottom: 20,
    paddingHorizontal: width * 0.05,
    paddingVertical: width * 0.07,
  },
  membershipcontainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 22,
  },
  membershiptext: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#e4bd9e',
  },
  subscribe: {
    borderRadius: 25,
    backgroundColor: '#7b2a38',
    padding: width / 30,
    marginTop: 20,
    width: '75%',
  },
  subscribetext: {
    color: 'white',
    textAlign: 'center',
  },
  validity: {
    borderRadius: 10,
    backgroundColor: '#e4bd9e',
    color: 'white',
    paddingHorizontal: width / 50,
  },
  price: {
    color: 'black',
  },
});
