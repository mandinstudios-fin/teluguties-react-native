import { ActivityIndicator, Dimensions, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '../Header/Header'
import IIcon from 'react-native-vector-icons/SimpleLineIcons';
import AIcon from 'react-native-vector-icons/AntDesign';
import useAgent from '../../hooks/useAgent';
import { getFirstName } from '../../utils';

const { height, width } = Dimensions.get('window');



const AgentsAssign = ({ navigation }) => {
    const [loading, setLoading] = useState(false);
    const [assignedData, setAssignedData] = useState([]);
    const [matchedData, setMatchedData] = useState([]);


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
                    <Header navigation={navigation} />

                    <View style={styles.maincontent}>
                        <View style={styles.dashboardcontainer}>
                            <Text style={styles.dashboardtext}>Dashboard</Text>
                        </View>

                        <View>
                            <Text style={styles.uploadtext}>Upload Profiles</Text>
                            <TouchableOpacity style={styles.arrowcontainer} onPress={() => navigation.navigate("AgentUploadProfiles")}>
                                <Text style={styles.detailtext}>Fill Your Matche Details/Uploads</Text>
                                <IIcon name="arrow-right" color={'#AF694A'} size={30} />
                            </TouchableOpacity>
                        </View>

                        <View>
                            <View style={styles.assignedbox}>
                                <Text style={styles.uploadtext}>Assigned Users</Text>
                                <TouchableOpacity onPress={() => assignedData.length > 0 && navigation.navigate("AllAssignedUser")}><Text style={styles.viewalltext}>View All</Text></TouchableOpacity>
                            </View>

                            {assignedData.length > 0 &&
                                <View style={styles.imagecontainer}>
                                    {assignedData.slice(0, 2).map((user) => (
                                        <TouchableOpacity onPress={() => navigation.navigate("UserProfileDetails", { user })} key={user.id} style={styles.imagetextview}>
                                            <Text style={styles.detailtext}>{getFirstName(user?.personal_info?.name)} wants to connect with you!</Text>
                                            <View style={styles.imagebox}>
                                                <Image source={require('../../assets/users.png')} style={styles.usersimage} />
                                            </View>
                                        </TouchableOpacity>
                                    ))}
                                </View>}

                        </View>

                        <View>
                            <View style={styles.assignedbox}>
                                <Text style={styles.uploadtext} >Matched Profiles</Text>
                                <TouchableOpacity><Text style={styles.viewalltext}>View All</Text></TouchableOpacity>
                            </View>

                            {matchedData.length > 0 &&
                                <View style={styles.imagecontainer}>
                                    {matchedData.slice(0, 1).map((item) => (
                                        <View key={item.id} style={styles.imagetextview}>
                                            <Text style={styles.detailtext}>{item.text}</Text>
                                            <View style={styles.imagebox}>
                                                <Image source={require('../../assets/heartu.png')} style={styles.usersimage} />
                                            </View>
                                        </View>
                                    ))}
                                </View>}
                        </View>

                        <View>
                            <Text style={styles.uploadtext}>Manage Profiles</Text>

                            <View style={styles.managechild}>
                                <View style={styles.manangetwochild}>
                                    <TouchableOpacity style={styles.managechildcontainer} onPress={() => navigation.navigate('DeleteProfile')}>
                                        <View><AIcon name='deleteuser' size={27} color={'black'} /></View>
                                        <View><Text style={styles.managechildtext}>Delete Profile</Text></View>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={styles.managechildcontainer} onPress={() => navigation.navigate('EditProfile')}>
                                        <View><AIcon name='edit' size={27} color={'black'} /></View>
                                        <View><Text style={styles.managechildtext}>Edit Profile</Text></View>
                                    </TouchableOpacity>
                                </View>


                                <View style={styles.manangetwochild}>
                                    <TouchableOpacity style={styles.managechildcontainer} onPress={() => navigation.navigate('UploadedProfiles')}>
                                        <View><AIcon name='clouduploado' size={27} color={'black'} /></View>
                                        <View><Text style={styles.managechildtext}>Uploaded Profiles</Text></View>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={styles.managechildcontainer} onPress={() => navigation.navigate('AgentsAcceptedProfiles')}>
                                        <View><AIcon name='checkcircleo' size={27} color={'black'} /></View>
                                        <View><Text style={styles.managechildtext}>Accepted Profiles</Text></View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>

                </View>
            </ScrollView>
            <View style={loading ? styles.loadingContainer : null}>
                {loading && <ActivityIndicator size="large" color="#a4737b" />}
            </View>
        </SafeAreaView>
    )
}

export default AgentsAssign

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
        gap: 3,
        paddingBottom: 20
    },
    maincontent: {
        paddingHorizontal: width * 0.04,
        gap: 15
    },
    dashboardcontainer: {
        marginTop: 20
    },
    dashboardtext: {
        color: 'black',
        fontSize: 30,
        fontWeight: 'bold'
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
        marginTop: 5
    },
    detailtext: {
        color: 'black',
        fontSize: 16,
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
        borderRadius: 25,
        marginTop: 5
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
    managechild: {
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        alignItems: 'center',
        backgroundColor: '#e4d7cf',
        borderRadius: 25,
        padding: 20,
        marginTop: 5
    },
    manangetwochild: {
        display: 'flex',
        flexDirection: 'row',
        gap: 10
    },
    managechildcontainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#e3ccc1',
        borderRadius: 25,
        width: '50%',
        height: 100
    },
    managechildtext: {
        fontSize: 16,
        color: '#000'
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