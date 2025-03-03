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
  Modal,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import phoneCodesData from '../../assets/CountryCodes.json';
import firestore from '@react-native-firebase/firestore';
import { Calendar } from "react-native-calendars";
import Loader from '../Loader/Loader';

const { width, height } = Dimensions.get('window');

const formatDate = (dateString) => {
  const [year, month, day] = dateString.split("-");
  return `${day}/${month}/${year}`; // Convert to DD/MM/YYYY
};

const getYearList = () => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: 100 }, (_, i) => currentYear - i); // Last 100 years
};

const Register = ({ navigation }) => {
  const [loading, setLoading] = useState(false)
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [formattedDate, setFormattedDate] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const [formData, setFormData] = useState({
    dob: '',
    phoneNumber: '',
    selectedCode: '+91',
  });

  console.log(formData)

  const checkPhoneNumberExists = async (selectedCode: string, phoneNumber: string) => {
    try {
      const userSnapshot = await firestore()
        .collection('profiles')
        .where('contact_info.selected_code', '==', selectedCode)
        .where('contact_info.phone', '==', phoneNumber)
        .get();

      const agentSnapshot = await firestore()
        .collection('agents')
        .where('selected_code', '==', selectedCode)
        .where('phone', '==', phoneNumber)
        .get();

      if (!userSnapshot.empty || !agentSnapshot.empty) {
        return true; // Phone number exists in either collection
      }
      return false; // Phone number does not exist
    } catch (error) {
      console.error("Error checking phone number:", error);
      return false;
    }
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(false);
    const formatter = new Intl.DateTimeFormat('en-CA');
    const formattedDate = formatter.format(currentDate);

    const formattedDateWithSlashes = formattedDate.replace(/-/g, '/');

    setFormData({ ...formData, dob: formattedDateWithSlashes.toString() });
  };

  const showDatepicker = () => {
    setShow(true);
  };

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleRegister = async () => {
    setLoading(true)
    const phoneExists = await checkPhoneNumberExists(formData.selectedCode, formData.phoneNumber);

    if (phoneExists) {
      navigation.navigate("Login");
      setLoading(false);
      return;
    }

    try {
      setLoading(false)
      navigation.navigate("Category", {
        formData,
      });
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
            source={require('../../assets/sss.webp')}
          />
        </View>

        <View style={styles.bottomformcontainer}>
          <View style={styles.bottomformbody}>
            <View style={styles.welcometextbody}>
              <Text style={styles.welcometext}>CREATE ACCOUNT</Text>
            </View>
            <TouchableOpacity onPress={() => setModalVisible(true)} activeOpacity={0.7}>
              <TextInput
                style={styles.name}
                placeholder="Choose Date Of Birth"
                placeholderTextColor="#BE7356"
                value={formData.dob }
                editable={false}
              />
            </TouchableOpacity>

            <Modal visible={modalVisible} animationType="fade" transparent>
              <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" }}>
                <View style={{ backgroundColor: "#fff", padding: 20, borderRadius: 12, width: 320, elevation: 5 }}>
                  <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10, textAlign: "center", color: "#444" }}>
                    Select Date of Birth
                  </Text>

                  {/* Custom Year Picker */}
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 10 }}>
                    {getYearList().map((year) => (
                      <TouchableOpacity
                        key={year}
                        onPress={() => setSelectedYear(year)}
                        style={{
                          padding: 10,
                          backgroundColor: selectedYear === year ? "#007AFF" : "#f1f1f1",
                          borderRadius: 5,
                          marginHorizontal: 5,
                        }}
                      >
                        <Text style={{ color: selectedYear === year ? "#fff" : "#333", fontSize: 16 }}>{year}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>

                  {/* Calendar */}
                  <Calendar
                    key={selectedYear} // Forces re-render when year changes
                    current={`${selectedYear}-01-01`}
                    onDayPress={(day) => {
                      const newFormattedDate = formatDate(day.dateString); 
                      handleInputChange('dob', newFormattedDate);
                      setModalVisible(false);
                    }}
                    markedDates={{
                      [selectedDate]: { selected: true, marked: true, selectedColor: "#007AFF" },
                    }}
                    maxDate={new Date().toISOString().split("T")[0]} // Prevents future dates
                    theme={{
                      todayTextColor: "#007AFF",
                      arrowColor: "#007AFF",
                    }}
                  />

                  {/* Buttons Row */}
                  <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 15 }}>
                    {/* Cancel Button */}
                    <TouchableOpacity onPress={() => setModalVisible(false)} style={{ padding: 10 }}>
                      <Text style={{ color: "red", fontSize: 16 }}>Cancel</Text>
                    </TouchableOpacity>

                    {/* Clear Date Button */}
                    {selectedDate && (
                      <TouchableOpacity
                        onPress={() => {
                          setSelectedDate("");
                          setFormattedDate("");
                          setModalVisible(false);
                        }}
                        style={{ padding: 10 }}
                      >
                        <Text style={{ color: "#007AFF", fontSize: 16 }}>Clear</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>
            </Modal>
            <View style={styles.phonenobody}>
              <View style={styles.phonecode}>
                <Picker
                  selectedValue={formData.selectedCode}
                  style={styles.picker}
                  onValueChange={itemValue =>
                    handleInputChange('selectedCode', itemValue)
                  }>
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
                  placeholder="Enter Phone Number"
                  placeholderTextColor="#BE7356"
                  value={formData.phoneNumber}
                  onChangeText={value =>
                    handleInputChange('phoneNumber', value)
                  }
                  keyboardType="phone-pad"
                  maxLength={10}
                />
              </View>
            </View>
            {/* <View style={styles.gender}>
                <Picker
                  selectedValue={formData.gender}
                  style={styles.picker}
                  onValueChange={itemValue =>
                    handleInputChange('gender', itemValue)
                  }>
                  <Picker.Item label={`Male`} value={`Male`} />
                  <Picker.Item label={`Female`} value={`Female`} />
                </Picker>
              </View> */}
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
        {loading && <Loader/>}
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
    gap: width / 30,
  },
  welcometextbody: {},
  welcometext: {
    fontSize: 18,
    textAlign: 'center',
    color: '#BE7356',
    fontWeight: 'bold'
  },
  name: {
    borderColor: '#EBC7B1',
    borderWidth: 1,
    borderRadius: 12,
    color: '#BE7356',
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
  gender: {
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
    backgroundColor: '#BE7356',
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
