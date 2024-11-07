import {
  ActivityIndicator,
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

import useAuth from '../../hooks/useAuth';
import { removeListener, startOtpListener } from 'react-native-otp-verify';

const { width, height } = Dimensions.get('window');

const Otp = ({ navigation, route }) => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false)
  const { verificationId, confirmation, formData } = route.params
  const { verifyOtp } = useAuth();

  const updateUserDetails = async () => {
    const user = auth().currentUser;
    if (!user) {
      console.error('No user is logged in');
      return;
    }
    try {
      const userData = await firestore().collection('users').doc(user.uid).set({
        name: formData.fullname,
        phoneNumber: formData.phoneNumber,
        dob: formData.dob,
        phoneCode: formData.selectedCode,
        createdAt: firestore.FieldValue.serverTimestamp()
      });
      
      setLoading(false)
      navigation.navigate("Success");
    } catch (error) {
      console.log(error)
    }
  }

  const confirmOtp = async (otp) => {
    setLoading(true);
    if (confirmation) {
      try {
        await confirmation.confirm(otp);
        await updateUserDetails();
      } catch (error) {
        console.error('Invalid code.', error);
      }
    }
  };

  const handleSubmit = (otp) => {
    console.log(`Submitting OTP: ${otp}`);
    confirmOtp(otp);
  };

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

        <View style={styles.container}>
          <Text style={styles.title}>
            Enter 6 digit verification code send to your phone number
          </Text>
        </View>

        <View style={styles.otpcontainer}>
          <OtpInput
            numberOfDigits={6}
            focusColor="#792A37"
            focusStickBlinkingDuration={500}
            onTextChange={(text) => setOtp(text)} // Update state with the current text
            onFilled={(text) => handleSubmit(text)} // Handle when input is filled
            value={otp} // Bind the OTP state to the input
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

        <TouchableOpacity style={styles.textbox} onPress={() => navigation.navigate("Success")}>
          <Text style={styles.text}>Resend code</Text>
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
  },
  otpcontainer: {
    display: 'flex',
    alignItems: 'center',
    marginTop: width / 30,
    paddingHorizontal: 10
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
});
