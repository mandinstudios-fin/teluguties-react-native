import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { Timestamp } from '@react-native-firebase/firestore';
import useToastHook from '../utils/useToastHook';
import { useCallback, useState } from 'react';
import { useNavigation } from '@react-navigation/native';

const useFirestore = () => {
    const currentUser = auth().currentUser;
    const { successToast, errorToast } = useToastHook();
    const [loading, setLoading] = useState(false);
    const [requestData, setRequestData] = useState(null);
    const navigation = useNavigation();

    const getHomeData = () => {
        return new Promise((resolve, reject) => {
            if (!currentUser) {
                resolve([]);
                return;
            }

            firestore()
                .collection('profiles')
                .doc(currentUser.uid)
                .get()
                .then(userDoc => {
                    const userData = userDoc.data();
                    if (!userData) {
                        resolve([]);
                        return;
                    }

                    const userGender = userData.personal_info.gender;
                    const genderFilter = userGender === 'Male' ? 'Female' : 'Male';

                    const unsubscribe = firestore()
                        .collection('profiles')
                        .where('personal_info.gender', '==', genderFilter)
                        .onSnapshot(
                            snapshot => {
                                const usersList = snapshot.docs
                                    .map(doc => ({
                                        id: doc.id,
                                        ...doc.data(),
                                    }))
                                    .filter(user => user.id !== currentUser.uid);

                                resolve(usersList);
                            },
                            error => reject(error),
                        );

                    return unsubscribe;
                })
                .catch(reject);
        });
    };

    const getNewData = () => {
        return new Promise((resolve, reject) => {
            try {
                const today = new Date();
                const startOfDay = new Date(today.setHours(0, 0, 0, 0));
                const endOfDay = new Date(today.setHours(23, 59, 59, 999));

                const startTimestamp = firestore.Timestamp.fromDate(startOfDay);
                const endTimestamp = firestore.Timestamp.fromDate(endOfDay);

                firestore()
                    .collection('profiles')
                    .doc(currentUser?.uid)
                    .get()
                    .then(userDoc => {
                        const userData = userDoc.data();
                        if (!userData) {
                            resolve([]);
                            return;
                        }
                        const userGender = userData.personal_info.gender;
                        const genderFilter = userGender === 'Male' ? 'Female' : 'Male';

                        const unsubscribe = firestore()
                            .collection('profiles')
                            .where('createdAt', '>=', startTimestamp)
                            .where('createdAt', '<=', endTimestamp)
                            .where('personal_info.gender', '==', genderFilter)
                            .onSnapshot(
                                snapshot => {
                                    const users = snapshot.docs
                                        .map(doc => ({
                                            id: doc.id,
                                            ...doc.data(),
                                        }))
                                        .filter(user => user.id !== currentUser?.uid);

                                    resolve(users);
                                },
                                error => {
                                    reject(error);
                                },
                            );
                        return unsubscribe;
                    });
            } catch (error) {
                reject(error);
            }
        });
    };

    const getShortListData = async () => {
        return new Promise((resolve, reject) => {
            try {
                if (!currentUser) {
                    resolve([]);
                    return;
                }

                const userRef = firestore().collection('profiles').doc(currentUser.uid);


                const unsubscribe = userRef.onSnapshot(async userDoc => {
                    if (!userDoc.exists) {
                        resolve([]);
                        return;
                    }

                    const shortlistedProfiles = userDoc?.data()?.shortlisted || [];
                    if (shortlistedProfiles.length === 0) {
                        resolve([]);
                        return;
                    }

                    const usersMap = new Map();
                    let completedCount = 0;

                    shortlistedProfiles.forEach(userId => {
                        firestore()
                            .collection('profiles')
                            .doc(userId)
                            .onSnapshot(userSnapshot => {
                                if (userSnapshot.exists) {
                                    const userData = {
                                        id: userSnapshot.id,
                                        ...userSnapshot.data(),
                                    };
                                    usersMap.set(userSnapshot.id, userData);
                                }

                                completedCount++;
                                if (completedCount === shortlistedProfiles.length) {
                                    resolve(Array.from(usersMap.values()));
                                }
                            });
                    });
                });

                return unsubscribe;
            } catch (error) {
                console.error('Error fetching real-time recently viewed data:', error);
                reject(error);
            }
        });
    };

    const getRecentlyViewedData = () => {
        return new Promise((resolve, reject) => {
            try {
                if (!currentUser) {
                    resolve([]);
                    return;
                }

                const userRef = firestore().collection('profiles').doc(currentUser.uid);


                const unsubscribe = userRef.onSnapshot(async userDoc => {
                    if (!userDoc.exists) {
                        resolve([]);
                        return;
                    }

                    const recentlyViewed = userDoc?.data()?.recentlyViewed || [];
                    if (recentlyViewed.length === 0) {
                        resolve([]);
                        return;
                    }

                    const usersMap = new Map();
                    let completedCount = 0;

                    recentlyViewed.forEach(userId => {
                        firestore()
                            .collection('profiles')
                            .doc(userId)
                            .onSnapshot(userSnapshot => {
                                if (userSnapshot.exists) {
                                    const userData = {
                                        id: userSnapshot.id,
                                        ...userSnapshot.data(),
                                    };
                                    usersMap.set(userSnapshot.id, userData);
                                }

                                completedCount++;
                                if (completedCount === recentlyViewed.length) {
                                    resolve(Array.from(usersMap.values()));
                                }
                            });
                    });
                });

                return unsubscribe;
            } catch (error) {
                console.error('Error fetching real-time recently viewed data:', error);
                reject(error);
            }
        });
    };

    const getLikelyData = () => {
        return new Promise((resolve, reject) => {
            try {
                const unsubscribe = firestore()
                    .collection('profiles')
                    .onSnapshot(async (snapshot) => {
                        if (!currentUser) {
                            resolve([]);
                            return;
                        }

                        try {
                            const userDoc = await firestore().collection('profiles').doc(currentUser.uid).get();
                            if (!userDoc.exists) {
                                resolve([]);
                                return;
                            }

                            const userDataFirestore = userDoc.data();
                            const religion = userDataFirestore?.religious_cultural?.religion;
                            const gender = userDataFirestore?.personal_info?.gender;

                            if (!religion || !gender) {
                                resolve([]);
                                return;
                            }

                            const oppositeGender = gender === 'Male' ? 'Female' : 'Male';


                            const matchingDocs = snapshot.docs.filter(doc => {
                                const data = doc.data();
                                return (
                                    data.religious_cultural?.religion === religion &&
                                    data.personal_info?.gender === oppositeGender
                                );
                            });


                            const matchedUsersData = matchingDocs.map(doc => {
                                if (doc.id !== currentUser.uid) {
                                    return { id: doc.id, ...doc.data() };
                                }
                                return null;
                            });

                            const filteredMatchedUsers = matchedUsersData.filter(user => user !== null);

                            if (filteredMatchedUsers.length === 0) {
                                resolve([]);
                                return;
                            }
                            resolve(filteredMatchedUsers);
                        } catch (error) {
                            reject(error);
                        }
                    });
                return unsubscribe;
            } catch (error) {
                reject(error);
            }
        });
    };

    const getMatchesData = () => {
        return new Promise((resolve, reject) => {
            if (!currentUser) {
                resolve([]);
                return;
            }

            try {
                const userRef = firestore().collection('profiles').doc(currentUser.uid);

                // Listen to changes in the current user's profile
                const unsubscribe = userRef.onSnapshot((userDoc) => {
                    if (!userDoc.exists) {
                        resolve([]);
                        return;
                    }

                    const matchesIds = userDoc.data()?.matches || [];
                    if (matchesIds.length === 0) {
                        resolve([]);
                        return;
                    }

                    const userMap = new Map();
                    let completed = 0;

                    matchesIds.forEach((userId) => {
                        firestore()
                            .collection('profiles')
                            .doc(userId)
                            .onSnapshot((snapshot) => {
                                if (snapshot.exists) {
                                    userMap.set(snapshot.id, {
                                        id: snapshot.id,
                                        ...snapshot.data(),
                                    });
                                }

                                completed++;
                                if (completed === matchesIds.length) {
                                    resolve([...userMap.values()]);
                                }
                            });
                    });
                });

                return unsubscribe;
            } catch (error) {
                reject(error);
            }
        });
    };


    const fetchRequestDetails = useCallback(async (toUid) => {
        const fromUid = auth().currentUser?.uid;
        if (!fromUid || !toUid) return;

        setLoading(true);
        try {
            const requestRef = firestore()
                .collection('requests')
                .where('fromUid', '==', fromUid)
                .where('toUid', '==', toUid);

            const unsubscribe = requestRef.onSnapshot((snapshot) => {
                if (!snapshot.empty) {
                    setRequestData(snapshot.docs[0].data());
                } else {
                    setRequestData(null);
                }
            });

            return unsubscribe; // Return unsubscribe function for cleanup
        } catch (error) {
            errorToast('Failed to fetch request details');
        } finally {
            setLoading(false);
        }
    }, [errorToast]);

    const getNotificationsData = useCallback(async (setNotificationsData) => {
        if (!currentUser) setNotificationsData([]);

    try {
        const userDoc = await firestore()
            .collection('profiles')
            .doc(currentUser?.uid)
            .get();

        if (!userDoc.exists) setNotificationsData([]);

        const userData = userDoc.data();
        const notifications = userData.notifications || [];

        setNotificationsData(notifications)
    } catch (error) {
        console.error('Error fetching notifications:', error);
        setNotificationsData([]);
    }
    }, [currentUser]);

    const addToShortlist = useCallback(async (profileId) => {
        setLoading(true);
        try {
            if (!currentUser) return;

            const userRef = firestore().collection('profiles').doc(currentUser.uid);
            const userDoc = await userRef.get();
            const shortlistedProfiles = userDoc.data()?.shortlisted || [];

            if (shortlistedProfiles.includes(profileId)) {
                successToast('Profile is already in your shortlist');
                return;
            }

            await userRef.update({
                shortlisted: firestore.FieldValue.arrayUnion(profileId),
            });

            successToast('Added to shortlist');
        } catch {
            errorToast('Something went wrong');
        } finally {
            setLoading(false);
        }
    }, [successToast, errorToast]);

    const makeAMatch = useCallback(async (profileId) => {
        setLoading(true);
        try {
            const currentUser = auth().currentUser;
            if (!currentUser) return;

            const userRef = firestore().collection('profiles').doc(currentUser.uid);
            const userDoc = await userRef.get();
            const matchedProfiles = userDoc.data()?.matches || [];

            if (matchedProfiles.includes(profileId)) {
                successToast('Profile is already in your matches');
                return;
            }

            await userRef.update({
                matches: firestore.FieldValue.arrayUnion(profileId),
            });

            successToast('Added to matches');
            navigation.replace('Layout')
        } catch {
            errorToast('Something went wrong');
        } finally {
            setLoading(false);
        }
    }, [successToast, errorToast]);

    const sendContactRequest = useCallback(async (toUid) => {
        setLoading(true);
        const fromUid = auth().currentUser?.uid;

        if (!fromUid) return;

        try {
            const existingRequestQuery = await firestore()
                .collection('requests')
                .where('fromUid', '==', fromUid)
                .where('toUid', '==', toUid)
                .get();

            if (!existingRequestQuery.empty) {
                errorToast('Request already sent');
                return;
            }

            await firestore().collection('requests').add({
                fromUid,
                toUid,
                status: 'pending',
                timestamp: firestore.FieldValue.serverTimestamp(),
            });

            successToast('Request sent successfully');
            fetchRequestDetails(toUid); // Refresh request data
        } catch {
            errorToast('Something went wrong');
        } finally {
            setLoading(false);
        }
    }, [errorToast, successToast, fetchRequestDetails]);

    const sendRequestToAgent = async (agentId) => {
        try {
        
            if (!currentUser) {
              console.error("User not authenticated");
              return;
            }
        
            const agentRef = firestore().collection('agents').doc(agentId);
            const agentDoc = await agentRef.get();

            const requests = agentDoc.data()?.requests || [];

            if (requests.includes(currentUser.uid)) {
                successToast('Request already sent');
                return;
            }

            await agentRef.update({
                requests: firestore.FieldValue.arrayUnion(currentUser.uid)
              });
        
            successToast('Request sent successfully')
          } catch (error) {
            errorToast('Request already sent')
          }
    }

    const sendMatchingRequestToAgent = async (profile_a_id, profile_b_id, agent_id) => {
        try {
            const agentRef = firestore().collection('agents').doc(agent_id);
            const agentDoc = await agentRef.get();

            const requests = agentDoc.data()?.requests || [];

            if (requests.includes(profile_a_id)) {
                successToast('Request already sent');
                return;
            }

            const alreadyRequested = requests.some(
                (req) => req.profile_a_id === profile_a_id && req.profile_b_id === profile_b_id
            );
    
            if (alreadyRequested) {
                successToast('Request already sent');
                return;
            }

            const profile_a_id_Ref = firestore().collection('profiles').doc(profile_a_id);
            const profile_a_id_Doc = await profile_a_id_Ref.get();

            const agent_assigned = profile_a_id_Doc.data()?.agent_assigned || [];
            const alreadyAssigned = agent_assigned.some(
                (req) => req.agent_id === agent_id && req.profile_b_id === profile_b_id
            );

            if (alreadyAssigned) {
                successToast('Request already sent');
                return;
            }

            const newProfileInAssignedAgents = {
                agent_id: agent_id,
                profile_b_id: profile_b_id
            }

            await profile_a_id_Ref.update({
                agent_assigned: firestore.FieldValue.arrayUnion(newProfileInAssignedAgents)
              });

            const newRequest = {
                profile_a_id: profile_a_id,
                profile_b_id: profile_b_id
            }

            await agentRef.update({
                requests: firestore.FieldValue.arrayUnion(newRequest)
              });
        
            successToast('Request sent successfully');
            navigation.replace("Layout");
          } catch (error) {
            errorToast('Request already sent')
          }
    }


    return {
        getHomeData,
        getNewData,
        getShortListData,
        getRecentlyViewedData,
        getLikelyData,
        getMatchesData,
        loading,
        requestData,
        fetchRequestDetails,
        addToShortlist,
        makeAMatch,
        sendContactRequest,
        sendRequestToAgent,
        getNotificationsData,
        sendMatchingRequestToAgent
    };
};

export default useFirestore;
