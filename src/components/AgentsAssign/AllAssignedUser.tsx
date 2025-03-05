import { ActivityIndicator, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '../Header/Header'
import useAgent from '../../hooks/useAgent';
import { getFirstName } from '../../utils';
import AgentsHeader from '../Header/AgentsHeader';
import Loader from '../Loader/Loader';

const LIGHT_BG = '#fbf1ec'

const AllAssignedUser = ({ navigation }) => {
    const [assignedData, setAssignedData] = useState([]);
    const [loading, setLoading] = useState(false);
    const { getMatchingRequestData } = useAgent();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            await getMatchingRequestData(setAssignedData); // Ensure data is fully fetched
            setLoading(false);
        };

        fetchData();
    }, []);

    console.log(assignedData)

    return (
        <SafeAreaView style={styles.safearea}>
            <ScrollView contentContainerStyle={styles.scrollview}>
                <View style={styles.main}>
                    <AgentsHeader navigation={navigation} />
                    <View>
                        <Text style={styles.assigntext}>Assigned Users</Text>
                    </View>

                    <View style={styles.maincontent}>

                        <View style={styles.imagecontainer}>
                            {assignedData.length > 0 && (
                                <View style={styles.imagecontainer}>
                                    {assignedData.slice(0, 3).map((user, index) => {
                                        const isPair = user?.userADetails || user?.userBDetails;

                                        if (isPair) {
                                            // Handling paired users
                                            const { userADetails, userBDetails } = user || {};
                                            const firstNameA = userADetails?.personalInformation?.firstName || "Someone";
                                            const firstNameB = userBDetails?.personalInformation?.firstName || "Someone else";

                                            console.log(userBDetails)

                                            return (
                                                <TouchableOpacity
                                                    onPress={() => navigation.navigate("UserProfileDetails", { user: userADetails, userB: user?.userBDetails})}
                                                    key={userADetails?.id || userBDetails?.id || index} // Unique key
                                                    style={styles.imagetextview}
                                                >
                                                    <Text style={styles.detailtext}>
                                                        {firstNameA} and {firstNameB} want to connect with you!
                                                    </Text>
                                                    <View style={styles.imagebox}>
                                                        <Image source={require("../../assets/users.png")} style={styles.usersimage} />
                                                    </View>
                                                </TouchableOpacity>
                                            );
                                        } else {
                                            // Handling single user
                                            const firstName = user?.personalInformation?.firstName || "Someone";

                                            return (
                                                <TouchableOpacity
                                                    onPress={() => navigation.navigate("UserProfileDetails", { user })}
                                                    key={user?.id || index} // Unique key
                                                    style={styles.imagetextview}
                                                >
                                                    <Text style={styles.detailtext}>
                                                        {firstName} wants to connect with you!
                                                    </Text>
                                                    <View style={styles.imagebox}>
                                                        <Image source={require("../../assets/users.png")} style={styles.usersimage} />
                                                    </View>
                                                </TouchableOpacity>
                                            );
                                        }
                                    })}
                                </View>
                            )}
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

export default AllAssignedUser

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
        marginTop: 20
    },
    assigntext: {
        color: '#000',
        alignItems: 'center',
        fontSize: 25,
        textAlign: 'center',
    },

    assignedbox: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },

    uploadtext: {
        color: 'black',
        fontSize: 20,
        fontWeight: 'bold',
    },


    viewalltext: {
        color: 'gray',
        fontSize: 14,
    },

    imagecontainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        height: 'auto',
    },
    imagetextview: {
        backgroundColor: LIGHT_BG,
        borderRadius: 8,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 65,
        paddingLeft: 15,
    },

    detailtext: {
        color: 'black',
        fontSize: 12,
        width: '80%',
    },

    imagebox: {
        width: '20%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },

    usersimage: {
        width: '50%',
        resizeMode: 'contain'
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