import {
    ActivityIndicator,
    Alert,
    Dimensions,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import useToastHook from '../../utils/useToastHook';
import { ChevronLeft } from 'lucide-react-native';
import Loader from '../Loader/Loader';

const { width, height } = Dimensions.get('window');

const ProfileDetails: React.FC = ({ navigation }) => {
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState<any>();
    const [firestoreData, setfirestoreData] = useState<any>();
    const { successToast, errorToast } = useToastHook();

    const nameRef = useRef(null);
    const dobRef = useRef(null);
    const emailRef = useRef(null);

    const checkEmail = (email: string) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    }

    const getCurrentUserDetails = async () => {
        const currentUser = auth().currentUser;

        if (currentUser) {
            try {
                const userDoc = await firestore().collection('profiles').doc(currentUser.uid).get();

                if (userDoc.exists) {
                    const userFirestoreData = userDoc.data();
                    setUserData(userFirestoreData);
                    setfirestoreData(userFirestoreData);
                } else {
                }
            } catch (error) {
            }
        } else {
        }
    }

    useEffect(() => {
        getCurrentUserDetails();
    }, []);

    const clearRefs = () => {
        nameRef?.current?.blur();
        dobRef?.current?.blur();
        emailRef?.current?.blur();
    }

    const checkEmailValidation = async (email: string) => {
        const querySnapshot = await firestore().collection('profiles').where('contactInformation.email', '==', email)

        if (querySnapshot.empty) {
            return true;
        }

        return false;
    }

    const handleUserUpdate = async () => {
        const currentUser = auth().currentUser;

        if (!firestoreData?.contactInformation?.email && userData?.contactInformation?.email) {
            if (!checkEmailValidation(userData?.contactInformation?.email) && !checkEmail(userData?.contactInformation?.email)) {
                Alert.alert("Email already exists or Invalid Email");
                return;
            }
        }

        const updatedData = {
            ...userData,
            updatedAt: firestore.FieldValue.serverTimestamp()
        }

        setLoading(true);

        if (currentUser) {
            try {
                await firestore()
                    .collection('profiles')
                    .doc(currentUser.uid)
                    .update(updatedData);

                successToast('Your profile has been updated.');
                getCurrentUserDetails();
                clearRefs();

            } catch (error) {
                errorToast('There was an issue updating your profile.');
            }
        }
        setLoading(false);
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

    return (
        <SafeAreaView style={styles.safearea}>
            <ScrollView contentContainerStyle={styles.scrollview}>
            <View style={styles.main}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                    <ChevronLeft size={27} strokeWidth={1} color={'white'} />
                    </TouchableOpacity>
                    <View style={styles.headertext}>
                        <Text style={styles.headertextmain}>Profile</Text>
                    </View>
                </View>
                <View style={styles.logo}>
                    <Image
                        style={styles.image}
                        source={require('../../assets/logo.png')}
                    />
                </View>

                <View style={styles.formcontainer}>
                    <View style={styles.container}>
                        <View style={styles.profile}>
                            <Text style={styles.profiletext}>Profile Details</Text>
                        </View>
                        <View style={styles.formbody}>
                            <View>
                                <TextInput
                                    style={styles.input}
                                    placeholder={userData?.personalInformation?.firstName ?? "First Name"}
                                    placeholderTextColor="#EBC7B1"
                                    value={userData?.personalInformation?.firstName ?? ""}
                                    onChangeText={(value) => handleInputChange('personalInformation', 'fullName', value)}
                                    editable={!firestoreData?.personalInformation?.firstName}
                                    ref={nameRef}
                                />
                            </View>
                            <View>
                            <TextInput
                                    style={styles.input}
                                    placeholder={userData?.personalInformation?.lastName ?? "Last Name"}
                                    placeholderTextColor="#EBC7B1"
                                    value={userData?.personalInformation?.lastName ?? ""}
                                    onChangeText={(value) => handleInputChange('personalInformation', 'lastName', value)}
                                    editable={!firestoreData?.personalInformation?.lastName}
                                    ref={nameRef}
                                />
                            </View>
                            <View>
                                <TextInput
                                    placeholder={userData?.personalInformation?.dateOfBirth ?? "DOB"}
                                    style={styles.input}
                                    placeholderTextColor="#EBC7B1"
                                    value={userData?.personalInformation?.dateOfBirth ?? ""}
                                    onChangeText={(value) => handleInputChange('personalInformation', 'dateOfBirth', value)}
                                    editable={!firestoreData?.personalInformation?.dateOfBirth}
                                    ref={dobRef}
                                />
                            </View>
                            <View>
                                <TextInput
                                    placeholder={"Email"}
                                    style={styles.input}
                                    value={userData?.contactInformation?.email ?? ""}
                                    onChangeText={(value) => handleInputChange('contactInformation', 'email', value)}
                                    placeholderTextColor="#EBC7B1"
                                    editable={!firestoreData?.contactInformation?.email}
                                    ref={emailRef}
                                />
                            </View>
                            <View style={styles.phonecontainer}>
                                <View style={styles.phone}>
                                    <TextInput placeholder={userData?.contactInformation?.phone} style={styles.number2} placeholderTextColor="#EBC7B1" readOnly />
                                </View>
                            </View>

                            <TouchableOpacity style={styles.creat} onPress={handleUserUpdate}>
                                <Text style={styles.creattext}>UPDATE</Text>
                            </TouchableOpacity>
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
            </View>
            <View style={loading ? styles.loadingContainer : null}>
                {loading && <Loader/>}
            </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default ProfileDetails;

const styles = StyleSheet.create({
    safearea: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    scrollview: {
        flexGrow: 1
    },
    main: {
        flexGrow: 1,
        paddingBottom: 30
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#7b2a38',
        paddingVertical: width / 40,
    },
    headertext: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headertextmain: {
        color: 'white',
    },
    logo: {
        alignItems: 'center',
        marginBottom: 30,
        marginTop: 30,
    },

    image: {
        height: 100,
        width: 300,
        resizeMode: 'contain',
    },
    formcontainer: {
        paddingHorizontal: 12,
    },
    container: {
        backgroundColor: 'white',
        borderRadius: 25,
        paddingVertical: 20,
        paddingHorizontal: 12,
    },
    profile: {
        alignItems: 'center',
        padding: 20,
        paddingTop: 0,
    },
    profiletext: {
        fontSize: 25,
        color: '#792A37',
    },
    formbody: {
        display: 'flex',
        gap: width / 30,
    },
    input: {
        borderColor: '#EBC7B1',
        borderWidth: 1,
        borderRadius: 12,
        paddingLeft: width / 40,
        color: '#EBC7B1',
        fontWeight:'bold'
    },
    phonecontainer: {
        display: 'flex',
        flexDirection: 'row',
        gap: width / 30,
    },
    code: {
        width: '20%',
        borderColor: '#EBC7B1',
        borderWidth: 1,
        borderRadius: 12,
    },
    phone: {
        flex: 1,
        borderColor: '#EBC7B1',
        borderWidth: 1,
        borderRadius: 12,
    },
    number1: {
        textAlign: 'center',
        fontWeight:'bold'
    },
    number2: {
        textAlign: 'left',
        paddingLeft: width / 40,
        fontWeight:'bold',
    },
    creat: {
        borderRadius: 12,
        backgroundColor: '#7b2a38',
        padding: width / 30,
        marginTop:width/30,
    },
    creattext: {
        color: 'white',
        textAlign: 'center',
    },
    footerbody: {
        marginTop:width/15
    },
    footer: {
        textAlign: 'center',
    },
    footertext: {
        textAlign: 'center',
        color: 'black',
        fontSize:12,
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
