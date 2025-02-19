import { ActivityIndicator, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '../Header/Header';
import useAgent from '../../hooks/useAgent';
import FIcon from 'react-native-vector-icons/Feather';
import useFirestore from '../../hooks/useFirestore';

const AssignAgentForMatch = ({ navigation, route }) => {
    const { profile_a_id, profile_b_id } = route.params
    const [agentData, setAgentData] = useState([]);
    const [loading, setLoading] = useState(false);
    const { getAgentsData } = useAgent();
    const { sendMatchingRequestToAgent } = useFirestore();

    useEffect(() => {
        const handleGetAgentsData = async () => {
            setLoading(true);
            const unsubscribe = getAgentsData(setAgentData);
            setLoading(false);
            return () => unsubscribe()
        }

        handleGetAgentsData();
    }, [])

    return (
        <SafeAreaView style={styles.safearea}>
            <ScrollView contentContainerStyle={styles.scrollview}>
                <View style={styles.main}>
                    <Header navigation={navigation} />
                    <View>
                        <Text style={styles.assigntext}>Agents Profiles</Text>
                    </View>
                    {agentData.length > 0 &&
                        <View style={styles.maincontent}>
                            <View style={styles.imagecontainer}>
                                {agentData.map((agent) => (
                                    <View key={agent?.id} style={styles.imagetextview}>
                                        <View style={styles.imagetextviewchild}>
                                            <Text style={styles.detailtext}>{agent?.fullname}</Text>
                                            <View style={styles.imagebox}>
                                                <Image source={{ uri: agent?.profilepic }} style={styles.usersimage} />
                                            </View>
                                        </View>
                                        <TouchableOpacity onPress={() => sendMatchingRequestToAgent(profile_a_id, profile_b_id, agent.id)}>
                                            <FIcon name='send' size={25} color={'#000'} />
                                        </TouchableOpacity>
                                    </View>
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

export default AssignAgentForMatch

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

    },

    maincontent: {
        paddingHorizontal: 10,
        marginTop: 20
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
        paddingHorizontal: 15,
        overflow: 'hidden'
    },
    imagetextviewchild: {
        display: 'flex',
        flexDirection: "row",
        alignItems: 'center',
        gap: 10
    },
    detailtext: {
        color: 'black',
        fontSize: 16,
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


    assigntext: {
        color: '#000',
        alignItems: 'center',
        fontSize: 25,
        fontWeight: 'bold',
        textAlign: 'center',
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