import { ActivityIndicator, Alert, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '../Header/Header'
import useAgent from '../../hooks/useAgent';
import AIcon from 'react-native-vector-icons/AntDesign';
import { getFirstName } from '../../utils';
import AgentsHeader from '../Header/AgentsHeader';
import {PencilLine} from 'lucide-react-native';

const LIGHT_BG = '#fbf1ec'

const EmptyUser = ({ message }) => (
    <TouchableOpacity style={styles.imagetextview}>
        <Text style={styles.detailtext}>{message}</Text>
    </TouchableOpacity>
)

const EditProfile = ({ navigation }) => {
    const [acceptedData, setAcceptedData] = useState([]);
    const [loading, setLoading] = useState(false);
    const { getProfilesUploadedByAgent } = useAgent();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            await getProfilesUploadedByAgent(setAcceptedData);
            setLoading(false);
        };

        fetchData();
    }, []);

    return (
        <SafeAreaView style={styles.safearea}>
            <ScrollView contentContainerStyle={styles.scrollview}>
                <View style={styles.main}>
                    <AgentsHeader navigation={navigation} />
                    <View>
                        <Text style={styles.assigntext}>Edit Profiles</Text>
                    </View>


                    <View style={styles.maincontent}>
                        {acceptedData.length > 0 &&
                        <View style={styles.imagecontainer}>
                            {acceptedData.map((user) => (
                                <View key={user.id} style={styles.imagetextview}>
                                    <View style={styles.imagetextviewchild}>
                                        <Text style={styles.detailtext}>{user?.personalInformation?.firstName} {user?.personalInformation?.lastName}</Text>
                                        <View style={styles.imagebox}>
                                            <Image source={{ uri: user?.contactInformation?.profilePicture || 'https://static.vecteezy.com/system/resources/thumbnails/004/141/669/small/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg' }} style={styles.usersimage} />
                                        </View>
                                    </View>
                                    <TouchableOpacity onPress={() => navigation.navigate('EditProfilesByAgent', { id: user.id })}>
                                    <PencilLine size={23} strokeWidth={1} />
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>}
                        {acceptedData.length == 0 &&
                        <EmptyUser message='No Profiles Available' />
                    }
                    </View>

                    
                </View>
            </ScrollView>
            <View style={loading ? styles.loadingContainer : null}>
                {loading && <ActivityIndicator size="large" color="#a4737b" />}
            </View>
        </SafeAreaView>
    )
}

export default EditProfile

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
        paddingHorizontal: 15,
        paddingVertical:10,
    },
    imagetextviewchild: {
        display: 'flex',
        flexDirection: "row",
        alignItems: 'center',
        gap: 10
    },

    detailtext: {
        color: 'black',
        fontSize: 15,
        fontWeight: '500'
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