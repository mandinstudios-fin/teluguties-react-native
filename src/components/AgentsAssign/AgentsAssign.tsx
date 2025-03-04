import { ActivityIndicator, Dimensions, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '../Header/Header'
import IIcon from 'react-native-vector-icons/SimpleLineIcons';
import AIcon from 'react-native-vector-icons/AntDesign';
import useAgent from '../../hooks/useAgent';
import { getFirstName } from '../../utils';
import { ArrowUpFromLine, ArrowUpRight, ChevronRight, UserCheck, UserPen, UserX } from 'lucide-react-native';
import AgentsHeader from '../Header/AgentsHeader';
import Loader from '../Loader/Loader';

const { height, width } = Dimensions.get('window');

const LIGHT_BG = '#fbf1ec'




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

    const EmptyUser = ({ message }) => (
        <TouchableOpacity style={styles.imagetextview}>
            <Text style={styles.detailtext}>{message}</Text>
        </TouchableOpacity>
    )

    return (

        <SafeAreaView style={styles.safearea}>
            <ScrollView contentContainerStyle={styles.scrollview}>
                <View style={styles.main}>
                    <AgentsHeader navigation={navigation} />

                    <View style={styles.maincontent}>
                        <View style={styles.dashboardcontainer}>
                            <Text style={styles.dashboardtext}>Dashboard</Text>
                        </View>

                        <View>
                            <Text style={styles.uploadtext}>Upload Profiles</Text>
                            <TouchableOpacity style={styles.arrowcontainer} onPress={() => navigation.navigate("AgentUploadProfiles")}>
                                <Text style={styles.detailtext}>Fill Your Match Details/Uploads</Text>
                                <ChevronRight size={27} strokeWidth={1} />
                            </TouchableOpacity>
                        </View>

                        <View>
                            <View style={styles.assignedbox}>
                                <Text style={styles.uploadtext}>Assigned Users</Text>
                                <TouchableOpacity onPress={() => assignedData.length > 0 && navigation.navigate("AllAssignedUser")}><Text style={styles.viewalltext}>View All</Text></TouchableOpacity>
                            </View>

                            {assignedData.length > 0 && (
                                <View style={styles.imagecontainer}>
                                    {assignedData.slice(0, 3).map((user, index) => {
                                        const isPair = user?.userADetails || user?.userBDetails;

                                        if (isPair) {
                                            // Handling paired users
                                            const { userADetails, userBDetails } = user || {};
                                            const firstNameA = userADetails?.personalInformation?.firstName || "Someone";
                                            const firstNameB = userBDetails?.personalInformation?.firstName || "Someone else";

                                            return (
                                                <TouchableOpacity
                                                    onPress={() => navigation.navigate("UserProfileDetails", { user: userADetails })}
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

                            {assignedData.length == 0 &&
                                <EmptyUser message='No Assigned Users' />
                            }

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

                            {matchedData.length == 0 &&
                                <EmptyUser message='No Matched Users' />
                            }
                        </View>

                        <View>
                            <Text style={styles.uploadtext}>Manage Profiles</Text>

                            <View style={styles.managechild}>
                                <View style={styles.manangetwochild}>
                                    <TouchableOpacity style={[styles.managechildcontainer, styles.managechildcontainerbig]} onPress={() => navigation.navigate('EditProfile')}>
                                        <View><UserPen size={23} strokeWidth={1} /></View>
                                        <View><Text style={styles.managechildtext}>Edit Profile</Text></View>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={[styles.managechildcontainer, styles.managechildcontainersmall]} onPress={() => navigation.navigate('DeleteProfile')}>
                                        <View><UserX size={23} strokeWidth={1} /></View>
                                        <View><Text style={styles.managechildtext}>Delete Profile</Text></View>
                                    </TouchableOpacity>
                                </View>


                                <View style={styles.manangetwochild}>
                                    <TouchableOpacity style={[styles.managechildcontainer, styles.managechildcontainersmall]} onPress={() => navigation.navigate('AgentsAcceptedProfiles')}>
                                        <View><UserCheck size={23} strokeWidth={1} /></View>
                                        <View><Text style={styles.managechildtext}>Accepted Profiles</Text></View>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={[styles.managechildcontainer, styles.managechildcontainerbig]} onPress={() => navigation.navigate('UploadedProfiles')}>
                                        <View><ArrowUpFromLine size={23} strokeWidth={1} /></View>
                                        <View><Text style={styles.managechildtext}>Uploaded Profiles</Text></View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>

                </View>
            </ScrollView>
            <View style={loading ? styles.loadingContainer : null}>
                {loading && <Loader/>}
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
        paddingHorizontal: width * 0.05,
        gap: 15
    },
    dashboardcontainer: {
        marginTop: 20
    },
    dashboardtext: {
        color: 'black',
        fontSize: 30,
    },
    uploadtext: {
        color: 'black',
        fontSize: 20,
    },
    arrowcontainer: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: LIGHT_BG,
        paddingHorizontal: 27,
        paddingVertical: 20,
        borderRadius: 8,
        marginTop: 5
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
        fontSize: 12,
    },
    imagecontainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        marginTop: 5
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
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        backgroundColor: LIGHT_BG,
        borderRadius: 8,
        paddingVertical: 20,
        paddingHorizontal: 15
    },
    managechildcontainerbig: {
        width: '50%',
    },
    managechildcontainersmall: {
        width: '50%',
    },
    managechildtext: {
        fontSize: 12,
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