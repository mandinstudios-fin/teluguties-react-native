import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import Icon from "react-native-vector-icons/Entypo";
import { launchImageLibrary } from "react-native-image-picker";
import useToastHook from "../../utils/useToastHook";
import storage from "@react-native-firebase/storage";
import useAgent from "../../hooks/useAgent";
import { isValidAadhaar } from "aadhaar-validator-ts";
import Loader from "../Loader/Loader";
import TermsAndConditionsScreen from "./TermsAndConditionsScreen";
import { Camera } from "lucide-react-native";
import { Calendar } from "react-native-calendars";
import useAgent2 from "../../hooks/useAgent2";

const { width } = Dimensions.get("window");

const AgentsSteps = ({ navigation }) => {
  const currentUser = auth().currentUser;
  const [step, setStep] = useState(1); // Track which step we are in
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [formattedDate, setFormattedDate] = useState("");

  const getYearList = () => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 100 }, (_, i) => currentYear - i); // Last 100 years
  };

  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`; // Convert to DD/MM/YYYY
  };

  const [agentFormData, setAgentFormData] = useState({
    uid: "",
    full_name: "",
    state: "",
    district: "",
    aadhar_number: "",
    selected_code: "",
    phone_number: "",
    mail_id: "",
    profile_pic: "",
    date_of_birth: "",
  });

  const [uploading, setUploading] = useState();
  const { successToast, errorToast } = useToastHook();
  const { getAgentsDetails, agentsPartialUpdateAgentProfile } = useAgent2();

  useEffect(() => {
    getAgentsDetails(setAgentFormData);
  }, []);

  const handleChange = (name, value) => {
    setAgentFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!currentUser?.uid) {
      Alert.alert("Error", "User ID not found");
      return;
    }

    if (!agentFormData.aadhar_number) {
      errorToast("Enter Aadhar Number");
      return;
    }

    if (!isValidAadhaar(agentFormData.aadhar_number)) {
      errorToast("Invalid Aadhar Number...");
      return;
    }

    setUploading(true);

    try {
      await agentsPartialUpdateAgentProfile(agentFormData);
      successToast("Data Updated");
      navigation.replace("AgentsSuccess")
    } catch (error) {
      errorToast("Try again");
    }

    setUploading(false);
  };

  const handleUploadProfilePic = async (imageUri) => {
    if (!currentUser) {
      errorToast("User not logged in");
      return;
    }

    setUploading(true);

    try {
      const fileName = imageUri.split("/").pop();
      const uniqueFileName = `${Date.now()}_${fileName}`;

      // Upload the selected image
      const reference = storage().ref(`agent-profile-images/${uniqueFileName}`);
      const task = reference.putFile(imageUri);

      task.on(
        "state_changed",
        (snapshot) => {
          const uploadProgress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${uploadProgress}% done`);
        },
        (error) => {
          console.error("Upload error", error);
        }
      );

      await task;
      const downloadUrl = await reference.getDownloadURL();

      console.log(downloadUrl);

      setAgentFormData((prevData) => ({
        ...prevData,
        profilepic: downloadUrl,
      }));

      successToast("Profile Picture Updated");
    } catch (error) {
      console.error("Error updating profile picture:", error);
      errorToast("Something Went Wrong");
    } finally {
      setUploading(false);
    }
  };

  const openImagePicker = () => {
    const options = {
      mediaType: "photo",
      includeBase64: false,
    };

    launchImageLibrary(options, (response) => {
      if (!response.didCancel && !response.error) {
        let imageUri = response.uri || response.assets?.[0]?.uri;
        handleUploadProfilePic(imageUri);
      }
    });
  };

  const handleStep = () => {
    setStep(2)
  }

  return (
    <SafeAreaView style={styles.safearea}>
      <ScrollView contentContainerStyle={styles.scrollview}>
        <View style={styles.main}>
          <View style={styles.logo}>
            <Image
              style={styles.image}
              source={require("../../assets/logo.png")}
            />
          </View>

          {/* STEP 1: TERMS & CONDITIONS */}
          {step === 1 ? (
            <View>
              <Text style={styles.kyctext}>Terms and Conditions</Text>
              <TermsAndConditionsScreen handleStep={handleStep} />

            </View>
          ) : (
            // STEP 2: AGENT FORM
            <View>
              <Text style={styles.kyctext}>Agent KYC</Text>
              <View style={styles.textinputcontainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Full Name"
                  placeholderTextColor="#EBC7B1"
                  value={agentFormData.full_name}
                  onChangeText={(value) => handleChange("full_name", value)}
                />

                <TouchableOpacity onPress={() => setModalVisible(true)} activeOpacity={0.7}>
                  <TextInput
                    style={styles.input}
                    placeholder="Choose Date Of Birth"
                    placeholderTextColor="#EBC7B1"
                    value={agentFormData.date_of_birth}
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
                          handleChange("date_of_birth", newFormattedDate)

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


                <TextInput
                  style={styles.input}
                  placeholder="State"
                  placeholderTextColor="#EBC7B1"
                  value={agentFormData.state}
                  onChangeText={(value) => handleChange("state", value)}
                />

                <TextInput
                  style={styles.input}
                  placeholder="District"
                  placeholderTextColor="#EBC7B1"
                  value={agentFormData.district}
                  onChangeText={(value) => handleChange("district", value)}
                />

                <TextInput
                  style={styles.input}
                  maxLength={12}
                  placeholder="Aadhar Number"
                  placeholderTextColor="#EBC7B1"
                  keyboardType="numeric"
                  value={agentFormData.aadhar_number}
                  onChangeText={(value) => handleChange("aadhar_number", value)}
                />

                <TextInput
                  style={styles.input}
                  placeholder="Email ID"
                  placeholderTextColor="#EBC7B1"
                  keyboardType="email-address"
                  value={agentFormData.mail_id}
                  onChangeText={(value) => handleChange("mail_id", value)}
                />

                <View style={styles.profileimageupload}>
                  <Text style={styles.profiletext}>Profile pics</Text>
                  <TouchableOpacity >
                    <Camera strokeWidth={1} color="#EBC7B1" />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                  <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {uploading && (
          <View style={styles.loadingContainer}>
            <Loader />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default AgentsSteps;

const styles = StyleSheet.create({
  safearea: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollview: {
    flexGrow: 1
  },
  main: {
    flex: 1,
    gap: 30
  },
  logo: {
    alignItems: 'center',
    marginTop: 40,
  },

  image: {
    height: 60,
    width: 300,
    resizeMode: 'contain',
  },
  kyctext: {
    color: '#000',
    fontSize: 30,
    textAlign: 'center'
  },
  textinputcontainer: {
    paddingHorizontal: 10,
  },
  input: {
    borderColor: '#EBC7B1',
    borderWidth: 1,
    borderRadius: 12,
    paddingLeft: 10,
    color: '#EBC7B1',
    paddingVertical: 12,
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#BE7356',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 20
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  profileimageupload: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderColor: '#EBC7B1',
    borderWidth: 1,
    borderRadius: 12,
    paddingRight: width / 40,
    paddingLeft: width / 40,
    paddingVertical: width / 30,
  },

  profiletext: {
    color: '#EBC7B1',
    fontSize: 16,
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
