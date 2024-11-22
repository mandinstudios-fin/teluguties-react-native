import { ActivityIndicator, Alert, Button, Dimensions, Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '../Header/Header'

import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import storage from '@react-native-firebase/storage';

import { Picker } from '@react-native-picker/picker'
import { launchImageLibrary } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get("window")

const CreateProfile = ({ navigation }) => {
    const [uploading, setUploading] = useState(false);
    const [userData, setUserData] = useState<any>();
    const [firestoreData, setFiretoreData] = useState<any>();

    const getCurrentUserDetails = async () => {
        const currentUser = auth().currentUser;

        if (currentUser) {
            try {
                const userDoc = await firestore()
                    .collection('profiles')
                    .doc(currentUser.uid)
                    .get();

                if (userDoc.exists) {
                    const userDataFirestore = userDoc.data();
                    setFiretoreData(userDataFirestore);
                    setUserData(userDataFirestore);
                }
            } catch (error) {
                console.log(error)
            }
        }
    }

    useEffect(() => {
        getCurrentUserDetails();
    }, []);

    const handleUserUpdate = async () => {
        const currentUser = auth().currentUser;

        const updatedData = {
            ...userData,
            updatedAt: firestore.FieldValue.serverTimestamp()
        }

        if (currentUser) {
            try {
                await firestore()
                    .collection('profiles')
                    .doc(currentUser.uid)
                    .update(updatedData);

                Alert.alert("Updated");
                getCurrentUserDetails();
            } catch (error) {
                Alert.alert(error)
                console.log(error);
            }
        }
    }

    const handleInputChange = (section: string, parameter: string, value: string, subsection?: string) => {
        setUserData((prev) => {
            if (subsection) {
                return {
                    ...prev,
                    [section]: {
                        ...prev[section],
                        [subsection]: {
                            ...prev[section][subsection],
                            [parameter]: value
                        }
                    }
                };
            }
            return {
                ...prev,
                [section]: {
                    ...prev[section],
                    [parameter]: value
                }
            };
        });
    };

    const uploadImageToFirebase = async (imageUri: string) => {
        if (!imageUri) return null;

        const fileName = imageUri.split('/').pop();
        const uniqueFileName = `${Date.now()}_${fileName}`;

        const reference = storage().ref(`profile-images/${uniqueFileName}`);

        setUploading(true);

        try {
            const task = reference.putFile(imageUri);
            task.on('state_changed', (taskSnapshot) => {
                const progress = (taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) * 100;
                console.log(`Progress: ${progress}%`);
            });

            await task;

            const downloadUrl = await reference.getDownloadURL();

            setUploading(false);

            return downloadUrl;

        } catch (error) {
            console.error('Upload error: ', error);
            Alert.alert('Upload Error', 'There was an error uploading the image.');
            setUploading(false);
            return null;
        }
    }

    const handleProfileImages = async (imageUri: string) => {
        const currentUser = auth().currentUser;
        const downloadUrl = await uploadImageToFirebase(imageUri);

        console.log(downloadUrl)

        const updatedData = {
            ...userData,
            profile_pic: downloadUrl,
            updatedAt: firestore.FieldValue.serverTimestamp()
        }

        if (currentUser) {
            try {
                await firestore()
                    .collection('profiles')
                    .doc(currentUser.uid)
                    .update(updatedData);

                Alert.alert("Updated");
                getCurrentUserDetails();
            } catch (error) {
                Alert.alert(error)
                console.log(error);
            }
        }
    }

    const openImagePicker = () => {
        const options = {
            mediaType: 'photo',
            includeBase64: false,
        };

        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('Image picker error: ', response.error);
            } else {
                let imageUri = response.uri || response.assets?.[0]?.uri;
                handleProfileImages(imageUri);
            }
        });
    };

    const ActivityIndicatorComponent = () => {
        return (
            <View style={styles.activityContainer}>
                <ActivityIndicator size="large" color="#a4737b" />
            </View>
        )
    };

    return (
        <SafeAreaView style={styles.safearea}>
            <ScrollView style={styles.main}>
                <Header navigation={navigation} />
                <View style={styles.container}>
                    <View style={styles.profile}>
                        <Text style={styles.profiletext}>CREATE PROFILE</Text>
                    </View>

                    <View>
                        <Text style={styles.subheading}>Personal Information</Text>
                        <View style={styles.subcontainer}>
                            <TouchableOpacity style={styles.circlebody} onPress={openImagePicker}>
                                <View style={styles.circle}>
                                    <Image source={{ uri: firestoreData?.profile_pic }} height={height * 0.25} width={width * 0.50} borderRadius={500} resizeMode='cover' />
                                    <Icon name="add-circle" size={40} color="#fff" style={styles.photoicon} />
                                </View>
                            </TouchableOpacity>

                            <View>
                                <Text style={styles.label}>Full Name</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Full Name"
                                    placeholderTextColor="#EBC7B1"
                                    value={userData?.personal_info.name || ''}
                                    editable={!firestoreData?.personal_info.name}
                                    onChangeText={(value) => handleInputChange('personal_info', 'name', value)}
                                />
                            </View>

                            <View>
                                <Text style={styles.label}>DOB</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="DOB"
                                    placeholderTextColor="#EBC7B1"
                                    value={userData?.personal_info.date_of_birth || ''}
                                    editable={!firestoreData?.personal_info.date_of_birth}
                                    onChangeText={(value) => handleInputChange('personal_info', 'date_of_birth', value)}
                                />
                            </View>

                            <View>
                                <Text style={styles.label}>Weight (Kg)</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Weight"
                                    placeholderTextColor="#EBC7B1"
                                    value={userData?.personal_info.weight || ''}
                                    editable={!firestoreData?.personal_info.weight}
                                    onChangeText={(value) => handleInputChange('personal_info', 'weight', value)}
                                />
                            </View>

                            <View>
                                <Text style={styles.label}>Marital Status</Text>
                                <View style={styles.input}>
                                    <Picker
                                        selectedValue={userData?.personal_info.marital_status}
                                        onValueChange={(itemValue) => {
                                            handleInputChange('personal_info', 'marital_status', itemValue);
                                        }}
                                        style={styles.picker}
                                        enabled={!firestoreData?.personal_info.marital_status}
                                    >
                                        <Picker.Item label="Never Married" value="Never Married" />
                                        <Picker.Item label="Divorced" value="Divorced" />
                                        <Picker.Item label="Widowed" value="Widowed" />
                                    </Picker>
                                </View>
                            </View>

                            <View>
                                <Text style={styles.label}>Gender</Text>
                                <View style={styles.input}>
                                    <Picker
                                        selectedValue={userData?.personal_info.gender}
                                        onValueChange={(itemValue) => {
                                            handleInputChange('personal_info', 'gender', itemValue);
                                        }}
                                        style={styles.picker}
                                        enabled={!firestoreData?.personal_info.gender}
                                    >
                                        <Picker.Item label="Male" value="Male" />
                                        <Picker.Item label="Female" value="Female" />
                                    </Picker>
                                </View>
                            </View>

                            <View>
                                <Text style={styles.label}>Height (Cm)</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Height"
                                    placeholderTextColor="#EBC7B1"
                                    value={userData?.personal_info.height || ''}
                                    editable={!firestoreData?.personal_info.height}
                                    onChangeText={(value) => handleInputChange('personal_info', 'height', value)}
                                />
                            </View>

                            <View>
                                <Text style={styles.label}>Blood Group</Text>
                                <View style={styles.input}>
                                    <Picker
                                        selectedValue={userData?.personal_info.blood_group}
                                        onValueChange={(itemValue) => {
                                            handleInputChange('personal_info', 'blood_group', itemValue);
                                        }}
                                        style={styles.picker}
                                        enabled={!firestoreData?.personal_info.blood_group}
                                    >
                                        <Picker.Item label="A+" value="A+" />
                                        <Picker.Item label="A-" value="A-" />
                                        <Picker.Item label="B+" value="B+" />
                                        <Picker.Item label="B-" value="B-" />
                                        <Picker.Item label="O+" value="O+" />
                                        <Picker.Item label="O-" value="O-" />
                                        <Picker.Item label="AB+" value="AB+" />
                                        <Picker.Item label="AB-" value="AB-" />
                                    </Picker>
                                </View>
                            </View>

                            <View>
                                <Text style={styles.label}>No. of Children</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="No. of Children"
                                    placeholderTextColor="#EBC7B1"
                                    value={userData?.personal_info.num_children || ''}
                                    editable={!firestoreData?.personal_info.num_children}
                                    onChangeText={(value) => handleInputChange('personal_info', 'num_children', value)}
                                />
                            </View>


                        </View>
                    </View>

                    <View>
                        <Text style={styles.subheading}>Contact Information</Text>
                        <View style={styles.subcontainer}>
                            <View style={styles.phonenobody}>
                                <View style={styles.phonecode}>
                                    <TextInput
                                        style={styles.phoneno}
                                        value={userData?.contact_info.selected_code}
                                        editable={!firestoreData?.contact_info.selected_code}
                                    ></TextInput>
                                </View>
                                <View style={styles.phonenomain}>
                                    <TextInput
                                        style={styles.phoneno}
                                        value={userData?.contact_info.phone}
                                        editable={!firestoreData?.contact_info.phone}
                                    ></TextInput>
                                </View>
                            </View>

                            <View>
                                <Text style={styles.label}>Current City</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Current City"
                                    placeholderTextColor="#EBC7B1"
                                    value={userData?.contact_info.current_city || ''}
                                    editable={!firestoreData?.contact_info.current_city}
                                    onChangeText={(value) => handleInputChange('contact_info', 'current_city', value)}
                                />
                            </View>

                            <View>
                                <Text style={styles.label}>City</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="City"
                                    placeholderTextColor="#EBC7B1"
                                    value={userData?.contact_info?.permanent_address?.city !== undefined ? userData?.contact_info?.permanent_address?.city : ""}
                                    editable={!firestoreData?.contact_info?.permanent_address?.city}
                                    onChangeText={(value) => handleInputChange('contact_info', 'city', value, 'permanent_address')}
                                />
                            </View>

                            <View>
                                <Text style={styles.label}>State</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="State"
                                    placeholderTextColor="#EBC7B1"
                                    value={userData?.contact_info?.permanent_address?.state !== undefined ? userData?.contact_info?.permanent_address?.state : ""}
                                    editable={!firestoreData?.contact_info?.permanent_address?.state}
                                    onChangeText={(value) => handleInputChange('contact_info', 'state', value, 'permanent_address')}
                                />
                            </View>

                            <View>
                                <Text style={styles.label}>Country</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Country"
                                    placeholderTextColor="#EBC7B1"
                                    value={userData?.contact_info?.permanent_address?.country !== undefined ? userData?.contact_info?.permanent_address?.country : ""}
                                    editable={!firestoreData?.contact_info?.permanent_address?.country}
                                    onChangeText={(value) => handleInputChange('contact_info', 'country', value, 'permanent_address')}
                                />
                            </View>

                            <View>
                                <Text style={styles.label}>Pincode</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Pincode"
                                    placeholderTextColor="#EBC7B1"
                                    value={userData?.contact_info?.permanent_address?.pincode !== undefined ? userData?.contact_info?.permanent_address?.pincode : ""}
                                    editable={!firestoreData?.contact_info?.permanent_address?.pincode}
                                    onChangeText={(value) => handleInputChange('contact_info', 'pincode', value, 'permanent_address')}
                                />
                            </View>

                            <View>
                                <Text style={styles.label}>Street</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Street"
                                    placeholderTextColor="#EBC7B1"
                                    value={userData?.contact_info?.permanent_address?.street !== undefined ? userData?.contact_info?.permanent_address?.street : ""}
                                    editable={!firestoreData?.contact_info?.permanent_address?.street}
                                    onChangeText={(value) => handleInputChange('contact_info', 'street', value, 'permanent_address')}
                                />
                            </View>
                        </View>
                    </View>

                    <View>
                        <Text style={styles.subheading}>Family Background</Text>
                        <View style={styles.subcontainer}>
                            <View>
                                <Text style={styles.label}>Family Type</Text>
                                <View style={styles.input}>
                                    <Picker
                                        selectedValue={userData?.family_background?.family_type}
                                        onValueChange={(itemValue) => {
                                            handleInputChange('family_background', 'family_type', itemValue);
                                        }}
                                        style={styles.picker}
                                        enabled={!firestoreData?.family_background?.family_type}
                                    >
                                        <Picker.Item label="Joint" value="Joint" />
                                        <Picker.Item label="Nuclear" value="Nuclear" />
                                    </Picker>
                                </View>
                            </View>

                            <View>
                                <Text style={styles.label}>Mother's Name</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Mother's Name"
                                    placeholderTextColor="#EBC7B1"
                                    value={userData?.family_background?.mother_name || ''}
                                    editable={!firestoreData?.family_background?.mother_name}
                                    onChangeText={(value) => handleInputChange('family_background', 'mother_name', value)}
                                />
                            </View>

                            <View>
                                <Text style={styles.label}>Father's Name</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Father's Name"
                                    placeholderTextColor="#EBC7B1"
                                    value={userData?.family_background?.father_name || ''}
                                    editable={!firestoreData?.family_background?.father_name}
                                    onChangeText={(value) => handleInputChange('family_background', 'father_name', value)}
                                />
                            </View>

                            <View>
                                <Text style={styles.label}>No. of Brothers</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="No. of Brothers"
                                    placeholderTextColor="#EBC7B1"
                                    value={userData?.family_background?.num_brothers || ''}
                                    editable={!firestoreData?.family_background?.num_brothers}
                                    onChangeText={(value) => handleInputChange('family_background', 'num_brothers', value)}
                                />
                            </View>

                            <View>
                                <Text style={styles.label}>No. of Sisters</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="No. of Sisters"
                                    placeholderTextColor="#EBC7B1"
                                    value={userData?.family_background?.num_sisters || ''}
                                    editable={!firestoreData?.family_background?.num_sisters}
                                    onChangeText={(value) => handleInputChange('family_background', 'num_sisters', value)}
                                />
                            </View>

                            <View>
                                <Text style={styles.label}>Family Status</Text>
                                <View style={styles.input}>
                                    <Picker
                                        selectedValue={userData?.family_background?.family_status}
                                        onValueChange={(itemValue) => {
                                            handleInputChange('family_background', 'family_status', itemValue);
                                        }}
                                        style={styles.picker}
                                        enabled={!firestoreData?.family_background?.family_status}
                                    >
                                        <Picker.Item label="Middle" value="Middle" />
                                        <Picker.Item label="Upper Middle" value="Upper Middle" />
                                        <Picker.Item label="Rich" value="Rich" />
                                        <Picker.Item label="Affluent" value="Affluent" />
                                    </Picker>
                                </View>
                            </View>

                            <View>
                                <Text style={styles.label}>Family Values</Text>
                                <View style={styles.input}>
                                    <Picker
                                        selectedValue={userData?.family_background?.family_values}
                                        onValueChange={(itemValue) => {
                                            handleInputChange('family_background', 'family_values', itemValue);
                                        }}
                                        style={styles.picker}
                                        enabled={!firestoreData?.family_background?.family_values}
                                    >
                                        <Picker.Item label="Traditional" value="Traditional" />
                                        <Picker.Item label="Moderate" value="Moderate" />
                                        <Picker.Item label="Modern" value="Modern" />
                                    </Picker>
                                </View>
                            </View>

                        </View>
                    </View>

                    <View>
                        <Text style={styles.subheading}>Education & Career</Text>
                        <View style={styles.subcontainer}>
                            <View>
                                <Text style={styles.label}>Highest Education</Text>
                                <View style={styles.input}>
                                    <Picker
                                        selectedValue={userData?.education?.highest_education}
                                        onValueChange={(itemValue) => {
                                            handleInputChange('education', 'highest_education', itemValue);
                                        }}
                                        style={styles.picker}
                                        enabled={!firestoreData?.education?.highest_education}
                                    >
                                        <Picker.Item label="Bachelor's Degree" value="Bachelor's Degree" />
                                        <Picker.Item label="Master's Degree" value="Master's Degree" />
                                        <Picker.Item label="Ph.D" value="Ph.D" />
                                        <Picker.Item label="Diploma" value="Diploma" />
                                    </Picker>
                                </View>
                            </View>

                            <View>
                                <Text style={styles.label}>Field of Study</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Field of Study"
                                    placeholderTextColor="#EBC7B1"
                                    value={userData?.education?.field_of_study || ''}
                                    editable={!firestoreData?.education?.field_of_study}
                                    onChangeText={(value) => handleInputChange('education', 'field_of_study', value)}
                                />
                            </View>

                            <View>
                                <Text style={styles.label}>College/ University</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="College/ University"
                                    placeholderTextColor="#EBC7B1"
                                    value={userData?.education?.college || ''}
                                    editable={!firestoreData?.education?.college}
                                    onChangeText={(value) => handleInputChange('education', 'college', value)}
                                />
                            </View>

                            <View>
                                <Text style={styles.label}>Graduation Year</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Graduation Year"
                                    placeholderTextColor="#EBC7B1"
                                    value={userData?.education?.graduation_year || ''}
                                    editable={!firestoreData?.education?.graduation_year}
                                    onChangeText={(value) => handleInputChange('education', 'graduation_year', value)}
                                />
                            </View>

                            <View>
                                <Text style={styles.label}>Occupation</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Occupation"
                                    placeholderTextColor="#EBC7B1"
                                    value={userData?.professional_details?.occupation || ''}
                                    editable={!firestoreData?.professional_details?.occupation}
                                    onChangeText={(value) => handleInputChange('professional_details', 'occupation', value)}
                                />
                            </View>

                            <View>
                                <Text style={styles.label}>Employer</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Employer"
                                    placeholderTextColor="#EBC7B1"
                                    value={userData?.professional_details?.employer || ''}
                                    editable={!firestoreData?.professional_details?.employer}
                                    onChangeText={(value) => handleInputChange('professional_details', 'employer', value)}
                                />
                            </View>

                            <View>
                                <Text style={styles.label}>Job Location</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Job Location"
                                    placeholderTextColor="#EBC7B1"
                                    value={userData?.professional_details?.job_location || ''}
                                    editable={!firestoreData?.professional_details?.job_location}
                                    onChangeText={(value) => handleInputChange('professional_details', 'job_location', value)}
                                />
                            </View>

                            <View>
                                <Text style={styles.label}>Annual Income</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Annual Income"
                                    placeholderTextColor="#EBC7B1"
                                    value={userData?.professional_details?.annual_income || ''}
                                    editable={!firestoreData?.professional_details?.annual_income}
                                    onChangeText={(value) => handleInputChange('professional_details', 'annual_income', value)}
                                />
                            </View>



                        </View>
                    </View>

                    <View>
                        <Text style={styles.subheading}>Religious & Cultural</Text>
                        <View style={styles.subcontainer}>
                            <View>
                                <Text style={styles.label}>Religion</Text>
                                <View style={styles.input}>
                                    <Picker
                                        selectedValue={userData?.religious_cultural?.religion}
                                        onValueChange={(itemValue) => {
                                            handleInputChange('religious_cultural', 'religion', itemValue);
                                        }}
                                        style={styles.picker}
                                        enabled={!firestoreData?.religious_cultural?.religion}
                                    >
                                        <Picker.Item label="Hindu" value="Hindu" />
                                        <Picker.Item label="Muslim" value="Muslim" />
                                        <Picker.Item label="Christian" value="Christian" />
                                        <Picker.Item label="Sikh" value="Sikh" />
                                        <Picker.Item label="Other" value="Other" />
                                    </Picker>
                                </View>
                            </View>

                            <View>
                                <Text style={styles.label}>Caste</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Caste"
                                    placeholderTextColor="#EBC7B1"
                                    value={userData?.religious_cultural?.caste || ''}
                                    editable={!firestoreData?.religious_cultural?.caste}
                                    onChangeText={(value) => handleInputChange('religious_cultural', 'caste', value)}
                                />
                            </View>

                            <View>
                                <Text style={styles.label}>SubCaste</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="SubCaste"
                                    placeholderTextColor="#EBC7B1"
                                    value={userData?.religious_cultural?.subcaste || ''}
                                    editable={!firestoreData?.religious_cultural?.subcaste}
                                    onChangeText={(value) => handleInputChange('religious_cultural', 'subcaste', value)}
                                />
                            </View>

                            <View>
                                <Text style={styles.label}>Gothra</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Gothra"
                                    placeholderTextColor="#EBC7B1"
                                    value={userData?.religious_cultural?.gothra || ''}
                                    editable={!firestoreData?.religious_cultural?.gothra}
                                    onChangeText={(value) => handleInputChange('religious_cultural', 'gothra', value)}
                                />
                            </View>

                            <View>
                                <Text style={styles.label}>Star/Rashi</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Star/Rashi"
                                    placeholderTextColor="#EBC7B1"
                                    value={userData?.religious_cultural?.star_rashi || ''}
                                    editable={!firestoreData?.religious_cultural?.star_rashi}
                                    onChangeText={(value) => handleInputChange('religious_cultural', 'star_rashi', value)}
                                />
                            </View>

                            <View>
                                <Text style={styles.label}>Manglik Status</Text>
                                <View style={styles.input}>
                                    <Picker
                                        selectedValue={userData?.religious_cultural?.manglik_status}
                                        onValueChange={(itemValue) => {
                                            handleInputChange('religious_cultural', 'manglik_status', itemValue);
                                        }}
                                        style={styles.picker}
                                        enabled={!firestoreData?.religious_cultural?.manglik_status}
                                    >
                                        <Picker.Item label="Manglik" value="Manglik" />
                                        <Picker.Item label="Non-Manglik" value="Non-Manglik" />
                                        <Picker.Item label="Anshik Manglik" value="Anshik Manglik" />
                                    </Picker>
                                </View>
                            </View>





                        </View>
                    </View>

                    <View>
                        <Text style={styles.subheading}>Lifestyle & Preferences</Text>
                        <View style={styles.subcontainer}>
                            <View>
                                <Text style={styles.label}>Drinking Habits</Text>
                                <View style={styles.input}>
                                    <Picker
                                        selectedValue={userData?.lifestyle_preferences?.drinking_habits}
                                        onValueChange={(itemValue) => {
                                            handleInputChange('lifestyle_preferences', 'drinking_habits', itemValue);
                                        }}
                                        style={styles.picker}
                                        enabled={!firestoreData?.lifestyle_preferences?.drinking_habits}
                                    >
                                        <Picker.Item label="Never" value="Never" />
                                        <Picker.Item label="Occasionally" value="Occasionally" />
                                        <Picker.Item label="Regular" value="Regular" />
                                    </Picker>
                                </View>
                            </View>

                            <View>
                                <Text style={styles.label}>Smoking Habits</Text>
                                <View style={styles.input}>
                                    <Picker
                                        selectedValue={userData?.lifestyle_preferences?.smoking_habits}
                                        onValueChange={(itemValue) => {
                                            handleInputChange('lifestyle_preferences', 'smoking_habits', itemValue);
                                        }}
                                        style={styles.picker}
                                        enabled={!firestoreData?.lifestyle_preferences?.smoking_habits}
                                    >
                                        <Picker.Item label="Non-Smoker" value="Non-Smoker" />
                                        <Picker.Item label="Occasionally Smoker" value="Occasionally Smoker" />
                                        <Picker.Item label="Regular Smoker" value="Regular Smoker" />
                                    </Picker>
                                </View>
                            </View>

                            <View>
                                <Text style={styles.label}>Diet Preferences</Text>
                                <View style={styles.input}>
                                    <Picker
                                        selectedValue={userData?.lifestyle_preferences?.diet_preferences}
                                        onValueChange={(itemValue) => {
                                            handleInputChange('lifestyle_preferences', 'diet_preferences', itemValue);
                                        }}
                                        style={styles.picker}
                                        enabled={!firestoreData?.lifestyle_preferences?.diet_preferences}
                                    >
                                        <Picker.Item label="Vegetarian" value="Vegetarian" />
                                        <Picker.Item label="Non-Vegetarian" value="Non-Vegetarian" />
                                        <Picker.Item label="Eggetarian" value="Eggetarian" />
                                    </Picker>
                                </View>
                            </View>

                            <View>
                                <Text style={styles.label}>Hobbies & Interests</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Hobbies & Intrests"
                                    placeholderTextColor="#EBC7B1"
                                    value={userData?.hobbies_interests?.join(', ') || ''}
                                    editable={!firestoreData?.hobbies_interests}
                                    onChangeText={(value) => {
                                        setUserData(prev => ({
                                            ...prev,
                                            hobbies_interests: value.split(',').map(item => item.trim())
                                        }))
                                    }}
                                />
                            </View>
                        </View>
                    </View>

                    <View>
                        <Text style={styles.subheading}>Partner Preferences</Text>
                        <View style={styles.subcontainer}>
                            <View>
                                <Text style={styles.label}>Age Range(Min)</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Age Range(Min)"
                                    placeholderTextColor="#EBC7B1"
                                    value={userData?.matrimonial_expectations?.preferred_age_range?.min ?? ''}
                                    editable={!firestoreData?.matrimonial_expectations?.preferred_age_range?.min}
                                    onChangeText={(value) => handleInputChange('matrimonial_expectations', 'preferred_age_range', value, 'min')}
                                />
                            </View>

                            <View>
                                <Text style={styles.label}>Age Range(Max)</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Age Range(Max)"
                                    placeholderTextColor="#EBC7B1"
                                    value={userData?.matrimonial_expectations?.preferred_age_range?.max != undefined ? userData.matrimonial_expectations.preferred_age_range.max : ''}
                                    editable={!firestoreData?.matrimonial_expectations?.preferred_age_range?.max}
                                    onChangeText={(value) => handleInputChange('matrimonial_expectations', 'preferred_age_range', value, 'max')}
                                />
                            </View>

                            <View>
                                <Text style={styles.label}>Height Range(Min)</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Height Range(Min)"
                                    placeholderTextColor="#EBC7B1"
                                    value={userData?.matrimonial_expectations?.preferred_height_range?.min != undefined ? userData.matrimonial_expectations.preferred_height_range.min : ''}
                                    editable={!firestoreData?.matrimonial_expectations?.preferred_height_range?.min}
                                    onChangeText={(value) => handleInputChange('matrimonial_expectations', 'preferred_height_range', value, 'min')}
                                />
                            </View>

                            <View>
                                <Text style={styles.label}>Height Range(Max)</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Height Range(Max)"
                                    placeholderTextColor="#EBC7B1"
                                    value={userData?.matrimonial_expectations?.preferred_height_range?.max != undefined ? userData.matrimonial_expectations.preferred_height_range.max : ''}
                                    editable={!firestoreData?.matrimonial_expectations?.preferred_height_range?.max}
                                    onChangeText={(value) => handleInputChange('matrimonial_expectations', 'preferred_height_range', value, 'max')}
                                />
                            </View>

                            <View>
                                <Text style={styles.label}>Preferred Location</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Preferred Location"
                                    placeholderTextColor="#EBC7B1"
                                    value={userData?.matrimonial_expectations?.preferred_location != undefined ? userData.matrimonial_expectations.preferred_location : ''}
                                    editable={!firestoreData?.matrimonial_expectations?.preferred_location}
                                    onChangeText={(value) => handleInputChange('matrimonial_expectations', 'preferred_location', value)}
                                />
                            </View>

                            <View>
                                <Text style={styles.label}>Preferred Education</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Preferred Education"
                                    placeholderTextColor="#EBC7B1"
                                    value={userData?.matrimonial_expectations?.preferred_education != undefined ? userData.matrimonial_expectations.preferred_education : ''}
                                    editable={!firestoreData?.matrimonial_expectations?.preferred_education}
                                    onChangeText={(value) => handleInputChange('matrimonial_expectations', 'preferred_education', value)}
                                />
                            </View>

                            <View>
                                <Text style={styles.label}>Preferred Occupation</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Preferred Occupation"
                                    placeholderTextColor="#EBC7B1"
                                    value={userData?.matrimonial_expectations?.preferred_occupation != undefined ? userData.matrimonial_expectations.preferred_occupation : ''}
                                    editable={!firestoreData?.matrimonial_expectations?.preferred_occupation}
                                    onChangeText={(value) => handleInputChange('matrimonial_expectations', 'preferred_occupation', value)}
                                />
                            </View>


                            <View>
                                <Text style={styles.label}>Minimum Annual Income</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Minimum Annual Income"
                                    keyboardType='number-pad'
                                    placeholderTextColor="#EBC7B1"
                                    value={userData?.matrimonial_expectations?.preferred_income != undefined ? userData.matrimonial_expectations.preferred_income : ''}
                                    editable={!firestoreData?.matrimonial_expectations?.preferred_income}
                                    onChangeText={(value) => handleInputChange('matrimonial_expectations', 'preferred_income', value)}
                                />
                            </View>


                            <View>
                                <Text style={styles.label}>Other Preferences</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Other Preferences"
                                    placeholderTextColor="#EBC7B1"
                                    value={userData?.matrimonial_expectations?.other_preferences != undefined ? userData.matrimonial_expectations.other_preferences : ''}
                                    editable={!firestoreData?.matrimonial_expectations?.other_preferences}
                                    onChangeText={(value) => handleInputChange('matrimonial_expectations', 'other_preferences', value)}
                                />
                            </View>
                        </View>
                    </View>

                    <View>
                        <View style={styles.subcontainer}>
                            <View>
                                <Text style={styles.label}>About Me</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="About Me"
                                    placeholderTextColor="#EBC7B1"
                                    keyboardType='number-pad'
                                    value={userData?.about_me || ''}
                                    editable={!firestoreData?.about_me}
                                    onChangeText={(value) => {
                                        setUserData(prev => ({
                                            ...prev,
                                            about_me: value
                                        }))
                                    }}
                                />
                            </View>


                        </View>
                    </View>

                    <TouchableOpacity style={styles.creat} onPress={handleUserUpdate}>
                        <Text style={styles.creattext}>Create Profile</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            <View style={uploading ? styles.loadingContainer : null}>
                {uploading && <ActivityIndicator size="large" color="#a4737b" />}
            </View>
        </SafeAreaView>
    )
}

export default CreateProfile

const styles = StyleSheet.create({
    safearea: {
        flex: 1,
        backgroundColor: 'white',
    },
    main: {
        flexGrow: 1,
    },
    container: {
        backgroundColor: '#f5f5f5',
        flex: 1,
        gap: width / 30,
        paddingLeft: width / 20,
        paddingRight: width / 20,
        paddingBottom: width / 30,
    },
    activityContainer: {
        backgroundColor: '#f5f5f5',
        flex: 1,
        gap: width / 30,
        paddingLeft: width / 20,
        paddingRight: width / 20,
        paddingBottom: width / 30,
    },
    profile: {
        alignItems: 'center',
        padding: 20,
    },
    profiletext: {
        fontSize: 25,
        color: '#792A37',
    },
    label: {
        color: 'black',
    },
    input: {
        borderColor: '#EBC7B1',
        borderWidth: 1,
        borderRadius: 12,
        paddingLeft: width / 40,
        color: '#EBC7B1',
    },
    picker: {
        color: '#EBC7B1',
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
    subheading: {
        fontSize: 18,
        color: '#792A37',
    },
    subcontainer: {
        marginTop: width / 30
    },
    creat: {
        borderRadius: 12,
        backgroundColor: '#a4737b',
        padding: width / 30,
    },
    creattext: {
        color: 'white',
        textAlign: 'center',
    },
    circlebody: {
        display: 'flex',
        alignItems: 'center',
    },
    circle: {
        height: height * 0.25,
        width: width * 0.50,
        borderRadius: 500,
        borderColor: '#782A37',
        borderWidth: 2,
    },
    photoicon: {
        position: 'absolute',
        bottom: 0,
        right: width * 0.05,
        zIndex: 100
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

})