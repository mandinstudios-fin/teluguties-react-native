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
import React from 'react';
import auth from '@react-native-firebase/auth'
import Icon from 'react-native-vector-icons/MaterialIcons';
import Header from '../Header/Header';

const { width, height } = Dimensions.get('window');

const ProfileDetails: React.FC = ({ navigation }) => {
    const { displayName, dob, email, phoneNumber, phoneCode } = auth().currentUser;
    console.log(auth().currentUser)

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
                                    placeholder={displayName}
                                    placeholderTextColor="#EBC7B1"
                                />
                            </View>
                            <View>
                                <TextInput
                                    placeholder={dob}
                                    style={styles.input}
                                    placeholderTextColor="#EBC7B1"
                                />
                            </View>
                            <View>
                                <TextInput
                                    placeholder={email}
                                    style={styles.input}
                                    placeholderTextColor="#EBC7B1"
                                />
                            </View>
                            <View style={styles.phonecontainer}>
                                <View style={styles.code}>
                                    <TextInput placeholder={phoneCode}/>
                                </View>
                                <View style={styles.phone}>
                                    <TextInput placeholder={phoneNumber}/>
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
        paddingHorizontal: 12
    },
    container: {
        backgroundColor: 'white',
        borderRadius: 25,
        paddingVertical: 20,
        paddingHorizontal: 12
    },
    profile: {
        alignItems: 'center',
        padding: 20,
        paddingTop: 0
    },
    profiletext: {
        fontSize: 25,
        color: '#792A37'
    },
    formbody: {
        display: 'flex',
        gap: width / 30
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
        color:'black'
    },
});
