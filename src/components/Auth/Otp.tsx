import {
  ActivityIndicator,
  Alert,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { OtpInput } from 'react-native-otp-entry';
import SmsRetriever from 'react-native-sms-retriever';
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import messaging from '@react-native-firebase/messaging';
import useAuth from '../../hooks/useAuth';
import { removeListener, startOtpListener } from 'react-native-otp-verify';
import { calculateAge, getUsersAge } from '../../utils';

const { width, height } = Dimensions.get('window');

const Otp = ({ navigation, route }) => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false)
  const { confirmation, isRegistration, updatedFormData, fullPhoneNumber } = route.params
  const { verifyOtp } = useAuth();

  const getAndStoreFCMToken = async (userId, category) => {
    try {
      await messaging().requestPermission();

      const fcmToken = await messaging().getToken();

      if (fcmToken) {
        await firestore().collection(category).doc(userId).set({
          fcmToken: fcmToken,
        }, { merge: true });

        console.log("FCM Token stored successfully:", fcmToken);
      } else {
        console.log("No FCM token found");
      }
    } catch (error) {
      console.error("Error getting FCM token:", error);
    }
  };

  const updateUserDetails = async () => {
    const user = auth().currentUser;
    if (!user) {
      return;
    }

    if (updatedFormData.category === 'individual') {
      try {
        const userData = await firestore().collection('profiles').doc(user.uid).set({
          personalInformation: {
            firstName: '',
            lastName: '',
            gender: '',
            age: calculateAge(updatedFormData.dob),
            dateOfBirth: updatedFormData.dob,
            height: '',
            motherTongue: '',
            location: '',
            profileType: '',
          },
          contactInformation: {
            email: '',
            phone: updatedFormData.selectedCode + updatedFormData.phoneNumber,
            kycDetails: '',
            profilePicture: '',
          },
          educationAndCareer: {
            highestQualification: '',
            occupation: '',
            workingPlace: '',
            annualIncome: 0,
            aboutOccupation: '',
          },
          familyInformation: {
            fatherName: '',
            fatherOccupation: '',
            familyType: '',
            numberOfSiblings: 0,
            nativePlace: '',
            aboutFamily: '',
          },
          lifestyleAndInterests: {
            maritalStatus: '',
            drinkingHabits: '',
            interests: [],
            aboutLifestyle: '',
          },
          partnerPreferences: {
            aboutPreferences: '',
            ageRange: '',
            heightRange: '',
            preferredCity: '',
            religion: [],
          },
          metadata: {
            createdAt: firestore.FieldValue.serverTimestamp(),
            updatedAt: firestore.FieldValue.serverTimestamp(),
            isVerified: true,
            agentId: ''
          },
        });

        getAndStoreFCMToken(user?.uid, 'profiles')

      } catch (error) {
      }
    }
    else {
      try {
        const agentData = await firestore().collection('agents').doc(user.uid).set({
          agent_id: generateAgentID(),
          fullname: '',
          state: '',
          district: '',
          aadharnumber: '',
          selectedcode: updatedFormData.selectedCode,
          phonenumber: updatedFormData.phoneNumber,
          mailid: '',
          profilepic: '',
          date_of_birth: updatedFormData.dob,
        })

        await getAndStoreFCMToken(user?.uid, 'agents')
      } catch (error) {
      }
    }



  };

  const confirmOtp = async (otp) => {
    setLoading(true);
    if (confirmation) {
      try {
        await confirmation.confirm(otp);

        if (isRegistration) {
          await updateUserDetails();
        }
      } catch (error) {
        setLoading(false);
        Alert.alert("Invalid Otp");
        return;
      }
      setLoading(false);
      navigation.replace("Success", { isRegistration, updatedFormData });

    }
  };

  const handleSubmit = (otp) => {
    confirmOtp(otp);
  };

  const generateAgentID = () => {
    const randomNumbers = Math.floor(10000000 + Math.random() * 90000000); // Generate 8 random digits
    return `TT${randomNumbers}`;
  }

  return (
    <SafeAreaView style={styles.safearea}>
      <View style={styles.main}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="chevron-left" size={30} color="white" />
          </TouchableOpacity>
          <View style={styles.headertext}>
            <Text style={styles.headertextmain}>Phone Verification</Text>
          </View>
        </View>

        <View style={styles.numberboxs}>
          <View style={styles.container}>
            <Text style={styles.title}>
              Enter OTP sent to {isRegistration ? updatedFormData.phoneNumber : fullPhoneNumber}
            </Text>
          </View>

          <View style={styles.otpcontainer}>
            <OtpInput
              numberOfDigits={6}
              focusColor="#792A37"
              focusStickBlinkingDuration={500}
              onTextChange={(text) => setOtp(text)}
              onFilled={(text) => handleSubmit(text)}
              value={otp}
              textInputProps={{
                accessibilityLabel: "One-Time Password",
              }}
              theme={{
                containerStyle: styles.otpview,
                pinCodeContainerStyle: styles.inputview,
                pinCodeTextStyle: styles.pinCodeText,
                focusStickStyle: styles.focusStick,
                focusedPinCodeContainerStyle: styles.activePinCodeContainer,
              }}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.textbox} onPress={() => navigation.navigate("Success")}>
          {/* <Text style={styles.text}>Resend code</Text> */}
        </TouchableOpacity>

        <View style={styles.footerbody}>
          <View style={styles.footer}>
            <Text style={styles.footertext}>
              please review the terms and conditions before you proceed.
            </Text>
            <Text style={styles.footertext}>
              24/7 Customer service
            </Text>
            <Text style={styles.footertext}>
              www.mandinstudios.com
            </Text>
          </View>
        </View>

      </View>

      <View style={loading ? styles.loadingContainer : null}>
        {loading && <ActivityIndicator size="large" color="#a4737b" />}
      </View>
    </SafeAreaView>
  );
};

export default Otp;

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
    paddingVertical: width / 40,
  },
  headertext: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headertextmain: {
    color: 'white',
  },
  container: {
    marginTop: width / 20,
    paddingBottom: width / 20,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#BE7356',
    textAlign: 'center'
  },
  otpcontainer: {
    display: 'flex',
    alignItems: 'center',
    marginTop: width / 30,
    paddingHorizontal: 20
  },
  otpview: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: width / 30,
  },
  inputview: {
    borderRadius: 10,
    height: width / 8,
    width: width / 8,
    borderWidth: 1,
    textAlign: 'center',
    borderColor: '#BE7356',
    fontSize: 18,
    fontWeight: 500,
  },
  textbox: {
    alignItems: 'center',

    marginTop: width / 20,
    paddingBottom: width / 20,
  },
  focusStick: {
    color: 'black'
  },
  text: {
    color: '#FE8723',
  },
  pinCodeText: {
    fontSize: 18,
    fontWeight: 500,
    color: 'black'
  },
  footerbody: {
    position: 'absolute',
    bottom: width / 40,
    left: 0,
    right: 0,
  },
  footer: {
  },
  footertext: {
    textAlign: 'center',
    color: 'black'
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  numberboxs: {
    marginVertical: 'auto'

  }
});
