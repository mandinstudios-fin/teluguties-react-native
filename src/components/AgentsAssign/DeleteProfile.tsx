import { ActivityIndicator, Alert, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '../Header/Header'
import useAgent from '../../hooks/useAgent';
import AIcon from 'react-native-vector-icons/AntDesign';
import firestore from '@react-native-firebase/firestore';
import DeleteModal from './DeleteModal';
import useToastHook from '../../utils/useToastHook';
import AgentsHeader from '../Header/AgentsHeader';
import { Trash2 } from 'lucide-react-native';

const LIGHT_BG = '#fbf1ec'

const EmptyUser = ({ message }) => (
    <TouchableOpacity style={styles.imagetextview}>
        <Text style={styles.detailtext}>{message}</Text>
    </TouchableOpacity>
)

const DeleteProfile = ({ navigation }) => {
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [acceptedData, setAcceptedData] = useState([]);
    const [loading, setLoading] = useState(false);
    const { getProfilesUploadedByAgent } = useAgent();
    const { successToast, errorToast } = useToastHook();

    const fetchData = async () => {
        setLoading(true);
        await getProfilesUploadedByAgent(setAcceptedData);
        setLoading(false);
    };


    useEffect(() => {
        fetchData();
    }, []);

    const deleteProfile = async () => {
        setLoading(true);

        try {
            if (!selectedUserId) {
                console.error("Profile ID is required");
                return;
            }

            await firestore().collection('profiles').doc(selectedUserId).delete();

            fetchData();
            successToast('Profile Deleted Successfully.');
        } catch (error) {
            errorToast('Something went wrong.')
        }

        setLoading(false);
    };

    const openModal = (userId) => {
        setSelectedUserId(userId);
        setModalVisible(true);
    };

    const handleConfirm = async () => {
        setModalVisible(false);

        await deleteProfile();
    }


    return (
        <SafeAreaView style={styles.safearea}>
            <ScrollView contentContainerStyle={styles.scrollview}>
                <View style={styles.main}>
                    <AgentsHeader navigation={navigation} />
                    <View>
                        <Text style={styles.assigntext}>Delete Profiles</Text>
                    </View>


                    <View style={styles.maincontent}>
                        {acceptedData.length > 0 &&
                            <View style={styles.imagecontainer}>
                                {acceptedData.map((user) => (
                                    <TouchableOpacity key={user.id} style={styles.imagetextview}>
                                        <View style={styles.imagetextviewchild}>
                                            <Text style={styles.detailtext}>{user?.personal_info?.name}</Text>
                                            <View style={styles.imagebox}>
                                                <Image source={{ uri: user?.profile_pic }} style={styles.usersimage} />
                                            </View>
                                        </View>
                                        <TouchableOpacity onPress={() => openModal(user.id)}>
                                        <Trash2 size={23} strokeWidth={1} />
                                        </TouchableOpacity>
                                    </TouchableOpacity>
                                ))}
                            </View>}
                        {acceptedData.length == 0 &&
                            <EmptyUser message='No Profiles Available' />
                        }


                    </View>
                </View>
            </ScrollView>
            <DeleteModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onConfirm={handleConfirm}
            />
            <View style={loading ? styles.loadingContainer : null}>
                {loading && <ActivityIndicator size="large" color="#a4737b" />}
            </View>
        </SafeAreaView>
    )
}

export default DeleteProfile

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