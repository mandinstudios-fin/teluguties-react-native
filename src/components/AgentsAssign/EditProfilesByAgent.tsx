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

const { width, height } = Dimensions.get("window")

const EditProfilesByAgent = ({ navigation, route }) => {
    const [uploading, setUploading] = useState(false);
    const [userId, setUserId] = useState();
    const [userData, setUserData] = useState<any>();
    const [firestoreData, setFirestoreData] = useState<any>();
    const { successToast, errorToast } = useToastHook();

    const getUserCurrentDetails = async () => {
        if(userId) {
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
    }, [userId])

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

            const userRef = firestore().collection('profiles').doc(userData?.id);

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
    
            const userRef = firestore().collection('profiles').doc(userData?.id);
    
            const updatedData = {
                ...userData,
                profile_pic: downloadUrl,  // Assuming it's a profile picture
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
            const userRef = firestore().collection('profiles').doc(userData?.id);
    
            const updatedData = {
                ...userData,
                profile_pic: '', 
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
            const userRef = firestore().collection('profiles').doc(userData?.id);
    
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
                <Header navigation={navigation} />
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
                                        firestoreData?.profile_pic ?
                                            (
                                                <Image source={{ uri: firestoreData?.profile_pic }}
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
                                    <RNPickerSelect
                                        onValueChange={(itemValue) => {
                                            handleInputChange('personal_info', 'marital_status', itemValue);
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
                                    />
                                </View>
                            </View>

                            <View>
                                <Text style={styles.label}>Gender</Text>
                                <View style={styles.input}>
                                    <RNPickerSelect
                                        onValueChange={(itemValue) => {
                                            handleInputChange('personal_info', 'gender', itemValue);
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
                                    />
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
                                    <RNPickerSelect
                                        onValueChange={(itemValue) => {
                                            handleInputChange('personal_info', 'blood_group', itemValue);
                                        }}
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
                                        value={userData?.personal_info.blood_group}
                                        disabled={!!firestoreData?.personal_info.blood_group}
                                    />
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
                                    <RNPickerSelect
                                        onValueChange={(itemValue) => {
                                            handleInputChange('family_background', 'family_type', itemValue);
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
                                        value={userData?.family_background?.family_type}
                                        disabled={!!firestoreData?.family_background?.family_type}
                                    />
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
                                    <RNPickerSelect
                                        onValueChange={(itemValue) => {
                                            handleInputChange('family_background', 'family_status', itemValue);
                                        }}
                                        useNativeAndroidPickerStyle={false}
                                        placeholder={{
                                            label: 'Select family status',
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
                                        value={userData?.family_background?.family_status}
                                        disabled={!!firestoreData?.family_background?.family_status}
                                    />

                                </View>
                            </View>

                            <View>
                                <Text style={styles.label}>Family Values</Text>
                                <View style={styles.input}>
                                    <RNPickerSelect
                                        onValueChange={(itemValue) => {
                                            handleInputChange('family_background', 'family_values', itemValue);
                                        }}
                                        useNativeAndroidPickerStyle={false}
                                        placeholder={{
                                            label: 'Select family values',
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
                                        value={userData?.family_background?.family_values}
                                        disabled={!!firestoreData?.family_background?.family_values}
                                    />
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
                                    <RNPickerSelect
                                        onValueChange={(itemValue) => {
                                            handleInputChange('education', 'highest_education', itemValue);
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
                                        value={userData?.education?.highest_education}
                                        disabled={!!firestoreData?.education?.highest_education}
                                    />

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
                                    <RNPickerSelect
                                        onValueChange={(itemValue) => {
                                            handleInputChange('religious_cultural', 'religion', itemValue);
                                        }}
                                        useNativeAndroidPickerStyle={false}
                                        placeholder={{
                                            label: 'Select religion',
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
                                        value={userData?.religious_cultural?.religion}
                                        disabled={!!firestoreData?.religious_cultural?.religion}
                                    />

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
                                    <RNPickerSelect
                                        onValueChange={(itemValue) => {
                                            handleInputChange('religious_cultural', 'manglik_status', itemValue);
                                        }}
                                        useNativeAndroidPickerStyle={false}
                                        placeholder={{
                                            label: 'Select Manglik status',
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
                                        value={userData?.religious_cultural?.manglik_status}
                                        disabled={!!firestoreData?.religious_cultural?.manglik_status}
                                    />

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
                                    <RNPickerSelect
                                        onValueChange={(itemValue) => {
                                            handleInputChange('lifestyle_preferences', 'drinking_habits', itemValue);
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
                                        value={userData?.lifestyle_preferences?.drinking_habits}
                                        disabled={!!firestoreData?.lifestyle_preferences?.drinking_habits}
                                    />

                                </View>
                            </View>

                            <View>
                                <Text style={styles.label}>Smoking Habits</Text>
                                <View style={styles.input}>
                                    <RNPickerSelect
                                        onValueChange={(itemValue) => {
                                            handleInputChange('lifestyle_preferences', 'smoking_habits', itemValue);
                                        }}
                                        useNativeAndroidPickerStyle={false}
                                        placeholder={{
                                            label: 'Select smoking habits',
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
                                            { label: 'Non-Smoker', value: 'Non-Smoker', color: 'white' },
                                            { label: 'Occasionally Smoker', value: 'Occasionally Smoker', color: 'white' },
                                            { label: 'Regular Smoker', value: 'Regular Smoker', color: 'white' },
                                        ]}
                                        value={userData?.lifestyle_preferences?.smoking_habits}
                                        disabled={!!firestoreData?.lifestyle_preferences?.smoking_habits}
                                    />

                                </View>
                            </View>

                            <View>
                                <Text style={styles.label}>Diet Preferences</Text>
                                <View style={styles.input}>
                                    <RNPickerSelect
                                        onValueChange={(itemValue) => {
                                            handleInputChange('lifestyle_preferences', 'diet_preferences', itemValue);
                                        }}
                                        useNativeAndroidPickerStyle={false}
                                        placeholder={{
                                            label: 'Select diet preference',
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
                                            { label: 'Vegetarian', value: 'Vegetarian', color: 'white' },
                                            { label: 'Non-Vegetarian', value: 'Non-Vegetarian', color: 'white' },
                                            { label: 'Eggetarian', value: 'Eggetarian', color: 'white' },
                                        ]}
                                        value={userData?.lifestyle_preferences?.diet_preferences}
                                        disabled={!!firestoreData?.lifestyle_preferences?.diet_preferences}
                                    />

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