import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import React, { useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import phoneCodesData from '../../assets/CountryCodes.json';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const { width, height } = Dimensions.get('window');

const Login = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [selectedCode, setSelectedCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('');

  const checkPhoneNumberExists = async (selectedCode: string, phoneNumber: string) => {
    try {
      const userSnapshot = await firestore()
        .collection('profiles')
        .where('contact_info.selected_code', '==', selectedCode)
        .where('contact_info.phone', '==', phoneNumber)
        .get();

      const agentSnapshot = await firestore()
        .collection('agents')
        .where('selectedcode', '==', selectedCode)
        .where('phonenumber', '==', phoneNumber)
        .get();

      if (!userSnapshot.empty || !agentSnapshot.empty) {
        return true; 
      }
      return false; 
    } catch (error) {
      console.error("Error checking phone number:", error);
      return false;
    }
  };

  const handleLogin = async () => {
    const fullPhoneNumber = selectedCode + phoneNumber;
    const phoneExists = await checkPhoneNumberExists(selectedCode, phoneNumber);

    if (!phoneExists) {
      navigation.navigate("Register");
      return;
    }

    setLoading(true);
    try {
      const confirmation = await auth().signInWithPhoneNumber(fullPhoneNumber);

      const isRegistration = false;
      setLoading(false);
      navigation.navigate("Otp", { confirmation, isRegistration, fullPhoneNumber })
    } catch (error) {
    }
  };

  return (
    <SafeAreaView style={styles.safearea}>
      <ScrollView style={styles.main}>
        <View style={styles.logo}>
          <Image
            style={styles.image}
            source={require('../../assets/logo.png')}
          />
        </View>

        <View style={styles.logoinbody}>
          <Image
            style={styles.loginimage}
            source={require('../../assets/couple.jpg')}
          />
        </View>

        <View style={styles.bottomformcontainer}>
          <View style={styles.bottomformbody}>
            <View>
              <Text style={styles.account}>LOGIN ACCOUNT</Text>
            </View>

            {/* <View style={styles.numbercontainer}>
              <View style={styles.numberbody}>
                <Text style={styles.number}>Phone Number</Text>
              </View>
            </View> */}

            <View style={styles.phonenobody}>
              <View style={styles.phonecode}>
                <Picker
                  selectedValue={selectedCode}
                  style={styles.picker}
                  onValueChange={itemValue => setSelectedCode(itemValue)}>
                  {phoneCodesData.map(({ name, dial_code, code }) => (
                    <Picker.Item
                      key={code}
                      label={`${name} (${dial_code})`}
                      value={dial_code}
                    />
                  ))}
                </Picker>
              </View>
              <View style={styles.phonenomain}>
                <TextInput
                  style={styles.phoneno}
                  keyboardType="number-pad"
                  maxLength={10}
                  onChangeText={setPhoneNumber}
                  value={phoneNumber}></TextInput>
              </View>
            </View>
            <View>
              <TouchableOpacity style={styles.otpbox} onPress={handleLogin}>
                <Text style={styles.otp}>Send OTP</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.createbody}>
              <View style={styles.create}>
                <Text style={styles.donthave}>Don't have account?</Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Register')}>
                  <Text style={styles.createtext}>Create Account</Text>
                </TouchableOpacity>
              </View>
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
      </ScrollView>

      <View style={loading ? styles.loadingContainer : null}>
        {loading && <ActivityIndicator size="large" color="#a4737b" />}
      </View>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  safearea: {
    backgroundColor: '#f5f5f5',
    flex: 1,
  },
  main: {
    flex: 1,
  },
  logo: {
    marginTop: width / 20,
    height: height / 10,
    width: width,
    alignItems: 'center',

  },
  image: {
    height: 70,
    width: '100%',
    resizeMode: 'contain',

  },
  logoinbody: {
    height: width / 1.3,
    width: width,
  },
  loginimage: {
    height: '100%',
    width: '100%',
    resizeMode: 'cover',
  },
  bottomformcontainer: {
    marginTop: width / 40,
    backgroundColor: 'white',
    padding: width / 30,
    borderRadius: 20,
    paddingVertical: width / 20,
  },
  bottomformbody: {
    display: 'flex',
    gap: width / 20,
  },
  account: {
    textAlign: 'center',
    color: '#BE7356',
    fontSize: 20,
    fontWeight: '800'
  },
  numbercontainer: {
    display: 'flex',
    alignItems: 'center',
  },
  numberbody: {
    backgroundColor: '#BE7356',
    borderRadius: 12,
    paddingHorizontal: width / 10,
    paddingVertical: width / 40,
  },
  number: {
    textAlign: 'center',
    fontSize: 17,
    color: 'white',
  },

  phonenobody: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: width / 30,
  },
  picker: {
    color: '#BE7356',
  },
  phonecode: {
    width: '30%',
    borderColor: '#EBC7B1',
    borderWidth: 1,
    borderRadius: 12,
    color: '#EBC7B1',
  },
  phonenomain: {
    flex: 1,
  },
  phoneno: {
    borderWidth: 1,
    borderRadius: 12,
    borderColor: '#EBC7B1',
    color: '#BE7356',
    height: 'auto',
    paddingLeft: width / 40,
  },
  otpbox: {
    borderRadius: 12,
    backgroundColor: '#BE7356',
    padding: width / 30,
  },
  otp: {
    color: 'white',
    textAlign: 'center',
  },
  createbody: {},
  create: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: width / 40,
  },
  donthave: {
    color: '#BE7356',
  },
  createtext: {
    color: '#A4737B',
    fontWeight:'800'
  },
  footerbody: {
    paddingVertical: width / 40,
    marginTop:width/15
  },
  footer: {},
  footertext: {
    textAlign: 'center',
    color: 'black',
    fontSize:12
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
