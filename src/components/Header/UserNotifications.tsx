import { ActivityIndicator, Dimensions, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '../Header/Header'
import { getFirstName } from '../../utils';
import useFirestore from '../../hooks/useFirestore';
import Loader from '../Loader/Loader';

const { height, width } = Dimensions.get('window');

const UserNotifications = ({ navigation }) => {
    const [loading, setLoading] = useState(false);
    const [notificationsData, setNotificationsData] = useState([]);

    const { getNotificationsData } = useFirestore();

    useEffect(() => {
        const handleSetNotificationsData = async () => {
            setLoading(true);
            await getNotificationsData(setNotificationsData)
            setLoading(false);
        };

        handleSetNotificationsData();
    }, []);

    return (

        <SafeAreaView style={styles.safearea}>
            <ScrollView contentContainerStyle={styles.scrollview}>
                <View style={styles.main}>
                    <Header navigation={navigation} />

                    <View style={styles.maincontent}>
                        <View style={styles.dashboardcontainer}>
                            <Text style={styles.dashboardtext}>Notifications</Text>
                        </View>

                        <View>
                            {notificationsData.length > 0 &&
                                <View style={styles.imagecontainer}>
                                    {notificationsData.map((notification) => (
                                        <TouchableOpacity key={notification} style={styles.imagetextview}>
                                            <Text style={styles.detailtext}>{notification}</Text>
                                            <View style={styles.imagebox}>
                                                <Image source={require('../../assets/users.png')} style={styles.usersimage} />
                                            </View>
                                        </TouchableOpacity>
                                    ))}
                                </View>}

                        </View>
                    </View>

                </View>
            </ScrollView>
            <View style={loading ? styles.loadingContainer : null}>
                {loading && <Loader />}
            </View>
        </SafeAreaView>
    )
}

export default UserNotifications

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
        gap: 3
    },
    maincontent: {
        paddingHorizontal: 10,
        gap: 15
    },
    dashboardcontainer: {
        marginTop: 20
    },
    dashboardtext: {
        color: 'black',
        fontSize: 25,
        alignSelf: 'center'
    },
    uploadtext: {
        color: 'black',
        fontSize: 20,
        fontWeight: 'bold',
    },
    arrowcontainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#e4d7cf',
        paddingHorizontal: 27,
        paddingVertical: 30,
        borderRadius: 25,
    },
    detailtext: {
        color: 'black',
        fontSize: 12,
        width: '80%',
    },
    assignedbox: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },

    viewalltext: {
        color: 'gray',
        fontSize: 14,
    },
    imagecontainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        backgroundColor: '#e4d7cf',
        height: 'auto',
        padding: 17,
        borderRadius: 25
    },
    imagetextview: {
        backgroundColor: '#e3ccc1',
        borderRadius: 25,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 43,
        paddingLeft: 15,
    },

    imagebox: {
        width: '20%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    // matchtext: {
    //     color: 'black',
    //     fontSize: 16,
    //     borderColor: '#E5BDA3',
    //     borderWidth: 1,
    //     width: '80%'

    // },

    usersimage: {
        width: '50%',
        resizeMode: 'contain'
    },
    matchbox: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        borderColor: 'black',
        borderWidth: 2,
        padding: 10,  // Added padding for better spacing
    },
    heartbox: {
        width: 'auto',
    },
    heartuimage: {
        resizeMode: 'contain', // Correct way to maintain aspect ratio
    },
    matchtext: {
        fontSize: 16,
        color: '#333',

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