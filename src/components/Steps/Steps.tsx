import React, { useEffect, useState } from 'react';
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import storage from '@react-native-firebase/storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import RNPickerSelect from 'react-native-picker-select';
import useToastHook from '../../utils/useToastHook'
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Image,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import FIcon from 'react-native-vector-icons/Fontisto';
import { Asset, launchImageLibrary } from 'react-native-image-picker';
import useUpdateUserDetails from '../../hooks/useUpdateUserDetails';
import { Camera } from 'lucide-react-native';
import Loader from '../Loader/Loader';
import { Calendar } from 'react-native-calendars';
import { Profile } from '../../types';
import useUpdateUserDetails2 from '../../hooks/useUpdateUserDetails2';
import { API_ENDPOINTS } from '../../constants';
import api from '../../constants/axios';
import { camelToSnakeCase, getChangedFieldsWithOriginalValues } from '../../utils';

const { width, height } = Dimensions.get('window');

const calculateAge = (dob) => {
  // Split the date string into day, month, and year
  const [day, month, year] = dob.split("/").map(Number);

  // Create a Date object (month is zero-based in JS, so subtract 1)
  const birthDate = new Date(year, month - 1, day);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  const dayDiff = today.getDate() - birthDate.getDate();

  // Adjust age if the birthday hasn't occurred yet this year
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }

  return age;
};

// Step Components
const GenderSelection = ({ formData, updateFormData, nextStep }) => (
  <View style={styles.stepContainer}>
    <Text style={styles.header}>Create Profile</Text>

    <View style={styles.genderSelectionContainer}>
      {/* Male Selection */}
      <View style={styles.female}>
        <TouchableOpacity
          style={[
            styles.genderButton,
            formData?.personalInformation?.gender === 'Male' &&
            styles.selectedGenderButton,
          ]}
          onPress={() => {
            updateFormData(prevData => ({
              ...prevData,
              personalInformation: { ...prevData?.personalInformation, gender: 'Male' },
            }))

            updateFormData(prevData => ({
              ...prevData,
              personalInformation: { ...prevData?.personalInformation, profileType: 'Groom' },
            }))
          }
          }>
          {/* <FIcon color="#7b2a38" size={110} name="male" /> */}
          <Image source={require('../../assets/male.png')} style={styles.genderimage} />
        </TouchableOpacity>
        <Text style={styles.genderButtonText}>Groom</Text>
      </View>

      {/* Female Selection */}
      <View style={styles.female}>
        <TouchableOpacity
          style={[
            styles.genderButton,
            formData?.personalInformation?.gender === 'Female' &&
            styles.selectedGenderButton,
          ]}
          onPress={() => {
            updateFormData(prevData => ({
              ...prevData,
              personalInformation: { ...prevData?.personalInformation, gender: 'Female' },
            }))

            updateFormData(prevData => ({
              ...prevData,
              personalInformation: { ...prevData?.personalInformation, profileType: 'Bride' },
            }))
          }
          }>
          {/* <FIcon color="#7b2a38" size={110} name="female" /> */}
          <Image source={require('../../assets/female.png')} style={styles.genderimage} />
        </TouchableOpacity>
        <Text style={styles.genderButtonText}>Bride</Text>
      </View>
    </View>

    {/* Create Button with Opacity Change */}
    <TouchableOpacity
      onPress={nextStep}
      style={[
        styles.button,
        { opacity: formData?.personalInformation?.gender ? 1 : 0.5 },
      ]}
      disabled={!formData?.personalInformation?.gender}>
      <Text style={styles.buttontext}>Create</Text>
    </TouchableOpacity>
  </View>
);

const PersonalInfo = ({ formData, updateFormData, nextStep, prevStep, successToast, errorToast }) => {


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


  const handleNextStep = () => {
    if (!formData?.personalInformation?.firstName || !formData?.personalInformation?.lastName) {
      errorToast("Name Required");
      return
    }

    if (!formData?.personalInformation?.location) {
      errorToast("Location Required");
      return
    }

    if (!formData?.personalInformation?.dateOfBirth) {
      errorToast("DOB Required");
      return;
    }

    updateFormData(prevData => ({
      ...prevData,
      personalInformation: { ...prevData?.personalInformation, age: calculateAge(formData?.personalInformation?.dateOfBirth) },
    }))

    nextStep();
  }

  return (
    <View style={styles.stepContainer}>
      <Text style={styles.header}>Personal Information</Text>

      <View style={styles.inputcontainer}>
        <TextInput
          style={styles.input}
          placeholder="First Name"
          placeholderTextColor="#EBC7B1"
          value={formData?.personalInformation?.firstName || ''}
          onChangeText={value =>
            updateFormData(prevData => ({
              ...prevData,
              personalInformation: { ...prevData?.personalInformation, firstName: value },
            }))
          }
        />

        <TextInput
          style={styles.input}
          placeholder="Last Name"
          placeholderTextColor="#EBC7B1"
          value={formData?.personalInformation?.lastName || ''}
          onChangeText={value =>
            updateFormData(prevData => ({
              ...prevData,
              personalInformation: { ...prevData?.personalInformation, lastName: value },
            }))
          }
        />

        <TouchableOpacity onPress={() => setModalVisible(true)} activeOpacity={0.7}>
          <TextInput
            style={styles.input}
            placeholder="Choose Date Of Birth"
            placeholderTextColor="#EBC7B1"
            value={formData?.personalInformation?.dateOfBirth}
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
                  updateFormData(prevData => ({
                    ...prevData,
                    personalInformation: { ...prevData?.personalInformation, dateOfBirth: newFormattedDate },
                  }))

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
          placeholder="Height"
          placeholderTextColor="#EBC7B1"
          value={formData?.personalInformation?.height || ''}
          onChangeText={value =>
            updateFormData(prevData => ({
              ...prevData,
              personalInformation: { ...prevData?.personalInformation, height: value },
            }))
          }
        />

        <TextInput
          style={styles.input}
          placeholder="Mother Tongue"
          placeholderTextColor="#EBC7B1"
          value={formData?.personalInformation?.motherTongue || ''}
          onChangeText={value =>
            updateFormData(prevData => ({
              ...prevData,
              personalInformation: { ...prevData?.personalInformation, motherTongue: value },
            }))
          }
        />

        <TextInput
          style={styles.input}
          placeholder=" Location"
          placeholderTextColor="#EBC7B1"
          value={formData?.personalInformation?.location || ''}
          onChangeText={value =>
            updateFormData(prevData => ({
              ...prevData,
              personalInformation: {
                ...prevData?.personalInformation,
                location: value,
              },
            }))
          }
        />


        <View style={styles.prevnextbox}>
          <TouchableOpacity onPress={prevStep} style={styles.button}>
            <Text style={styles.buttontext}>Previous</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleNextStep} style={styles.button}>
            <Text style={styles.buttontext}>Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
};

const FamilyDetails = ({ formData, updateFormData, nextStep, prevStep }) => (
  <View style={styles.stepContainer}>
    <Text style={styles.header}>Family Details</Text>

    <View style={styles.inputcontainer}>
      <TextInput
        style={styles.input}
        placeholder="Father's Name"
        placeholderTextColor="#EBC7B1"
        value={formData?.familyInformation?.fatherName || ''}
        onChangeText={value =>
          updateFormData(prevData => ({
            ...prevData,
            familyInformation: {
              ...prevData?.familyInformation,
              fatherName: value,
            },
          }))
        }
      />

      <TextInput
        style={styles.input}
        placeholder="Father Occupation"
        placeholderTextColor="#EBC7B1"
        value={formData?.familyInformation?.fatherOccupation || ''}
        onChangeText={value =>
          updateFormData(prevData => ({
            ...prevData,
            familyInformation: {
              ...prevData?.familyInformation,
              fatherOccupation: value,
            },
          }))
        }
      />

      <View style={styles.pickerinput}>
        <RNPickerSelect
          onValueChange={value =>
            updateFormData(prevData => ({
              ...prevData,
              familyInformation: { ...prevData?.familyInformation, familyType: value },
            }))
          }
          useNativeAndroidPickerStyle={false}
          placeholder={{
            label: 'Select family type',
            value: '',
            color: '#EBC7B1',
            fontWeight: 'bold',
          }}
          style={{
            inputIOS: styles.pickerText,
            inputAndroid: styles.pickerText,
            placeholder: styles.placeholderText,
          }}
          items={[
            { label: 'Joint', value: 'Joint', color: 'white' },
            { label: 'Nuclear', value: 'Nuclear', color: 'white' },
          ]}
        />
      </View>

      <TextInput
        style={styles.input}
        placeholder="No. of Siblings"
        placeholderTextColor="#EBC7B1"
        value={formData?.familyInformation?.numberOfSiblings || ''}
        onChangeText={value =>
          updateFormData(prevData => ({
            ...prevData,
            familyInformation: {
              ...prevData?.familyInformation,
              numberOfSiblings: value,
            },
          }))
        }
      />

      <TextInput
        style={styles.input}
        placeholder="Native Location"
        placeholderTextColor="#EBC7B1"
        value={formData?.familyInformation?.nativePlace || ''}
        onChangeText={value =>
          updateFormData(prevData => ({
            ...prevData,
            familyInformation: {
              ...prevData?.familyInformation,
              nativePlace: value,
            },
          }))
        }
      />

      <TextInput
        style={styles.aboutinput}
        placeholder="About Family"
        placeholderTextColor="#EBC7B1"
        value={formData?.familyInformation?.aboutFamily || ''}
        onChangeText={value =>
          updateFormData(prevData => ({
            ...prevData,
            familyInformation: {
              ...prevData?.familyInformation,
              aboutFamily: value,
            },
          }))
        }
      />
      <View style={styles.prevnextbox}>
        <TouchableOpacity onPress={prevStep} style={styles.button}>
          <Text style={styles.buttontext}>Previous</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={nextStep} style={styles.button}>
          <Text style={styles.buttontext}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

const EducationProfession = ({
  formData,
  updateFormData,
  nextStep,
  prevStep,
}) => (
  <View style={styles.stepContainer}>
    <Text style={styles.header}>Education & Profession</Text>

    <View style={styles.inputcontainer}>
      <View style={styles.pickerinput}>
        <RNPickerSelect
          onValueChange={(value) =>
            updateFormData((prevData) => ({
              ...prevData,
              educationAndCareer: { ...prevData?.educationAndCareer, highestQualification: value },
            }))
          }
          useNativeAndroidPickerStyle={false}
          placeholder={{
            label: "Highest education",
            value: "",
            color: "#EBC7B1",
          }}
          style={{
            inputIOS: styles.pickerText,
            inputAndroid: styles.pickerText,
            placeholder: styles.placeholderText,
          }}
          items={[
            { label: "Bachelor's Degree", value: "Bachelor's Degree", color: 'white' },
            { label: "Master's Degree", value: "Master's Degree", color: 'white' },
            { label: 'Ph.D', value: 'Ph.D', color: 'white' },
            { label: 'Diploma', value: 'Diploma', color: 'white' },
          ]}
        />
      </View>

      <TextInput
        style={styles.input}
        placeholder="Occupation"
        placeholderTextColor="#EBC7B1"
        value={formData?.educationAndCareer?.occupation || ''}
        onChangeText={value =>
          updateFormData(prevData => ({
            ...prevData,
            educationAndCareer: {
              ...prevData?.educationAndCareer,
              occupation: value,
            },
          }))
        }
      />

      <TextInput
        style={styles.input}
        placeholder="Work Location"
        placeholderTextColor="#EBC7B1"
        value={formData?.educationAndCareer?.workingPlace || ''}
        onChangeText={value =>
          updateFormData(prevData => ({
            ...prevData,
            educationAndCareer: {
              ...prevData?.educationAndCareer,
              workingPlace: value,
            },
          }))
        }
      />

      <TextInput
        style={styles.input}
        placeholder="Annual Income"
        placeholderTextColor="#EBC7B1"
        value={formData?.educationAndCareer?.annualIncome || ''}
        onChangeText={value =>
          updateFormData(prevData => ({
            ...prevData,
            educationAndCareer: {
              ...prevData?.educationAndCareer,
              annualIncome: value,
            },
          }))
        }
      />

      <TextInput
        style={styles.aboutinput}
        placeholder="About Occupation"
        placeholderTextColor="#EBC7B1"
        value={formData?.educationAndCareer?.aboutOccupation || ''}
        onChangeText={value =>
          updateFormData(prevData => ({
            ...prevData,
            educationAndCareer: { ...prevData?.educationAndCareer, aboutOccupation: value },
          }))
        }
      />
      <View style={styles.prevnextbox}>
        <TouchableOpacity onPress={prevStep} style={styles.button}>
          <Text style={styles.buttontext}>Previous</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={nextStep} style={styles.button}>
          <Text style={styles.buttontext}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

const MaritalLifestyle = ({ formData, updateFormData, nextStep, prevStep }) => (
  <View style={styles.stepContainer}>
    <Text style={styles.header}>Marital Preferences & Lifestyle</Text>

    <View style={styles.inputcontainer}>

      <View style={styles.pickerinput}>
        <RNPickerSelect
          onValueChange={value =>
            updateFormData(prevData => ({
              ...prevData,
              lifestyleAndInterests: { ...prevData?.lifestyleAndInterests, maritalStatus: value },
            }))
          }
          useNativeAndroidPickerStyle={false}
          placeholder={{
            label: 'Select your marital status',
            value: '',
            color: '#EBC7B1',
            fontWeight: 'bold',
          }}
          style={{
            inputIOS: styles.pickerText,
            inputAndroid: styles.pickerText,
            placeholder: styles.placeholderText,
          }}
          items={[
            { label: 'Never Married', value: 'Never Married', color: 'white' },
            { label: 'Divorced', value: 'Divorced', color: 'white' },
            { label: 'Widowed', value: 'Widowed', color: 'white' },
          ]}
        />
      </View>
      <View style={styles.pickerinput}>
        <RNPickerSelect
          onValueChange={(value) =>
            updateFormData((prevData) => ({
              ...prevData,
              lifestyleAndInterests: {
                ...prevData?.lifestyleAndInterests,
                drinkingHabits: value,
              },
            }))
          }
          useNativeAndroidPickerStyle={false}
          placeholder={{
            label: "Drinking/Smoking habit",
            value: "",
            color: "#EBC7B1",
          }}
          style={{
            inputIOS: styles.pickerText,
            inputAndroid: styles.pickerText,
            placeholder: styles.placeholderText,
          }}
          items={[
            { label: "Never", value: "Never", color: "white" },
            { label: "Occasionally", value: "Occasionally", color: "white" },
            { label: "Regular", value: "Regular", color: "white" },
          ]}
        />
      </View>

      <TextInput
        style={styles.input}
        placeholder="Intrests"
        placeholderTextColor="#EBC7B1"
        value={formData?.lifestyleAndInterests?.interests?.join(', ') || ''}
        onChangeText={value => {
          updateFormData(prevData => ({
            ...prevData,
            lifestyleAndInterests: {
              ...prevData?.lifestyleAndInterests,
              interests: value.split(',').map(item => item.trim()),
            },
          }))
        }}
      />

      <TextInput
        style={styles.aboutinput}
        multiline={true}
        placeholder="About Lifestyle"
        placeholderTextColor="#EBC7B1"
        value={formData?.lifestyleAndInterests?.aboutLifestyle || ''}
        onChangeText={value => {
          updateFormData(prevData => ({
            ...prevData,
            lifestyleAndInterests: {
              ...prevData?.lifestyleAndInterests,
              aboutLifestyle: value,
            },
          }))
        }}
      />

      <View style={styles.prevnextbox}>
        <TouchableOpacity onPress={prevStep} style={styles.button}>
          <Text style={styles.buttontext}>Previous</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={nextStep} style={styles.button}>
          <Text style={styles.buttontext}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

const PartnerPreferences = ({ formData, updateFormData, nextStep, prevStep }) => {
  const { errorToast } = useToastHook();

  useEffect(() => {
    console.log('Partner Preferences')
  })

  const handleNextStep = () => {


    // if (formData?.partnerPreferences?.religion.length === 0) {
    //   errorToast("Religion Required");
    //   return;
    // }

    nextStep();
  };

  return (
    <View style={styles.stepContainer}>
      <Text style={styles.header}>Partner Preferences</Text>

      <View style={styles.inputcontainer}>
        <TextInput
          style={styles.input}
          placeholder="Age Range"
          placeholderTextColor="#EBC7B1"
          value={
            formData?.partnerPreferences?.ageRange || ''
          }
          onChangeText={value =>
            updateFormData(prevData => ({
              ...prevData,
              partnerPreferences: {
                ...prevData?.partnerPreferences,
                ageRange: value,
              },
            }))
          }
        />

        <TextInput
          style={styles.input}
          placeholder="Height Range"
          placeholderTextColor="#EBC7B1"
          value={
            formData?.partnerPreferences?.heightRange || ''
          }
          onChangeText={value =>
            updateFormData(prevData => ({
              ...prevData,
              partnerPreferences: {
                ...prevData?.partnerPreferences,
                heightRange: value,
              },
            }))
          }
        />

        <TextInput
          style={styles.input}
          placeholder="Preferred City"
          placeholderTextColor="#EBC7B1"
          value={
            formData?.partnerPreferences?.preferredCity || ''
          }
          onChangeText={value =>
            updateFormData(prevData => ({
              ...prevData,
              partnerPreferences: {
                ...prevData?.partnerPreferences,
                preferredCity: value,
              },
            }))
          }
        />

        {/* <View style={styles.pickerinput}>
        <RNPickerSelect
          onValueChange={value =>
            updateFormData(prevData => ({
              ...prevData,
              partnerPreferences: {
                ...prevData.partnerPreferences,
                religion: value,
              },
            }))
          }
          useNativeAndroidPickerStyle={false}
          placeholder={{
            label: 'Select your religion',
            value: '',
            color: '#EBC7B1',
            fontWeight: 'bold',
          }}
          style={{
            inputIOS: styles.pickerText,
            inputAndroid: styles.pickerText,
            placeholder: styles.placeholderText,
          }}
          items={[
            { label: 'Hindu', value: 'Hindu', color: 'white' },
            { label: 'Muslim', value: 'Muslim', color: 'white' },
            { label: 'Christian', value: 'Christian', color: 'white' },
            { label: 'Sikh', value: 'Sikh', color: 'white' },
            { label: 'Other', value: 'Other', color: 'white' },
          ]}
        />
      </View> */}
        <TextInput
          style={styles.aboutinput}
          placeholder="About Partner Preferences"
          placeholderTextColor="#EBC7B1"
          value={
            formData?.partnerPreferences?.aboutPreferences || ''
          }
          onChangeText={value =>
            updateFormData(prevData => ({
              ...prevData,
              partnerPreferences: {
                ...prevData?.partnerPreferences,
                aboutPreferences: value,
              },
            }))
          }
        />

        <View style={styles.prevnextbox}>
          <TouchableOpacity onPress={prevStep} style={styles.button}>
            <Text style={styles.buttontext}>Previous</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleNextStep} style={styles.button}>
            <Text style={styles.buttontext}>Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
};

const ContactVerification = ({
  formData,
  updateFormData,
  prevStep,
  submitForm,
  uploading,
  setUploading
}) => {
  const [data, setData] = useState({});
  const currentUser = auth().currentUser;
  const { successToast, errorToast } = useToastHook();
  const { getUserDetails } = useUpdateUserDetails2();

  useEffect(() => {
    const getData = async () => {
      const myData = await getUserDetails()
      setData(myData);
    }

    getData();
  }, [])


  const checkAadharExists = async () => {
    const aadhar_number = formData?.contactInformation?.kycDetails;

    try {
      const response = await api.post(API_ENDPOINTS.checkAAdharNumber, { aadhar_number });

      return response.data.exists;
    } catch (error) {
      console.error("Error checking aadhar number:", error);
      return false;
    }
  };

  const handleNextStep = () => {
    // const isExists = checkAadharExists()

    // if(isExists) {
    //   errorToast("Aadhar Exixts");
    //   return;
    // }

    submitForm();
  }


  const handleUploadProfilePic = async (image) => {
    if (!currentUser) {
      errorToast("User not logged in");
      return;
    }

    setUploading(true);

    try {

      const myFormdata = new FormData();

      myFormdata.append('phone', formData?.contactInformation?.phone);
      myFormdata.append('profile_picture', {
        uri: image.uri,
        type: image.type || 'image/jpeg',
        name: image.fileName || `profiles_${Date.now()}.jpg`,
      });

      const response = await api.post(
        API_ENDPOINTS.profilesUploadProfilePicture,
        myFormdata,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      const downloadUrl = response?.data?.profile_picture;

      console.log(downloadUrl)

      updateFormData(prevData => ({
        ...prevData,
        contactInformation: {
          ...prevData?.contactInformation,
          profilePicture: downloadUrl,
        },
      }))

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
      mediaType: 'photo',
      includeBase64: false,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
      } else if (response.error) {
      } else {
        let image = response.assets?.[0];
        handleUploadProfilePic(image);
      }
    });
  };

  return (
    <View style={styles.stepContainer}>
      <Text style={styles.header}>Contact & Verification</Text>

      <View style={styles.inputcontainer}>
        <View style={styles.phonenobody}>

          <View style={styles.phonenomain}>
            <TextInput
              style={styles.phoneno}
              editable={false}
              placeholder="Phone Number"
              keyboardType="number-pad"
              placeholderTextColor="#EBC7B1"
              value={formData?.contactInformation?.phone}></TextInput>
          </View>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#EBC7B1"
          value={formData?.contactInformation?.email || ''}
          onChangeText={value =>
            updateFormData(prevData => ({
              ...prevData,
              contactInformation: { ...prevData?.contactInformation, email: value },
            }))
          }
        />

        <TextInput
          style={styles.phoneno}
          placeholder="Instagram Id"
          placeholderTextColor="#EBC7B1"
          value={formData?.contactInformation?.instagramId || ''}
          onChangeText={value =>
            updateFormData(prevData => ({
              ...prevData,
              contactInformation: { ...prevData?.contactInformation, instagramId: value },
            }))
          }
        />



        <View style={styles.profileimageupload}>
          <Text style={styles.profiletext}>Profile pics</Text>
          <TouchableOpacity onPress={openImagePicker}>
            <Camera size={23} strokeWidth={1} color={'#EBC7B1'} />
          </TouchableOpacity>
        </View>
        {/* {formData.profile_pic && <View style={{height:200, width:200}}>
          <Image source={formData.profile_pic} style={{height:'100%', width:'100%'}}/>
        </View>} */}

        <TextInput
          style={styles.input}
          placeholder="Aadhar Number"
          placeholderTextColor="#EBC7B1"
          value={formData?.contactInformation?.kycDetails || ''}
          onChangeText={value =>
            updateFormData(prevData => ({
              ...prevData,
              contactInformation: { ...prevData?.contactInformation, kycDetails: value },
            }))
          }
        />
        <View style={styles.prevnextbox}>
          <TouchableOpacity onPress={prevStep} style={styles.button}>
            <Text style={styles.buttontext}>Previous</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleNextStep}>
            <Text style={styles.buttontext}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

// Header Component
const Header = () => (
  <View style={styles.logo}>
    <Image style={styles.image} source={require('../../assets/logo.png')} />
  </View>
);

// Main Steps Component
const Steps = (
  { navigation }
) => {
  const [uploading, setUploading] = useState();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [copiedFormData, setCopiedFormData] = useState({});

  const { successToast, errorToast } = useToastHook();

  const { getUserDetails, handleUserUpdate } = useUpdateUserDetails2();

  useEffect(() => {
    const getData = async () => {
      const myData = await getUserDetails()
      updateFormData(prevData => ({
        ...prevData,
        contactInformation: { ...prevData?.contactInformation, phone: myData?.contactInformation?.phone },
      }))

      updateFormData(prevData => ({
        ...prevData,
        personalInformation: { ...prevData?.personalInformation, dateOfBirth: myData?.personalInformation?.dateOfBirth },
      }))

      setFormData(myData);
      setCopiedFormData(myData)
    }

    getData();
  }, [])

  const saveUserData = async () => {
    try {
      const changedData = getChangedFieldsWithOriginalValues(formData, copiedFormData)

      const updatedData = camelToSnakeCase(changedData);
      const dataToSend = {
        uid: formData?.uid,
        ...updatedData
      }
      await handleUserUpdate(dataToSend);

      successToast("Data Updated");
    } catch (error) {
      errorToast("Something Went Wrong");

    }
  }

  const nextStep = () => setStep(prev => Math.min(prev + 1, 7));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const updateFormData = updater => setFormData(prev => ({ ...updater(prev) }));

  const submitForm = async () => {
    await saveUserData();

    navigation.replace('Layout');
  };

  const getHeaderTitle = () => {
    switch (step) {
      case 1:
        return 'Gender Selection';
      case 2:
        return 'Personal Information';
      case 3:
        return 'Family Details';
      case 4:
        return 'Education & Profession';
      case 5:
        return 'Marital Preferences & Lifestyle';
      case 6:
        return 'Partner Preferences';
      case 7:
        return 'Contact & Verification';
      default:
        return '';
    }
  };

  return (
    <SafeAreaView style={styles.safearea}>
      <ScrollView>
        <View style={styles.main}>
          <Header />
          {step === 1 && (
            <GenderSelection
              formData={formData}
              updateFormData={updateFormData}
              nextStep={nextStep}
            />
          )}
          {step === 2 && (
            <PersonalInfo
              formData={formData}
              updateFormData={updateFormData}
              nextStep={nextStep}
              prevStep={prevStep}
              successToast={successToast}
              errorToast={errorToast}
            />
          )}
          {step === 3 && (
            <FamilyDetails
              formData={formData}
              updateFormData={updateFormData}
              nextStep={nextStep}
              prevStep={prevStep}
            />
          )}
          {step === 4 && (
            <EducationProfession
              formData={formData}
              updateFormData={updateFormData}
              nextStep={nextStep}
              prevStep={prevStep}
            />
          )}
          {step === 5 && (
            <MaritalLifestyle
              formData={formData}
              updateFormData={updateFormData}
              nextStep={nextStep}
              prevStep={prevStep}
            />
          )}
          {step === 6 && (
            <PartnerPreferences
              formData={formData}
              updateFormData={updateFormData}
              nextStep={nextStep}
              prevStep={prevStep}
            />
          )}
          {step === 7 && (
            <ContactVerification
              formData={formData}
              updateFormData={updateFormData}
              prevStep={prevStep}
              submitForm={submitForm}
              uploading={uploading}
              setUploading={setUploading}
            />
          )}
        </View>
        <View style={uploading ? styles.loadingContainer : null}>
          {uploading && <Loader />}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Steps;

const styles = StyleSheet.create({
  safearea: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollview: {
    flex: 1,
  },
  main: {
    flexGrow: 1,
  },
  stepContainer: {
    flex: 1,
    padding: 20,
    borderColor: 'black',
    borderEndWidth: 2,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    marginTop: height * 0.05,
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
  genderSelectionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: width * 0.05,
    marginTop: height * 0.05,
  },
  genderButton: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 100,
    aspectRatio: 1,
    height: width * 0.4,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden'
  },
  female: {
    display: 'flex',
    flexDirection: 'column',
  },
  selectedGenderButton: {
    backgroundColor: '#BE7356',
  },
  genderButtonText: {
    color: '#BE7356',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
  },
  button: {
    borderRadius: 12,
    backgroundColor: '#BE7356',
    width: '50%',
    padding: width / 30,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 30,
  },
  buttontext: {
    textAlign: 'center',
    color: 'white',
  },
  prevnextbox: {
    display: 'flex',
    flexDirection: 'row',
    gap: 3,
  },
  input: {
    borderColor: '#EBC7B1',
    borderWidth: 1,
    borderRadius: 12,
    paddingLeft: width / 40,
    color: '#EBC7B1',
    paddingVertical: width / 30,
    fontWeight: '800',
    fontSize: 16,
  },
  pickerinput: {
    borderColor: '#EBC7B1',
    borderWidth: 1,
    borderRadius: 12,
    paddingLeft: width / 40,
    color: '#EBC7B1',
    fontWeight: '800',
    fontSize: 16,
  },
  aboutinput: {
    height: 100,
    borderColor: '#EBC7B1',
    borderWidth: 1,
    borderRadius: 12,
    paddingLeft: width / 40,
    color: '#EBC7B1',
    paddingVertical: width / 30,
    fontWeight: '800',
    fontSize: 16,
    textAlignVertical: 'top',
  },
  picker: {
    color: '#EBC7B1',
    fontWeight: 'bold',
  },
  inputcontainer: {
    marginTop: width / 30,
    display: 'flex',
    gap: width / 30,
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
    color: '#EBC7B1',
    height: 'auto',
    paddingLeft: width / 40,
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
    fontWeight: '800',
    fontSize: 16,
  },
  pickerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#EBC7B1',
  },
  placeholderText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#EBC7B1',
  },
  genderimage: {
    width: '100%',
    objectFit: 'contain'
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