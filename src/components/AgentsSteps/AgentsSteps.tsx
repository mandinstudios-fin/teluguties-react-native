import { ActivityIndicator, Alert, Dimensions, Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/Entypo';
import { Asset, launchImageLibrary } from 'react-native-image-picker';
import useToastHook from '../../utils/useToastHook';
import storage from '@react-native-firebase/storage';
import useAgent from '../../hooks/useAgent';
import { isValidAadhaar } from "aadhaar-validator-ts";
import Loader from '../Loader/Loader';

const { width, height } = Dimensions.get('window');

const AgentsSteps = ({ navigation }) => {
    const currentUser = auth().currentUser;

    const [agentFormData, setAgentFormData] = useState({
        fullname: '',
        state: '',
        district: '',
        aadharnumber: '',
        selectedcode: '',
        phonenumber: '',
        mailid: '',
        profilepic: '',
        date_of_birth: '',
    });

    const [uploading, setUploading] = useState();
    const { successToast, errorToast } = useToastHook();
    const { getAgentsDetails } = useAgent();

    useEffect(() => {
        getAgentsDetails(setAgentFormData);
    }, [])

    const handleChange = (name, value) => {
        setAgentFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        if (!currentUser?.uid) {
            Alert.alert('Error', 'User ID not found');
            return;
        }

        if(!agentFormData.aadharnumber) {
            errorToast("Enter Aadhar Number");
            return;
        }

        if (!isValidAadhaar(agentFormData.aadharnumber)) {
            errorToast("Invalid Aadhar Number...");
            return;
        }

        setUploading(true);

        try {
            await firestore().collection('agents').doc(currentUser.uid).set({
                ...agentFormData,
            });
            successToast("Data Updated");
            navigation.replace("AgentsSuccess")

        } catch (error) {
            errorToast('Try again');
        }

        setUploading(false);
    };

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
            const reference = storage().ref(`agent-profile-images/${uniqueFileName}`);
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

            setAgentFormData(prevData => ({
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
        <SafeAreaView style={styles.safearea}>
            <ScrollView contentContainerStyle={styles.scrollview}>
                <View style={styles.main}>
                    <View style={styles.logo}>
                        <Image style={styles.image} source={require('../../assets/logo.png')} />
                    </View>
                    <View>
                        <Text style={styles.kyctext}>
                            Agent Kyc
                        </Text>
                    </View>
                    <View style={styles.textinputcontainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Full Name"
                            placeholderTextColor="#EBC7B1"
                            value={agentFormData.fullname}
                            onChangeText={value => handleChange('fullname', value)}
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="DOB"
                            placeholderTextColor="#EBC7B1"
                            value={agentFormData.date_of_birth}
                            editable={false}
                            onChangeText={value => handleChange('date_of_birth', value)}
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="State"
                            placeholderTextColor="#EBC7B1"
                            value={agentFormData.state}
                            onChangeText={value => handleChange('state', value)}
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="District"
                            placeholderTextColor="#EBC7B1"
                            value={agentFormData.district}
                            onChangeText={value => handleChange('district', value)}
                        />

                        <TextInput
                            style={styles.input}
                            maxLength={12}
                            placeholder="Aadhar Number"
                            placeholderTextColor="#EBC7B1"
                            keyboardType="numeric"
                            value={agentFormData.aadharnumber}
                            onChangeText={value => handleChange('aadharnumber', value)}
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="Phone Number"
                            placeholderTextColor="#EBC7B1"
                            keyboardType="phone-pad"
                            value={agentFormData.phonenumber}
                            editable={false}
                            onChangeText={value => handleChange('phonenumber', value)}
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="Email ID"
                            placeholderTextColor="#EBC7B1"
                            keyboardType="email-address"
                            value={agentFormData.mailid}
                            onChangeText={value => handleChange('mailid', value)}
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

                        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                            <Text style={styles.buttonText}>Submit</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={uploading ? styles.loadingContainer : null}>
                    {uploading && <Loader/>}
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default AgentsSteps

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
        fontWeight: '500',
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
        fontSize: 16,
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
})