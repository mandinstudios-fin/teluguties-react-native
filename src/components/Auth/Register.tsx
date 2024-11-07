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
  ActivityIndicator,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Picker} from '@react-native-picker/picker';
import phoneCodesData from '../../assets/CountryCodes.json';
import useAuth from '../../hooks/useAuth';
import auth from '@react-native-firebase/auth';
import { TRegisterFormData } from '../../types';

const {width, height} = Dimensions.get('window');

const Register = ({navigation}) => {
  const [loading, setLoading] = useState(false)
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [formData, setFormData] = useState<TRegisterFormData>({
    fullname: '',
    dob: '',
    phoneNumber: '',
    selectedCode: '+91',
  });

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(false);
    setFormData({...formData, dob: currentDate.toLocaleDateString()});
  };

  const showDatepicker = () => {
    setShow(true);
  };

  const handleInputChange = (name, value) => {
    setFormData({...formData, [name]: value});
  };

  const handleRegister = async () => {
    setLoading(true)
    try {
      const confirmation = await auth().signInWithPhoneNumber(formData.selectedCode + formData.phoneNumber);
      const verificationId = confirmation.verificationId;

      setLoading(false)
      navigation.navigate("Otp", { verificationId, confirmation, formData })
    } catch (error) {
      console.error(error)
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
            source={require('../../assets/login.png')}
          />
        </View>

        <View style={styles.bottomformcontainer}>
          <View style={styles.bottomformbody}>
            <View style={styles.welcometextbody}>
              <Text style={styles.welcometext}>Welcome to TeluguTies</Text>
            </View>
            <TextInput
              style={styles.name}
              placeholder="Enter Your Full Name"
              placeholderTextColor="#EBC7B1"
              value={formData.fullname}
              onChangeText={value => handleInputChange('fullname', value)}
            />
            <TextInput
              style={styles.name}
              placeholder="DOB"
              placeholderTextColor="#EBC7B1"
              value={formData.dob}
              onFocus={showDatepicker} // Show date picker when focused
            />
            {show && (
              <DateTimePicker
                value={date}
                mode="date"
                is24Hour={true}
                display="default"
                onChange={onChange}
              />
            )}
            <View style={styles.phonenobody}>
              <View style={styles.phonecode}>
                <Picker
                  selectedValue={formData.selectedCode}
                  style={styles.picker}
                  onValueChange={itemValue =>
                    handleInputChange('selectedCode', itemValue)
                  }>
                  {phoneCodesData.map(({name, dial_code, code}) => (
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
                  placeholder="Enter Phone Number"
                  placeholderTextColor="#EBC7B1"
                  value={formData.phoneNumber}
                  onChangeText={value =>
                    handleInputChange('phoneNumber', value)
                  }
                  keyboardType="phone-pad"
                  maxLength={10}
                />
              </View>
            </View>
            <TouchableOpacity style={styles.otpbox} onPress={handleRegister}>
              <Text style={styles.otp}>Send OTP</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footerbody}>
          <View style={styles.footer}>
            <Text style={styles.footertext}>
              please review the terms and conditions before you proceed.
            </Text>
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

export default Register;

const styles = StyleSheet.create({
  safearea: {
    backgroundColor: '#f5f5f5',
    flex: 1,
  },
  main: {
    flex: 1,
  },
  logo: {
    marginTop: width / 10,
    height: height / 10,
    width: width,
    alignItems: 'center',
  },
  image: {
    height: '100%',
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
    resizeMode: 'contain',
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
    gap: width / 30,
  },
  welcometextbody: {},
  welcometext: {
    fontSize: 18,
    textAlign: 'center',
    color: '#BE7356',
  },
  name: {
    borderColor: '#EBC7B1',
    borderWidth: 1,
    borderRadius: 12,
    color: '#EBC7B1',
    paddingLeft: width / 40,
  },
  phonenobody: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: width / 30,
  },
  phonecode: {
    width: '30%',
    borderColor: '#EBC7B1',
    borderWidth: 1,
    borderRadius: 12,
    color: '#EBC7B1',
  },
  picker: {
    color: '#BE7356',
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
    borderRadius: 5,
    backgroundColor: '#a4737b',
    padding: width / 30,
  },
  otp: {
    color: 'white',
    textAlign: 'center',
  },
  footerbody: {
    paddingVertical: width / 40,
  },
  footer: {
    textAlign: 'center',
  },
  footertext: {
    textAlign: 'center',
    color: '#000',
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
