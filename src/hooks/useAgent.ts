import { View, Text } from 'react-native'
import React from 'react'
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import useToastHook from '../utils/useToastHook';

const useAgent = () => {
    const { successToast, errorToast } = useToastHook();
    const currentUser = auth().currentUser;

    const getAgentsDetails = async (setAgentFormData) => {
        if (!currentUser) return;

        try {
            const userDoc = await firestore().collection('agents').doc(currentUser.uid).get();
            if (userDoc.exists) {
                const userDataFirestore = userDoc.data();

                setAgentFormData(prevAgentFormData => ({ ...prevAgentFormData, agent_id: userDataFirestore?.agent_id }))
                setAgentFormData(prevAgentFormData => ({ ...prevAgentFormData, selectedcode: userDataFirestore?.selectedcode }))
                setAgentFormData(prevAgentFormData => ({ ...prevAgentFormData, phonenumber: userDataFirestore?.phonenumber }))
                setAgentFormData(prevAgentFormData => ({ ...prevAgentFormData, date_of_birth: userDataFirestore?.date_of_birth }))
            }
        } catch (error) {
            console.log(error)
            errorToast('Failed to fetch user details');
        }
    }

    const getAgentsCurrentDetails = async (setAgentsData) => {
        if (!currentUser) return;

        try {
            const userDoc = await firestore().collection('agents').doc(currentUser.uid).get();
            if (userDoc.exists) {
                const userDataFirestore = userDoc.data();

                setAgentsData(userDataFirestore);
            }
        } catch (error) {
            errorToast('Failed to fetch user details');
        }
    }

    const getAgentsData = (setData) => {
        const unsubscribe = firestore()
            .collection('agents')
            .onSnapshot(
                snapshot => {
                    const agentsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    setData(agentsList);
                },
                err => {
                    setData([]);
                }
            );
        return unsubscribe;

    }

    const getProfilesData = (setData) => {
        const unsubscribe = firestore()
            .collection('profiles')
            .onSnapshot(
                snapshot => {
                    const profilesList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    setData(profilesList);
                },
                err => {
                    setData([]);
                }
            );
        return unsubscribe;

    }

    const getMatchingRequestData = async (setAssignedData) => {
        try {
            const currentUser = auth().currentUser;
            if (!currentUser) {
                console.error("User not authenticated");
                setAssignedData([]);
            }

            const agentRef = firestore().collection('agents').doc(currentUser.uid);
            const agentDoc = await agentRef.get();

            const requests = agentDoc.data()?.requests || [];

            if (requests.length === 0) {
                setAssignedData([]);
            }

            const profilesData = await Promise.all(
                requests.map(async (id) => {
                    const profileDoc = await firestore().collection('profiles').doc(id).get();
                    if (profileDoc.exists) {
                        return { id, ...profileDoc.data() };
                    }
                    return null;
                })
            );

            const filteredData = profilesData.filter(profile => profile !== null);
            setAssignedData(filteredData)

        } catch (error) {
            console.error("Error fetching matching request data:", error);
            setAssignedData([])
        }
    }

    const getProfilesUploadedByAgent = async (setData) => {
        try {
            if (!currentUser) {
                console.error("User not authenticated");
                setData([]);
            }

            const userRef = firestore().collection('agents').doc(currentUser.uid);
            const userDoc = await userRef.get();

            if (!userDoc.exists) {
                console.error("Agent profile not found");
                setData([]);
            }

            const userData = userDoc.data();
            const agentId = userData.agent_id;

            if (!agentId) {
                console.error("Agent ID not found in user data");
                setData([]);
            }

            // Step 2: Query profiles with matching agent_id
            const querySnapshot = await firestore()
                .collection('profiles')
                .where('agent_id', '==', agentId)
                .get();

            const profiles = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            setData(profiles);

        } catch (error) {
            console.error("Error fetching profiles:", error);
            setData([]);
        }
    }

    const acceptAssignRequest = async (userId) => {
        try {
            if (!currentUser) {
                console.error("User not authenticated");
                return;
            }

            const agentRef = firestore().collection('agents').doc(currentUser?.uid);
            const agentDoc = await agentRef.get();

            const requests = agentDoc.data()?.accepted_requests || [];

            if (requests.includes(userId)) {
                successToast('Request already accepted');
                return;
            }

            await agentRef.update({
                accepted_requests: firestore.FieldValue.arrayUnion(userId)
            });

            const userRef = firestore().collection('profiles').doc(userId);
            await userRef.update({
                notifications: firestore.FieldValue.arrayUnion(
                    `Agent ${agentDoc.data()?.fullname} has accepted your request.`
                )
            });

            const title = 'Request Accepted';
            const body = `Agent ${agentDoc.data()?.fullname} has accepted your request.`;
            await sendNotification(userId, title, body);

            successToast('Request accepted successfully')
        } catch (error) {
            errorToast('Something Went Wrong...')
        }
    }

    const rejectAssignRequest = async (userId) => {
        try {
            if (!currentUser) {
                console.error("User not authenticated");
                return;
            }

            const agentRef = firestore().collection('agents').doc(currentUser?.uid);
            const agentDoc = await agentRef.get();

            const requests = agentDoc.data()?.rejected_requests || [];

            if (requests.includes(userId)) {
                successToast('Request already sent');
                return;
            }

            await agentRef.update({
                rejected_requests: firestore.FieldValue.arrayUnion(userId)
            });

            const userRef = firestore().collection('profiles').doc(userId);
            await userRef.update({
                notifications: firestore.FieldValue.arrayUnion(
                    `Agent ${agentDoc.data()?.fullname} has rejected your request.`
                )
            });

            const title = 'Request Rejected';
            const body = `Agent ${agentDoc.data()?.fullname} has rejected your request.`;
            await sendNotification(userId, title, body);

            successToast('Request rejected successfully')
        } catch (error) {
            errorToast('Sometnhing Went Wrong...')
        }
    }

    const getAgentsAcceptedProfiles = async (setAcceptedData) => {
        try {
            if (!currentUser) {
                console.error("User not authenticated");
                return;
            }

            const agentRef = firestore().collection('agents').doc(currentUser?.uid);

            const unsubscribeAgent = agentRef.onSnapshot((agentDoc) => {
                if (!agentDoc.exists) {
                    setAcceptedData([]);
                    return;
                }

                const acceptedRequests = agentDoc.data()?.accepted_requests || [];
                if (acceptedRequests.length === 0) {
                    setAcceptedData([]);
                    return;
                }

                const profilesCollection = firestore().collection('profiles');

                const unsubscribes = acceptedRequests.map(id =>
                    profilesCollection.doc(id).onSnapshot((profileDoc) => {
                        setAcceptedData(prevProfiles => {
                            const updatedProfiles = prevProfiles.filter(p => p.id !== profileDoc.id);
                            if (profileDoc.exists) {
                                updatedProfiles.push({ id: profileDoc.id, ...profileDoc.data() });
                            }
                            return updatedProfiles;
                        });
                    })
                );

                return () => unsubscribes.forEach(unsub => unsub());
            });

            return () => unsubscribeAgent();
        } catch (error) {
        }
    }

    const getProfilesUploadedByA = async (setAcceptedData) => {
        try {
            if (!currentUser) {
                console.error("User not authenticated");
                return;
            }

            const agentRef = firestore().collection('agents').doc(currentUser?.uid);

            const unsubscribeAgent = agentRef.onSnapshot((agentDoc) => {
                if (!agentDoc.exists) {
                    setAcceptedData([]);
                    return;
                }

                const acceptedRequests = agentDoc.data()?.accepted_requests || [];
                if (acceptedRequests.length === 0) {
                    setAcceptedData([]);
                    return;
                }

                const profilesCollection = firestore().collection('profiles');

                const unsubscribes = acceptedRequests.map(id =>
                    profilesCollection.doc(id).onSnapshot((profileDoc) => {
                        setAcceptedData(prevProfiles => {
                            const updatedProfiles = prevProfiles.filter(p => p.id !== profileDoc.id);
                            if (profileDoc.exists) {
                                updatedProfiles.push({ id: profileDoc.id, ...profileDoc.data() });
                            }
                            return updatedProfiles;
                        });
                    })
                );

                return () => unsubscribes.forEach(unsub => unsub());
            });

            return () => unsubscribeAgent();
        } catch (error) {
        }
    }


    return { getAgentsDetails, getAgentsCurrentDetails, getAgentsData, getProfilesData, getMatchingRequestData, getProfilesUploadedByAgent, acceptAssignRequest, rejectAssignRequest, getAgentsAcceptedProfiles }
}

export default useAgent