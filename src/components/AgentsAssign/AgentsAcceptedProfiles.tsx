import { ActivityIndicator, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '../Header/Header'
import useAgent from '../../hooks/useAgent';
import { getFirstName } from '../../utils';

const AgentsAcceptedProfiles = ({ navigation }) => {
    const [loading, setLoading] = useState(false);
    const [acceptedData, setAcceptedData] = useState([]);
    const { getAgentsAcceptedProfiles } = useAgent();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            await getAgentsAcceptedProfiles(setAcceptedData);
            setLoading(false);
        };

        fetchData();
    }, []);

    return (
        <SafeAreaView style={styles.safearea}>
            <ScrollView contentContainerStyle={styles.scrollview}>
                <View style={styles.main}>
                    <Header navigation={navigation} />
                    <View>
                        <Text style={styles.assigntext}>Accepted Profiles</Text>
                    </View>

                    {acceptedData.length > 0 &&
                    <View style={styles.maincontent}>
                        <View style={styles.imagecontainer}>
                            {acceptedData.map((user) => (
                                <TouchableOpacity key={user.id} style={styles.imagetextview}>
                                    <Text style={styles.detailtext}>{user?.personal_info?.name}</Text>
                                    <View style={styles.imagebox}>
                                        <Image source={{ uri: user?.profile_pic }} style={styles.usersimage} />
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>}
                </View>
            </ScrollView>
            <View style={loading ? styles.loadingContainer : null}>
                {loading && <ActivityIndicator size="large" color="#a4737b" />}
            </View>
        </SafeAreaView>
    )
}

export default AgentsAcceptedProfiles

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
        fontWeight: 'bold',
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
        height: 50,
        paddingLeft: 15,
        overflow: 'hidden'
    },

    detailtext: {
        color: 'black',
        fontSize: 16,
        width: '80%',
        fontWeight: 'bold'
    },

    imagebox: {
        width: '20%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },

    usersimage: {
        width: '100%',
        height: '100%',
        aspectRatio: 1,
        resizeMode: 'contain',
        borderRadius: 100,
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