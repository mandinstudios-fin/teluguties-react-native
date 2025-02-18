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
} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import FIcon from 'react-native-vector-icons/Fontisto';
import { Asset, launchImageLibrary } from 'react-native-image-picker';
import useUpdateUserDetails from '../../hooks/useUpdateUserDetails';

const { width, height } = Dimensions.get('window');

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
            formData.personal_info.gender === 'Male' &&
            styles.selectedGenderButton,
          ]}
          onPress={() => {
            updateFormData(prevData => ({
              ...prevData,
              personal_info: { ...prevData.personal_info, gender: 'Male' },
            }))

            updateFormData(prevData => ({
              ...prevData,
              is_bride: false,
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
            formData.personal_info.gender === 'Female' &&
            styles.selectedGenderButton,
          ]}
          onPress={() =>{
            updateFormData(prevData => ({
              ...prevData,
              personal_info: { ...prevData.personal_info, gender: 'Female' },
            }))

            updateFormData(prevData => ({
              ...prevData,
              is_bride: true,
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
        { opacity: formData.personal_info.gender ? 1 : 0.5 },
      ]}
      disabled={!formData.personal_info.gender}>
      <Text style={styles.buttontext}>Create</Text>
    </TouchableOpacity>
  </View>
);

const PersonalInfo = ({ formData, updateFormData, nextStep, prevStep }) => {

  return (
    <View style={styles.stepContainer}>
      <Text style={styles.header}>Personal Information</Text>

      <View style={styles.inputcontainer}>
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor="#EBC7B1"
          value={formData?.personal_info.name || ''}
          onChangeText={value =>
            updateFormData(prevData => ({
              ...prevData,
              personal_info: { ...prevData.personal_info, name: value },
            }))
          }
        />

        {/* <View style={styles.pickerinput}>
        <Picker
          selectedValue={formData?.personal_info.gender}
          onValueChange={(itemValue) => {
            updateFormData(prevData => ({ ...prevData, personal_info: { ...prevData.personal_info, gender: itemValue } }))
          }}
          style={styles.picker}
        >
          
          <Picker.Item label="Male" value="Male" />
          <Picker.Item label="Female" value="Female" />
        </Picker>
      </View> */}

        {/* <TextInput
          style={styles.input}
          placeholder="DOB (YYYY/MM/DD)"
          placeholderTextColor="#EBC7B1"
          value={formData?.personal_info.date_of_birth || ''}
          onChangeText={(value) => updateFormData(prevData => ({ ...prevData, personal_info: { ...prevData.personal_info, date_of_birth: value } }))}
        /> */}

        <TextInput
          style={styles.input}
          placeholder="Weight"
          placeholderTextColor="#EBC7B1"
          value={formData?.personal_info.weight || ''}
          onChangeText={value =>
            updateFormData(prevData => ({
              ...prevData,
              personal_info: { ...prevData.personal_info, weight: value },
            }))
          }
        />

        <TextInput
          style={styles.input}
          placeholder="Height"
          placeholderTextColor="#EBC7B1"
          value={formData?.personal_info.height || ''}
          onChangeText={value =>
            updateFormData(prevData => ({
              ...prevData,
              personal_info: { ...prevData.personal_info, height: value },
            }))
          }
        />

        <View style={styles.pickerinput}>
          <RNPickerSelect
            onValueChange={value =>
              updateFormData(prevData => ({
                ...prevData,
                personal_info: { ...prevData.personal_info, blood_group: value },
              }))
            }
            useNativeAndroidPickerStyle={false}
            placeholder={{
              label: 'Select your blood group',
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
              { label: 'A+', value: 'A+', color: 'white' },
              { label: 'A-', value: 'A-', color: 'white' },
              { label: 'B+', value: 'B+', color: 'white' },
              { label: 'B-', value: 'B-', color: 'white' },
              { label: 'O+', value: 'O+', color: 'white' },
              { label: 'O-', value: 'O-', color: 'white' },
              { label: 'AB+', value: 'AB+', color: 'white' },
              { label: 'AB-', value: 'AB-', color: 'white' },
            ]}
          />
        </View>

        <View style={styles.pickerinput}>
          <RNPickerSelect
            onValueChange={value =>
              updateFormData(prevData => ({
                ...prevData,
                personal_info: { ...prevData.personal_info, marital_status: value },
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

        <TextInput
          style={styles.input}
          placeholder="No. of Children"
          placeholderTextColor="#EBC7B1"
          value={formData?.personal_info.num_children || ''}
          onChangeText={value =>
            updateFormData(prevData => ({
              ...prevData,
              personal_info: { ...prevData.personal_info, num_children: value },
            }))
          }
        />

        <View style={styles.pickerinput}>
          <RNPickerSelect
            onValueChange={value =>
              updateFormData(prevData => ({
                ...prevData,
                religious_cultural: {
                  ...prevData.religious_cultural,
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
        </View>

        <TextInput
          style={styles.input}
          placeholder="Caste"
          placeholderTextColor="#EBC7B1"
          value={formData?.religious_cultural?.caste || ''}
          onChangeText={value =>
            updateFormData(prevData => ({
              ...prevData,
              religious_cultural: { ...prevData.religious_cultural, caste: value },
            }))
          }
        />

        <TextInput
          style={styles.input}
          placeholder="SubCaste"
          placeholderTextColor="#EBC7B1"
          value={formData?.religious_cultural?.subcaste || ''}
          onChangeText={value =>
            updateFormData(prevData => ({
              ...prevData,
              religious_cultural: {
                ...prevData.religious_cultural,
                subcaste: value,
              },
            }))
          }
        />

        <TextInput
          style={styles.input}
          placeholder="Gothra"
          placeholderTextColor="#EBC7B1"
          value={formData?.religious_cultural?.gothra || ''}
          onChangeText={value =>
            updateFormData(prevData => ({
              ...prevData,
              religious_cultural: { ...prevData.religious_cultural, gothra: value },
            }))
          }
        />

        <TextInput
          style={styles.input}
          placeholder="Star/Rashi"
          placeholderTextColor="#EBC7B1"
          value={formData?.religious_cultural?.star_rashi || ''}
          onChangeText={value =>
            updateFormData(prevData => ({
              ...prevData,
              religious_cultural: {
                ...prevData.religious_cultural,
                star_rashi: value,
              },
            }))
          }
        />

        <View style={styles.pickerinput}>
          <RNPickerSelect
            onValueChange={value =>
              updateFormData(prevData => ({
                ...prevData,
                religious_cultural: {
                  ...prevData.religious_cultural,
                  manglik_status: value,
                },
              }))
            }
            useNativeAndroidPickerStyle={false}
            placeholder={{
              label: 'Select your manglik status',
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
              { label: 'Manglik', value: 'Manglik', color: 'white' },
              { label: 'Non-Manglik', value: 'Non-Manglik', color: 'white' },
              { label: 'Anshik Manglik', value: 'Anshik Manglik', color: 'white' },
            ]}
          />
        </View>

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
        value={formData?.family_background?.father_name || ''}
        onChangeText={value =>
          updateFormData(prevData => ({
            ...prevData,
            family_background: {
              ...prevData.family_background,
              father_name: value,
            },
          }))
        }
      />

      <TextInput
        style={styles.input}
        placeholder="Mother's Name"
        placeholderTextColor="#EBC7B1"
        value={formData?.family_background?.mother_name || ''}
        onChangeText={value =>
          updateFormData(prevData => ({
            ...prevData,
            family_background: {
              ...prevData.family_background,
              mother_name: value,
            },
          }))
        }
      />

      <TextInput
        style={styles.input}
        placeholder="No. of Brothers"
        placeholderTextColor="#EBC7B1"
        value={formData?.family_background?.num_brothers || ''}
        onChangeText={value =>
          updateFormData(prevData => ({
            ...prevData,
            family_background: {
              ...prevData.family_background,
              num_brothers: value,
            },
          }))
        }
      />

      <TextInput
        style={styles.input}
        placeholder="No. of Sisters"
        placeholderTextColor="#EBC7B1"
        value={formData?.family_background?.num_sisters || ''}
        onChangeText={value =>
          updateFormData(prevData => ({
            ...prevData,
            family_background: {
              ...prevData.family_background,
              num_sisters: value,
            },
          }))
        }
      />

      <View style={styles.pickerinput}>
        <RNPickerSelect
          onValueChange={value =>
            updateFormData(prevData => ({
              ...prevData,
              family_background: { ...prevData.family_background, family_type: value },
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

      <View style={styles.pickerinput}>
        <RNPickerSelect
          onValueChange={value =>
            updateFormData(prevData => ({
              ...prevData,
              family_background: { ...prevData.family_background, family_status: value },
            }))
          }
          useNativeAndroidPickerStyle={false}
          placeholder={{
            label: 'Select your family ststus',
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
            { label: 'Middle', value: 'Middle', color: 'white' },
            { label: 'Upper Middle', value: 'Upper Middle', color: 'white' },
            { label: 'Rich', value: 'Rich', color: 'white' },
            { label: 'Affluent', value: 'Affluent', color: 'white' },

          ]}
        />
      </View>

      <View style={styles.pickerinput}>
        <RNPickerSelect
          onValueChange={value =>
            updateFormData(prevData => ({
              ...prevData,
              family_background: { ...prevData.family_background, family_values: value },
            }))
          }
          useNativeAndroidPickerStyle={false}
          placeholder={{
            label: 'Select your family value',
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
            { label: 'Traditional', value: 'Traditional', color: 'white' },
            { label: 'Moderate', value: 'Moderate', color: 'white' },
            { label: 'Modern', value: 'Modern', color: 'white' },

          ]}
        />
      </View>

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
              education: { ...prevData.education, highest_education: value },
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
        placeholder="Field of Study"
        placeholderTextColor="#EBC7B1"
        value={formData?.education?.field_of_study || ''}
        onChangeText={value =>
          updateFormData(prevData => ({
            ...prevData,
            education: { ...prevData.education, field_of_study: value },
          }))
        }
      />

      <TextInput
        style={styles.input}
        placeholder="College/ University"
        placeholderTextColor="#EBC7B1"
        value={formData?.education?.college || ''}
        onChangeText={value =>
          updateFormData(prevData => ({
            ...prevData,
            education: { ...prevData.education, college: value },
          }))
        }
      />

      <TextInput
        style={styles.input}
        placeholder="Graduation Year"
        placeholderTextColor="#EBC7B1"
        value={formData?.education?.graduation_year || ''}
        onChangeText={value =>
          updateFormData(prevData => ({
            ...prevData,
            education: { ...prevData.education, graduation_year: value },
          }))
        }
      />

      <TextInput
        style={styles.input}
        placeholder="Occupation"
        placeholderTextColor="#EBC7B1"
        value={formData?.professional_details?.occupation || ''}
        onChangeText={value =>
          updateFormData(prevData => ({
            ...prevData,
            professional_details: {
              ...prevData.professional_details,
              occupation: value,
            },
          }))
        }
      />

      <TextInput
        style={styles.input}
        placeholder="Employer"
        placeholderTextColor="#EBC7B1"
        value={formData?.professional_details?.employer || ''}
        onChangeText={value =>
          updateFormData(prevData => ({
            ...prevData,
            professional_details: {
              ...prevData.professional_details,
              employer: value,
            },
          }))
        }
      />

      <TextInput
        style={styles.input}
        placeholder="Job Location"
        placeholderTextColor="#EBC7B1"
        value={formData?.professional_details?.job_location || ''}
        onChangeText={value =>
          updateFormData(prevData => ({
            ...prevData,
            professional_details: {
              ...prevData.professional_details,
              job_location: value,
            },
          }))
        }
      />

      <TextInput
        style={styles.input}
        placeholder="Annual Income"
        placeholderTextColor="#EBC7B1"
        value={formData?.professional_details?.annual_income || ''}
        onChangeText={value =>
          updateFormData(prevData => ({
            ...prevData,
            professional_details: {
              ...prevData.professional_details,
              annual_income: value,
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

const MaritalLifestyle = ({ formData, updateFormData, nextStep, prevStep }) => (
  <View style={styles.stepContainer}>
    <Text style={styles.header}>Marital Preferences & Lifestyle</Text>

    <View style={styles.inputcontainer}>
      <View style={styles.pickerinput}>
        <RNPickerSelect
          onValueChange={(value) =>
            updateFormData((prevData) => ({
              ...prevData,
              lifestyle_preferences: {
                ...prevData.lifestyle_preferences,
                drinking_habits: value,
              },
            }))
          }
          useNativeAndroidPickerStyle={false}
          placeholder={{
            label: "Select drinking habit...",
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

      <View style={styles.pickerinput}>
        <RNPickerSelect
          onValueChange={(value) =>
            updateFormData((prevData) => ({
              ...prevData,
              lifestyle_preferences: {
                ...prevData.lifestyle_preferences,
                smoking_habits: value,
              },
            }))
          }
          useNativeAndroidPickerStyle={false}
          placeholder={{
            label: "Select smoking habit...",
            value: "",
            color: "#EBC7B1",
          }}
          style={{
            inputIOS: styles.pickerText,
            inputAndroid: styles.pickerText,
            placeholder: styles.placeholderText,
          }}
          items={[
            { label: "Non-Smoker", value: "Non-Smoker", color: "white" },
            { label: "Occasionally Smoker", value: "Occasionally Smoker", color: "white" },
            { label: "Regular Smoker", value: "Regular Smoker", color: "white" },
          ]}
        />
      </View>

      <View style={styles.pickerinput}>
        <RNPickerSelect
          onValueChange={(value) =>
            updateFormData((prevData) => ({
              ...prevData,
              lifestyle_preferences: {
                ...prevData.lifestyle_preferences,
                diet_preferences: value,
              },
            }))
          }
          useNativeAndroidPickerStyle={false}
          placeholder={{
            label: "Diet preferences",
            value: "",
            color: "#EBC7B1",
          }}
          style={{
            inputIOS: styles.pickerText,
            inputAndroid: styles.pickerText,
            placeholder: styles.placeholderText,
          }}
          items={[
            { label: "Vegetarian", value: "Vegetarian", color: "white" },
            { label: "Non-Vegetarian", value: "Non-Vegetarian", color: "white" },
            { label: "Eggetarian", value: "Eggetarian", color: "white" },
          ]}
        />
      </View>

      <TextInput
        style={styles.input}
        placeholder="Personality preference"
        multiline={true}
        placeholderTextColor="#EBC7B1"
        value={formData?.lifestyle_preferences?.personality_preferences || ''}
        onChangeText={value =>
          updateFormData(prevData => ({
            ...prevData,
            lifestyle_preferences: {
              ...prevData.lifestyle_preferences,
              personality_preferences: value,
            },
          }))
        }
      />

      <TextInput
        style={styles.input}
        placeholder="Appearance preferences"
        multiline={true}
        placeholderTextColor="#EBC7B1"
        value={formData?.lifestyle_preferences?.appearance_preferences || ''}
        onChangeText={value =>
          updateFormData(prevData => ({
            ...prevData,
            lifestyle_preferences: {
              ...prevData.lifestyle_preferences,
              appearance_preferences: value,
            },
          }))
        }
      />

      <TextInput
        style={styles.input}
        placeholder="Hobbies & Intrests"
        placeholderTextColor="#EBC7B1"
        value={formData?.hobbies_interests?.join(', ') || ''}
        onChangeText={value => {
          updateFormData(prev => ({
            ...prev,
            hobbies_interests: value.split(',').map(item => item.trim()),
          }));
        }}
      />

      <TextInput
        style={styles.aboutinput}
        multiline={true}
        placeholder="About Me"
        placeholderTextColor="#EBC7B1"
        value={formData?.about_me || ''}
        onChangeText={value => {
          updateFormData(prev => ({
            ...prev,
            about_me: value,
          }));
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

const PartnerPreferences = ({ formData, updateFormData, nextStep, prevStep }) => (
  <View style={styles.stepContainer}>
    <Text style={styles.header}>Partner Preferences</Text>

    <View style={styles.inputcontainer}>
      <TextInput
        style={styles.input}
        placeholder="Age Range(Min)"
        placeholderTextColor="#EBC7B1"
        value={
          formData?.matrimonial_expectations?.preferred_age_range?.min ?? ''
        }
        onChangeText={value =>
          updateFormData(prevData => ({
            ...prevData,
            matrimonial_expectations: {
              ...prevData.matrimonial_expectations,
              preferred_age_range: {
                ...prevData.matrimonial_expectations.preferred_age_range,
                min: value,
              },
            },
          }))
        }
      />

      <TextInput
        style={styles.input}
        placeholder="Age Range(Max)"
        placeholderTextColor="#EBC7B1"
        value={
          formData?.matrimonial_expectations?.preferred_age_range?.max !=
            undefined
            ? formData.matrimonial_expectations.preferred_age_range.max
            : ''
        }
        onChangeText={value =>
          updateFormData(prevData => ({
            ...prevData,
            matrimonial_expectations: {
              ...prevData.matrimonial_expectations,
              preferred_age_range: {
                ...prevData.matrimonial_expectations.preferred_age_range,
                max: value,
              },
            },
          }))
        }
      />

      <TextInput
        style={styles.input}
        placeholder="Height Range(Min)"
        placeholderTextColor="#EBC7B1"
        value={
          formData?.matrimonial_expectations?.preferred_height_range?.min !=
            undefined
            ? formData.matrimonial_expectations.preferred_height_range.min
            : ''
        }
        onChangeText={value =>
          updateFormData(prevData => ({
            ...prevData,
            matrimonial_expectations: {
              ...prevData.matrimonial_expectations,
              preferred_height_range: {
                ...prevData.matrimonial_expectations.preferred_height_range,
                min: value,
              },
            },
          }))
        }
      />

      <TextInput
        style={styles.input}
        placeholder="Height Range(Max)"
        placeholderTextColor="#EBC7B1"
        value={
          formData?.matrimonial_expectations?.preferred_height_range?.max !=
            undefined
            ? formData.matrimonial_expectations.preferred_height_range.max
            : ''
        }
        onChangeText={value =>
          updateFormData(prevData => ({
            ...prevData,
            matrimonial_expectations: {
              ...prevData.matrimonial_expectations,
              preferred_height_range: {
                ...prevData.matrimonial_expectations.preferred_height_range,
                max: value,
              },
            },
          }))
        }
      />

      <TextInput
        style={styles.input}
        placeholder="Preferred Location"
        placeholderTextColor="#EBC7B1"
        value={
          formData?.matrimonial_expectations?.preferred_location != undefined
            ? formData.matrimonial_expectations.preferred_location
            : ''
        }
        onChangeText={value =>
          updateFormData(prevData => ({
            ...prevData,
            matrimonial_expectations: {
              ...prevData.matrimonial_expectations,
              preferred_location: value,
            },
          }))
        }
      />

      <TextInput
        style={styles.input}
        placeholder="Preferred Education"
        placeholderTextColor="#EBC7B1"
        value={
          formData?.matrimonial_expectations?.preferred_education != undefined
            ? formData.matrimonial_expectations.preferred_education
            : ''
        }
        onChangeText={value =>
          updateFormData(prevData => ({
            ...prevData,
            matrimonial_expectations: {
              ...prevData.matrimonial_expectations,
              preferred_education: value,
            },
          }))
        }
      />

      <TextInput
        style={styles.input}
        placeholder="Preferred Occupation"
        placeholderTextColor="#EBC7B1"
        value={
          formData?.matrimonial_expectations?.preferred_occupation != undefined
            ? formData.matrimonial_expectations.preferred_occupation
            : ''
        }
        onChangeText={value =>
          updateFormData(prevData => ({
            ...prevData,
            matrimonial_expectations: {
              ...prevData.matrimonial_expectations,
              preferred_occupation: value,
            },
          }))
        }
      />

      <TextInput
        style={styles.input}
        placeholder="Minimum Annual Income"
        keyboardType="number-pad"
        placeholderTextColor="#EBC7B1"
        value={
          formData?.matrimonial_expectations?.preferred_income != undefined
            ? formData.matrimonial_expectations.preferred_income
            : ''
        }
        onChangeText={value =>
          updateFormData(prevData => ({
            ...prevData,
            matrimonial_expectations: {
              ...prevData.matrimonial_expectations,
              preferred_income: value,
            },
          }))
        }
      />

      <TextInput
        style={styles.input}
        placeholder="Other Preferences"
        placeholderTextColor="#EBC7B1"
        value={
          formData?.matrimonial_expectations?.other_preferences != undefined
            ? formData.matrimonial_expectations.other_preferences
            : ''
        }
        onChangeText={value =>
          updateFormData(prevData => ({
            ...prevData,
            matrimonial_expectations: {
              ...prevData.matrimonial_expectations,
              other_preferences: value,
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
  const {getUserDetails } = useUpdateUserDetails();

  useEffect(() => {
    const getData = async () => {
      const myData = await getUserDetails()
      setData(myData);
    }

    getData();
  },[])


  const handleUploadProfilePic = async (imageUri: string) => {
    if (!currentUser) {
      errorToast("User not logged in");
      return;
    }

    setUploading(true);

    try {
      const fileName = imageUri.split('/').pop();
      const uniqueFileName = `${Date.now()}_${fileName}`;

      // Upload the selected image
      const reference = storage().ref(`profile-images/${uniqueFileName}`);
      const task = reference.putFile(imageUri);

      task.on(
        'state_changed',
        (snapshot) => {
          const uploadProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${uploadProgress}% done`);
        },
        (error) => {
          console.error("Upload error", error);
        }
      );

      await task;
      const downloadUrl = await reference.getDownloadURL();

      console.log(downloadUrl)

      updateFormData(prevData => ({
        ...prevData,
        profile_pic: downloadUrl,
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
      mediaType: 'photo',
      includeBase64: false,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
      } else if (response.error) {
      } else {
        let imageUri = response.uri || response.assets?.[0]?.uri;
        handleUploadProfilePic(imageUri);
      }
    });
  };

  

  return (
    <View style={styles.stepContainer}>
      <Text style={styles.header}>Contact & Verification</Text>

      <View style={styles.inputcontainer}>
        <View style={styles.phonenobody}>
          <View style={styles.phonecode}>
            <TextInput
              style={styles.phoneno}
              editable={false}
              placeholder="+91"
              placeholderTextColor="#EBC7B1"
              value={data?.contact_info?.selected_code}></TextInput>
          </View>
          <View style={styles.phonenomain}>
            <TextInput
              style={styles.phoneno}
              editable={false}
              placeholder="Phone Number"
              keyboardType="number-pad"
              placeholderTextColor="#EBC7B1"
              value={data?.contact_info?.phone}></TextInput>
          </View>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Current City"
          placeholderTextColor="#EBC7B1"
          value={formData?.contact_info.current_city || ''}
          onChangeText={value =>
            updateFormData(prevData => ({
              ...prevData,
              contact_info: { ...prevData.contact_info, current_city: value },
            }))
          }
        />

        <TextInput
          style={styles.input}
          placeholder="City"
          placeholderTextColor="#EBC7B1"
          value={
            formData?.contact_info?.permanent_address?.city !== undefined
              ? formData?.contact_info?.permanent_address?.city
              : ''
          }
          onChangeText={value =>
            updateFormData(prevData => ({
              ...prevData,
              contact_info: { ...prevData.permanent_address, city: value },
            }))
          }
        />

        <TextInput
          style={styles.input}
          placeholder="State"
          placeholderTextColor="#EBC7B1"
          value={
            formData?.contact_info?.permanent_address?.state !== undefined
              ? formData?.contact_info?.permanent_address?.state
              : ''
          }
          onChangeText={value =>
            updateFormData(prevData => ({
              ...prevData,
              contact_info: { ...prevData.permanent_address, state: value },
            }))
          }
        />

        <TextInput
          style={styles.input}
          placeholder="Country"
          placeholderTextColor="#EBC7B1"
          value={
            formData?.contact_info?.permanent_address?.country !== undefined
              ? formData?.contact_info?.permanent_address?.country
              : ''
          }
          onChangeText={value =>
            updateFormData(prevData => ({
              ...prevData,
              contact_info: { ...prevData.permanent_address, country: value },
            }))
          }
        />

        <TextInput
          style={styles.input}
          placeholder="Pincode"
          keyboardType="number-pad"
          placeholderTextColor="#EBC7B1"
          value={
            formData?.contact_info?.permanent_address?.pincode !== undefined
              ? formData?.contact_info?.permanent_address?.pincode
              : ''
          }
          onChangeText={value =>
            updateFormData(prevData => ({
              ...prevData,
              contact_info: { ...prevData.permanent_address, pincode: value },
            }))
          }
        />

        <TextInput
          style={styles.input}
          placeholder="Street"
          placeholderTextColor="#EBC7B1"
          value={
            formData?.contact_info?.permanent_address?.street !== undefined
              ? formData?.contact_info?.permanent_address?.street
              : ''
          }
          onChangeText={value =>
            updateFormData(prevData => ({
              ...prevData,
              contact_info: { ...prevData.permanent_address, street: value },
            }))
          }
        />

        <View style={styles.profileimageupload}>
          <Text style={styles.profiletext}>Profile pics</Text>
          <TouchableOpacity>
            <Icon
              color="#EBC7B1"
              size={30}
              name="attachment"
              onPress={openImagePicker}
            />
          </TouchableOpacity>
        </View>
        {/* {formData.profile_pic && <View style={{height:200, width:200}}>
          <Image source={formData.profile_pic} style={{height:'100%', width:'100%'}}/>
        </View>} */}


        <View style={styles.prevnextbox}>
          <TouchableOpacity onPress={prevStep} style={styles.button}>
            <Text style={styles.buttontext}>Previous</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={submitForm}>
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
  {navigation}
) => {
  const [data, setData] = useState({});
  const [uploading, setUploading] = useState();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    phone_number: '',
    is_bride: '',
    profile_pic: '',
    personal_info: {
      name: '',
      gender: '',
      date_of_birth: '',
      age: '',
      height: '',
      weight: '',
      blood_group: '',
      marital_status: '',
      num_children: 0,
    },
    contact_info: {
      phone: '',
      selected_code: '',
      email: '',
      current_city: '',
      permanent_address: {
        street: '',
        city: '',
        state: '',
        country: 'India',
        pincode: '',
      },
    },
    family_background: {
      family_type: '',
      father_name: '',
      mother_name: '',
      num_brothers: 0,
      num_sisters: 0,
      family_values: '',
      family_status: '',
    },
    education: {
      highest_education: '',
      field_of_study: '',
      college: '',
      graduation_year: '',
    },
    professional_details: {
      occupation: '',
      employer: '',
      annual_income: 0,
      job_location: '',
    },
    hobbies_interests: [],
    religious_cultural: {
      religion: '',
      caste: '',
      subcaste: '',
      gothra: '',
      star_rashi: '',
      manglik_status: '',
    },
    lifestyle_preferences: {
      drinking_habits: '',
      smoking_habits: '',
      diet_preferences: '',
      appearance_preferences: '',
      personality_preferences: '',
    },
    matrimonial_expectations: {
      preferred_age_range: {
        min: 0,
        max: 0,
      },
      preferred_height_range: {
        min: 0,
        max: 0,
      },
      preferred_location: '',
      preferred_caste_subcaste: [],
      preferred_education: '',
      preferred_occupation: '',
      preferred_income: 0,
      other_preferences: '',
    },
    about_me: '',
    createdAt: firestore.FieldValue.serverTimestamp(),
    updatedAt: firestore.FieldValue.serverTimestamp(),
  });

  const currentUser = auth().currentUser;
  const { successToast, errorToast } = useToastHook();

  const {getUserDetails } = useUpdateUserDetails();

  useEffect(() => {
    const getData = async () => {
      const myData = await getUserDetails()
      updateFormData(prevData => ({
        ...prevData,
        contact_info: { ...prevData.contact_info, phone: myData.contact_info.phone },
      }))
      updateFormData(prevData => ({
        ...prevData,
        contact_info: { ...prevData.contact_info, selected_code: myData.contact_info.selected_code },
      }))

      updateFormData(prevData => ({
        ...prevData,
        personal_info: { ...prevData.personal_info, date_of_birth: myData.personal_info.date_of_birth },
      }))

      setData(myData);
    }

    getData();
  },[])

  const saveUserData = async () => {
    try {
      const userRef = firestore().collection('profiles').doc(currentUser?.uid);

      const updatedData = {
        ...formData,
        updatedAt: firestore.FieldValue.serverTimestamp()
      }

      console.log(updatedData)

      await userRef.update(updatedData);
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
          {uploading && <ActivityIndicator size="large" color="#a4737b" />}
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
    color: '#BE7356',
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
