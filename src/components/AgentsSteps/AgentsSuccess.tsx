import {
    Dimensions,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Animated,
    BackHandler
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LottieView from 'lottie-react-native';
import auth from '@react-native-firebase/auth'
import AsyncStorage from '@react-native-async-storage/async-storage';
import useAgent from '../../hooks/useAgent';

const { width, height } = Dimensions.get('window');

const AgentsSuccess = ({ navigation }) => {
    const [agentsData, setAgentsData] = useState();
    const { getAgentsCurrentDetails } = useAgent();

    useEffect(() => {
        getAgentsCurrentDetails(setAgentsData);
    }, [])

    useEffect(() => {
        let timeoutId;
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true);

        timeoutId = setTimeout(() => {
            navigation.replace("AgentsLayout");
        }, 2000);


        return () => {
            clearTimeout(timeoutId);
            backHandler.remove();
        };
    }, [navigation]);

    useEffect(() => {
        saveUserToAsyncStorage();
    }, [])

    const saveUserToAsyncStorage = () => {
        const user = auth().currentUser;

        AsyncStorage.setItem('userToken', user?.uid);
    };

    const getFormattedDate = () => {
        const date = new Date(Date.now()); // Get current date
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Ensure two digits
        const day = String(date.getDate()).padStart(2, '0'); // Ensure two digits
    
        return `${year}-${month}-${day}`;
    };
    

    return (
        <SafeAreaView style={styles.safearea}>
            <View style={styles.main}>
                <View style={styles.header}>
                    {/* <TouchableOpacity>
              <Icon name="chevron-left" size={30} color="white" />
            </TouchableOpacity> */}
                    <View style={styles.headertext}>
                        <Text style={styles.headertextmain}>Agent Registration</Text>
                    </View>
                </View>

                <View style={styles.maincontent}>
                <View style={styles.verifiedcontainer}>
                    <View>
                        <Animated.View style={styles.lottiecontainer}><LottieView source={require('../../assets/animations/success.json')} autoPlay loop resizeMode='cover' style={styles.lottie} /></Animated.View>
                        <View style={styles.textcontainer}>
                            <Text style={styles.text}>
                                Agent Registration has been successfully completed.
                            </Text>
                            <Text style={styles.text}>You'll be redirected in a few moments</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.footerbody}>
                    <View style={styles.footer}>
                        <View style={styles.textbody}>
                            <Text style={styles.footertext}>Agent ID:</Text>
                            <Text style={styles.footertextbold}>{agentsData?.agent_id}</Text>
                        </View>
                        <View style={styles.textbody}>
                            <Text style={styles.footertext}>Date:</Text>
                            <Text style={styles.footertextbold}>{getFormattedDate()}</Text>
                        </View>
                    </View>
                </View>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default AgentsSuccess;

const styles = StyleSheet.create({
    safearea: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    main: {
        flex: 1,
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#BE7356',
        paddingVertical: width / 20,
    },
    headertext: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headertextmain: {
        color: 'white',
    },
    maincontent: {
        flex: 1,
        justifyContent: 'center',
        gap: 20
    },
    verifiedcontainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    lottiecontainer: {
        height: 'auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    lottie: {
        height: width / 3,
        width: width / 10,
    },
    verifiedtext: {
        color: '#BE7356',
        fontSize: 25,
        fontWeight: '500',
        textAlign: 'center'
    },
    textcontainer: {
        alignItems: 'center',
    },
    text: {
        color: '#BE7356',
    },

    footerbody: {
        width: '50%',
        marginHorizontal: 'auto'
    },
    footer: {},
    footertext: {
        textAlign: 'center',
        color: 'black',
    },
    footertextbold: {
        textAlign: 'center',
        color: 'black',
        fontWeight: 'bold'
    },
    textbody: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    }
});
