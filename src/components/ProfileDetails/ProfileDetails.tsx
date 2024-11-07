import {
    Dimensions,
    Image,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Header from '../Header/Header';
import firestore from '@react-native-firebase/firestore';
import firebase from '@react-native-firebase/app';
import { collection, getDocs } from 'firebase/firestore';

const { width, height } = Dimensions.get('window');

const ProfileDetails: React.FC = ({ navigation }) => {
    const [userData, setUserData] = useState({});

    const getCurrentUserDetails = async () => {
        const currentUser = auth().currentUser;

        if (currentUser) {
            try {
                const userDoc = await firestore().collection('users').doc(currentUser.uid).get();

                if (userDoc.exists) {
                    const userDataFirestore = userDoc.data();
                   setUserData(userDataFirestore)
                } else {
                    console.log("No user data found for this UID"); 
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        } else {
            console.log("No user is currently authenticated.");
        }
    }

    useEffect(() => {
        getCurrentUserDetails();
    }, [])

    return (
        <SafeAreaView style={styles.safearea}>
            <View style={styles.main}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Icon name="chevron-left" size={30} color="white" />
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
                                    placeholder={userData.name}
                                    placeholderTextColor="#EBC7B1"
                                />
                            </View>
                            <View>
                                <TextInput
                                    placeholder={userData.dob}
                                    style={styles.input}
                                    placeholderTextColor="#EBC7B1"
                                />
                            </View>
                            <View>
                                <TextInput
                                    placeholder={''}
                                    style={styles.input}
                                    placeholderTextColor="#EBC7B1"
                                />
                            </View>
                            <View style={styles.phonecontainer}>
                                <View style={styles.code}>
                                    <TextInput placeholder={userData.phoneCode} />
                                </View>
                                <View style={styles.phone}>
                                    <TextInput placeholder={userData.phoneNumber} />
                                </View>
                            </View>

                            <TouchableOpacity style={styles.creat}>
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
        </SafeAreaView>
    );
};

export default ProfileDetails;

const styles = StyleSheet.create({
    safearea: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    main: {
        flexGrow: 1,
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#BE7356',
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
    creat: {
        borderRadius: 12,
        backgroundColor: '#a4737b',
        padding: width / 30,
    },
    creattext: {
        color: 'white',
        textAlign: 'center',
    },
    footerbody: {
        position: 'absolute',
        bottom: width / 40,
        left: 0,
        right: 0,
    },
    footer: {
        textAlign: 'center',
    },
    footertext: {
        textAlign: 'center',
        color: 'black',
    },
});
