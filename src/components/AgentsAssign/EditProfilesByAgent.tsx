import { ActivityIndicator, Alert, Button, Dimensions, Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '../Header/Header'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import storage from '@react-native-firebase/storage';
import { Picker } from '@react-native-picker/picker'
import { Asset, launchImageLibrary } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import useToastHook from '../../utils/useToastHook'
import useUpdateUserDetails from '../../hooks/useUpdateUserDetails'
import RNPickerSelect from 'react-native-picker-select';
import AgentsHeader from '../Header/AgentsHeader'

const { width, height } = Dimensions.get("window")

const EditProfilesByAgent = ({ navigation, route }) => {
    const [uploading, setUploading] = useState(false);
    const [userId, setUserId] = useState();
    const [userData, setUserData] = useState<any>();
    const [firestoreData, setFirestoreData] = useState<any>();
    const { successToast, errorToast } = useToastHook();

    const getUserCurrentDetails = async () => {
        if (userId) {
            try {
                const userRef = firestore().collection('profiles').doc(userId);
                const userDoc = await userRef.get();

                if (userDoc.exists) {
                    setUserData(userDoc.data());
                    setFirestoreData(userDoc.data());
                } else {
                }
            } catch (error) {
            }
        }
    }

    useEffect(() => {
        setUserId(route.params.id)
    }, []);

    useEffect(() => {
        getUserCurrentDetails();
    }, [])

    console.log(userId)

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

    const handleUploadImages = async (imageUris) => {
        setUploading(true)

        try {
            const uploadedImageUrls: string[] = [];

            for (let i = 0; i < imageUris.length; i++) {
                console.log(imageUris[i]);
                const fileName = imageUris[i].split('/').pop();
                const uniqueFileName = `${Date.now()}_${fileName}`;

                const reference = storage().ref(`profile-images/${uniqueFileName}`);

                const task = reference.putFile(imageUris[i]);

                task.on('state_changed', (snapshot) => {
                    const uploadProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                }, (error) => {
                    console.log(error)
                }, async () => {
                    const downloadUrl = await reference.getDownloadURL();
                    uploadedImageUrls.push(downloadUrl);
                });

                await task;
            }

            const userRef = firestore().collection('profiles').doc(userId);

            const updatedData = {
                ...userData,
                images: uploadedImageUrls,
                updatedAt: firestore.FieldValue.serverTimestamp()
            }

            await userRef.update(updatedData);

            getUserCurrentDetails();
            successToast("Updated");
        } catch (error) {
            errorToast('Something Went Wrong')
        }
        setUploading(false);
    }

    const handleUploadProfileImage = async (imageUri) => {
        if (!imageUri) return;

        setUploading(true);

        try {
            console.log("Uploading image:", imageUri);

            const fileName = imageUri.split('/').pop();
            const uniqueFileName = `${Date.now()}_${fileName}`;
            const reference = storage().ref(`profile-images/${uniqueFileName}`);

            await reference.putFile(imageUri);
            const downloadUrl = await reference.getDownloadURL();

            const userRef = firestore().collection('profiles').doc(userId);

            const updatedData = {
                ...userData,
                contactInformation: {
                    ...userData.contactInformation,
                    profilePicture: downloadUrl,
                },
                updatedAt: firestore.FieldValue.serverTimestamp(),
            };

            await userRef.update(updatedData);
            getUserCurrentDetails();

            successToast("Profile picture updated");
        } catch (error) {
            console.error("Upload failed:", error);
            errorToast("Something Went Wrong");
        }

        setUploading(false);
    }

    const changeProfileImage = () => {
        const options = {
            mediaType: 'photo',
            includeBase64: false,
        };

        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
            } else if (response.error) {
            } else {
                let imageUri = response.uri || response.assets?.[0]?.uri;
                console.log(imageUri, 'imageuri')
                handleUploadProfileImage(imageUri);
            }
        });
    };

    const addImages = () => {
        const options = {
            mediaType: 'photo',
            includeBase64: false,
            selectionLimit: 4
        };

        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
            } else if (response.errorCode) {
                console.log(response.errorCode)
            } else {
                let selectedImages = response.assets || [];
                selectedImages = response.assets.map((asset) => asset.uri);
                handleUploadImages(selectedImages);
            }
        });
    };

    const deleteProfileImage = async () => {
        setUploading(true);

        try {
            const userRef = firestore().collection('profiles').doc(userId);

            const updatedData = {
                ...userData,
                contactInformation: {
                    ...userData.contactInformation,
                    profilePicture: '',
                },
                images: [],
                updatedAt: firestore.FieldValue.serverTimestamp(),
            };

            await userRef.update(updatedData);
            getUserCurrentDetails();

            successToast("Images Deleted");
        } catch (error) {
            console.error("Upload failed:", error);
            errorToast("Something Went Wrong");
        }

        setUploading(false);
    }

    const handleUserUpdate = async () => {
        setUploading(true);

        try {
            const userRef = firestore().collection('profiles').doc(userId);

            const updatedData = {
                ...userData,
                updatedAt: firestore.FieldValue.serverTimestamp(),
            };

            await userRef.update(updatedData);
            getUserCurrentDetails();

            successToast("Data Updated.");
        } catch (error) {
            console.error("Upload failed:", error);
            errorToast("Something Went Wrong");
        }

        setUploading(false);
    }

    return (
        <SafeAreaView style={styles.safearea}>
            <ScrollView style={styles.main}>
                <AgentsHeader navigation={navigation} />
                <View style={styles.container}>
                    <View style={styles.profile}>
                        <Text style={styles.profiletext}>EDIT PROFILE</Text>
                    </View>

                    <View>
                        <Text style={styles.subheading}>Personal Information</Text>
                        <View style={styles.subcontainer}>
                            <TouchableOpacity style={styles.circlebody} onPress={changeProfileImage}>
                                <View style={styles.circle}>
                                    {
                                        firestoreData?.contactInformation?.profilePicture ?
                                            (
                                                <Image source={{ uri: firestoreData?.contactInformation?.profilePicture }}
                                                    style={{ height: '100%', resizeMode: 'cover', width: '100%', aspectRatio: 1, borderRadius: 500 }} />
                                            ) :
                                            (
                                                <View style={styles.emptyview} />
                                            )
                                    }
                                    <Icon name="add-circle" size={40} color="#e4bd9e" style={styles.photoicon} />
                                </View>
                            </TouchableOpacity>

                            <View style={styles.imagecontrols}>
                                <View style={styles.addimagebox}>
                                    <TouchableOpacity style={styles.addimagecontainer} onPress={addImages}>
                                        <MIcon name="add-photo-alternate" size={24} color="#7b2a38" />
                                        <Text style={styles.addimagetext}>Add your Images</Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.deleteimagebox}>
                                    <TouchableOpacity style={styles.deleteimagecontainer} onPress={() => deleteProfileImage()}>
                                        <MIcon name="delete" size={24} color="#7b2a38" />
                                        <Text style={styles.deleteimage}>Delete image</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View>
                                <Text style={styles.label}>First Name</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Full Name"
                                    placeholderTextColor="#EBC7B1"
                                    value={userData?.personalInformation.firstName || ''}
                                    editable={!firestoreData?.personalInformation.firstName}
                                    onChangeText={(value) => handleInputChange('personalInformation', 'firstName', value)}
                                />
                            </View>

                            <View>
                                <Text style={styles.label}>Last Name</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Full Name"
                                    placeholderTextColor="#EBC7B1"
                                    value={userData?.personalInformation.lastName || ''}
                                    editable={!firestoreData?.personalInformation.lastName}
                                    onChangeText={(value) => handleInputChange('personalInformation', 'lastName', value)}
                                />
                            </View>

                            <View>
                                <Text style={styles.label}>Date of Birth</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Date of Birth"
                                    placeholderTextColor="#EBC7B1"
                                    value={userData?.personalInformation.dateOfBirth || ''}
                                    editable={!firestoreData?.personalInformation.dateOfBirth}
                                    onChangeText={(value) => handleInputChange('personalInformation', 'dateOfBirth', value)}
                                />
                            </View>

                            <View>
                                <Text style={styles.label}>Height (Ft)</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Height"
                                    placeholderTextColor="#EBC7B1"
                                    value={userData?.personalInformation.height || ''}
                                    editable={!firestoreData?.personalInformation.height}
                                    onChangeText={(value) => handleInputChange('personalInformation', 'height', value)}
                                />
                            </View>

                            <View>
                                <Text style={styles.label}>Location</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Location"
                                    placeholderTextColor="#EBC7B1"
                                    value={userData?.personalInformation.location || ''}
                                    editable={!firestoreData?.personalInformation.location}
                                    onChangeText={(value) => handleInputChange('personalInformation', 'location', value)}
                                />
                            </View>

                            <View>
                                <Text style={styles.label}>Mother Tongue</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Mother Tongue"
                                    placeholderTextColor="#EBC7B1"
                                    value={userData?.personalInformation.motherTongue || ''}
                                    editable={!firestoreData?.personalInformation.motherTongue}
                                    onChangeText={(value) => handleInputChange('personalInformation', 'motherTongue', value)}
                                />
                            </View>

                            <View>
                                <Text style={styles.label}>Gender</Text>
                                <View style={styles.input}>
                                    <RNPickerSelect
                                        onValueChange={(itemValue) => {
                                            handleInputChange('personalInformation', 'gender', itemValue);
                                        }}

                                        useNativeAndroidPickerStyle={false}
                                        placeholder={{
                                            label: 'Select your gender',
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
                                            { label: 'Male', value: 'Male', color: 'white' },
                                            { label: 'Female', value: 'Female', color: 'white' },

                                        ]}
                                        value={userData?.personalInformation?.gender}
                                        disabled={!!firestoreData?.personalInformation?.gender}
                                    />
                                </View>
                            </View>

                            <View>
                                <Text style={styles.label}>Height (Cm)</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Height"
                                    placeholderTextColor="#EBC7B1"
                                    value={userData?.personalInformation.height || ''}
                                    editable={!firestoreData?.personalInformation.height}
                                    onChangeText={(value) => handleInputChange('personalInformation', 'height', value)}
                                />
                            </View>
                        </View>
                    </View>

                    <View>
                        <Text style={styles.subheading}>Contact Information</Text>
                        <View style={styles.subcontainer}>
                            <View style={styles.phonenobody}>
                                <View style={styles.phonenomain}>
                                    <TextInput
                                        style={styles.phoneno}
                                        value={userData?.contactInformation.phone}
                                        editable={!firestoreData?.contactInformation.phone}
                                    ></TextInput>
                                </View>
                            </View>

                            <View>
                                <Text style={styles.label}>Email</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Email"
                                    placeholderTextColor="#EBC7B1"
                                    value={userData?.contactInformation.email ?? ""}
                                    editable={!firestoreData?.contactInformation?.email}
                                    onChangeText={(value) => handleInputChange('contactInformation', 'email', value)}
                                />
                            </View>

                            <View>
                                <Text style={styles.label}>Aadhar Number</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Aadhar Number"
                                    placeholderTextColor="#EBC7B1"
                                    value={userData?.contactInformation.aadharNumber ?? ""}
                                    editable={!firestoreData?.contactInformation?.aadharNumber}
                                    onChangeText={(value) => handleInputChange('contactInformation', 'aadharNumber', value)}
                                />
                            </View>

                            <View>
                                <Text style={styles.label}>KYC Details</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="KYC Details"
                                    placeholderTextColor="#EBC7B1"
                                    value={userData?.contactInformation.kycDetails ?? ""}
                                    editable={!firestoreData?.contactInformation?.kycDetails}
                                    onChangeText={(value) => handleInputChange('contactInformation', 'kycDetails', value)}
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
                                    <RNPickerSelect
                                        onValueChange={(itemValue) => {
                                            handleInputChange('familyInformation', 'familyType', itemValue);
                                        }}
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
                                        value={userData?.familyInformation?.familyType}
                                        disabled={!!firestoreData?.familyInformation?.familyType}
                                    />
                                </View>
                            </View>

                            <View>
                                <Text style={styles.label}>Father's Name</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Father's Name"
                                    placeholderTextColor="#EBC7B1"
                                    value={userData?.familyInformation?.fatherName || ''}
                                    editable={!firestoreData?.familyInformation?.fatherName}
                                    onChangeText={(value) => handleInputChange('familyInformation', 'fatherName', value)}
                                />
                            </View>

                            <View>
                                <Text style={styles.label}>Father's Occupation</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Father's Occupation"
                                    placeholderTextColor="#EBC7B1"
                                    value={userData?.familyInformation?.fatherOccupation || ''}
                                    editable={!firestoreData?.familyInformation?.fatherOccupation}
                                    onChangeText={(value) => handleInputChange('familyInformation', 'fatherOccupation', value)}
                                />
                            </View>

                            <View>
                                <Text style={styles.label}>No. of Siblings</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="No. of Siblings"
                                    placeholderTextColor="#EBC7B1"
                                    value={userData?.familyInformation?.numberOfSiblings || ''}
                                    editable={!firestoreData?.familyInformation?.numberOfSiblings}
                                    onChangeText={(value) => handleInputChange('familyInformation', 'numberOfSiblings', value)}
                                />
                            </View>

                            <View>
                                <Text style={styles.label}>Native Place</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Native Place"
                                    placeholderTextColor="#EBC7B1"
                                    value={userData?.familyInformation?.nativePlace || ''}
                                    editable={!firestoreData?.familyInformation?.nativePlace}
                                    onChangeText={(value) => handleInputChange('familyInformation', 'nativePlace', value)}
                                />
                            </View>

                            <View>
                                <Text style={styles.label}>About Family</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="About Family"
                                    placeholderTextColor="#EBC7B1"
                                    value={userData?.familyInformation?.aboutFamily || ''}
                                    editable={!firestoreData?.familyInformation?.aboutFamily}
                                    onChangeText={(value) => handleInputChange('familyInformation', 'aboutFamily', value)}
                                />
                            </View>

                        </View>
                    </View>

                    <View>
                        <Text style={styles.subheading}>Education & Career</Text>
                        <View style={styles.subcontainer}>
                            <View>
                                <Text style={styles.label}>Highest Education</Text>
                                <View style={styles.input}>
                                    <RNPickerSelect
                                        onValueChange={(itemValue) => {
                                            handleInputChange('educationAndCareer', 'highestQualification', itemValue);
                                        }}
                                        useNativeAndroidPickerStyle={false}
                                        placeholder={{
                                            label: 'Select highest education',
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
                                            { label: "Bachelor's Degree", value: "Bachelor's Degree", color: 'white' },
                                            { label: "Master's Degree", value: "Master's Degree", color: 'white' },
                                            { label: 'Ph.D', value: 'Ph.D', color: 'white' },
                                            { label: 'Diploma', value: 'Diploma', color: 'white' },
                                        ]}
                                        value={userData?.educationAndCareer?.highestQualification}
                                        disabled={!!firestoreData?.educationAndCareer?.highestQualification}
                                    />
                                </View>
                            </View>

                            <View>
                                <Text style={styles.label}>Occupation</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Occupation"
                                    placeholderTextColor="#EBC7B1"
                                    value={userData?.educationAndCareer?.occupation || ''}
                                    editable={!firestoreData?.educationAndCareer?.occupation}
                                    onChangeText={(value) => handleInputChange('educationAndCareer', 'occupation', value)}
                                />
                            </View>

                            <View>
                                <Text style={styles.label}>Job Location</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Job Location"
                                    placeholderTextColor="#EBC7B1"
                                    value={userData?.educationAndCareer?.workingPlace || ''}
                                    editable={!firestoreData?.educationAndCareer?.workingPlace}
                                    onChangeText={(value) => handleInputChange('educationAndCareer', 'workingPlace', value)}
                                />
                            </View>

                            <View>
                                <Text style={styles.label}>Annual Income</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Annual Income"
                                    placeholderTextColor="#EBC7B1"
                                    value={userData?.educationAndCareer?.annualIncome || ''}
                                    editable={!firestoreData?.educationAndCareer?.annualIncome}
                                    onChangeText={(value) => handleInputChange('educationAndCareer', 'annualIncome', value)}
                                />
                            </View>
                        </View>
                    </View>

                    <View>
                        <Text style={styles.subheading}>Lifestyle & Preferences</Text>
                        <View style={styles.subcontainer}>
                            <View>
                                <Text style={styles.label}>Marital Status</Text>
                                <View style={styles.input}>
                                    <RNPickerSelect
                                        onValueChange={(itemValue) => {
                                            handleInputChange('lifestyleAndInterests', 'maritalStatus', itemValue);
                                        }}

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
                                        value={userData?.lifestyleAndInterests?.maritalStatus}
                                        disabled={!!firestoreData?.lifestyleAndInterests?.maritalStatus}
                                    />
                                </View>
                            </View>

                            <View>
                                <Text style={styles.label}>Drinking Habits</Text>
                                <View style={styles.input}>
                                    <RNPickerSelect
                                        onValueChange={(itemValue) => {
                                            handleInputChange('lifestyleAndInterests', 'drinkingHabits', itemValue);
                                        }}
                                        useNativeAndroidPickerStyle={false}
                                        placeholder={{
                                            label: 'Select drinking habits',
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
                                            { label: 'Never', value: 'Never', color: 'white' },
                                            { label: 'Occasionally', value: 'Occasionally', color: 'white' },
                                            { label: 'Regular', value: 'Regular', color: 'white' },
                                        ]}
                                        value={userData?.lifestyleAndInterests?.drinkingHabits}
                                        disabled={!!firestoreData?.lifestyleAndInterests?.drinkingHabits}
                                    />

                                </View>
                            </View>

                            <View>
                                <Text style={styles.label}>Hobbies & Interests</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Hobbies & Intrests"
                                    placeholderTextColor="#EBC7B1"
                                    value={userData?.lifestyleAndInterests.interests?.join(', ') || ''}
                                    editable={!firestoreData?.lifestyleAndInterests.interests}
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
                                <Text style={styles.label}>Age Range</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Age Range"
                                    placeholderTextColor="#EBC7B1"
                                    value={userData?.partnerPreferences?.ageRange ?? ''}
                                    editable={!firestoreData?.partnerPreferences?.ageRange}
                                    onChangeText={(value) => handleInputChange('partnerPreferences', 'ageRange', value)}
                                />
                            </View>

                            <View>
                                <Text style={styles.label}>Height Range</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Age Range"
                                    placeholderTextColor="#EBC7B1"
                                    value={userData?.partnerPreferences?.heightRange ?? ''}
                                    editable={!firestoreData?.partnerPreferences?.heightRange}
                                    onChangeText={(value) => handleInputChange('partnerPreferences', 'heightRange', value)}
                                />
                            </View>

                            <View>
                                <Text style={styles.label}>Preferred City</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Preferred City"
                                    placeholderTextColor="#EBC7B1"
                                    value={userData?.partnerPreferences?.preferredCity ?? ''}
                                    editable={!firestoreData?.partnerPreferences?.preferredCity}
                                    onChangeText={(value) => handleInputChange('partnerPreferences', 'preferredCity', value)}
                                />
                            </View>

                            <View>
                                <Text style={styles.label}>About Preferences</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="bout Preferences"
                                    placeholderTextColor="#EBC7B1"
                                    value={userData?.partnerPreferences?.aboutPreferences ?? ''}
                                    editable={!firestoreData?.partnerPreferences?.aboutPreferences}
                                    onChangeText={(value) => handleInputChange('partnerPreferences', 'aboutPreferences', value)}
                                />
                            </View>

                            <View>
                                <Text style={styles.label}>Religion</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Religion"
                                    placeholderTextColor="#EBC7B1"
                                    value={userData?.partnerPreferences.religion?.join(', ') || ''}
                                    editable={!firestoreData?.partnerPreferences.religion}
                                    onChangeText={(value) => {
                                        setUserData(prev => ({
                                            ...prev,
                                            partnerPreferences: {
                                                ...prev.partnerPreferences,
                                                religion: value.split(',').map(item => item.trim()) // Save as an array
                                            }
                                        }));
                                    }}
                                />
                            </View>
                        </View>
                    </View>

                    <TouchableOpacity style={styles.creat} onPress={() => handleUserUpdate()}>
                        <Text style={styles.creattext}>Update Profile</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            <View style={uploading ? styles.loadingContainer : null}>
                {uploading && <ActivityIndicator size="large" color="#a4737b" />}
            </View>
        </SafeAreaView>
    )
}

export default EditProfilesByAgent

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
        fontWeight: 'bold',
        color: '#792A38',
    },
    label: {
        color: '#591724',
        fontWeight: 'bold'
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
        fontSize: 19,
        color: '#792A38',
        fontWeight: 'bold'
    },
    subcontainer: {
        marginTop: width / 30,
        display: 'flex',
        gap: width / 30
    },
    imagecontrols: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    addimagebox: {
        display: 'flex',
        alignItems: 'flex-start',
    },

    addimagecontainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },

    addimagetext: {
        color: '#7b2a38',
        fontWeight: 'bold'
    },

    deleteimagebox: {
        display: 'flex',
        alignItems: 'flex-end',
    },

    deleteimagecontainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },

    deleteimage: {
        color: '#7b2a38',
        fontWeight: 'bold'
    },
    creat: {
        borderRadius: 12,
        backgroundColor: '#7b2a38',
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
        aspectRatio: 1,
        borderWidth: 2,
        display: 'flex',
        alignItems: 'center',
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
    emptyview: {
        height: height * 0.25,
        width: width * 0.50,
        borderRadius: 500,
    },
    pickerText: {
        fontSize: 16,
        color: '#EBC7B1',
    },
    placeholderText: {
        fontSize: 16,
        color: '#EBC7B1',
    },

})