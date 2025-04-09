import auth from '@react-native-firebase/auth';
import { API_ENDPOINTS } from '../constants';
import api from '../constants/axios';

const useFirestore2 = () => {
    const uid = auth().currentUser?.uid;

    const createProfile = async (profilesData) => {
        try {
            const response = await api.post(API_ENDPOINTS.profilesGetHomeData, profilesData);

            return response.data;
        } catch (error) {
            console.error("Error fetching home data:", error);
            return null;
        }
    }

    const getHomeData = async () => {
        try {
            const response = await api.get(API_ENDPOINTS.profilesGetHomeData, {
                params: { uid },
            });

            return response.data;
        } catch (error) {
            console.error("Error fetching home data:", error);
            return null;
        }
    };

    const getHomeData2 = async () => {
        try {
            const response = await api.get(API_ENDPOINTS.profilesGetHomeData2);

            return response.data;
        } catch (error) {
            console.error("Error fetching home data:", error);
            return null;
        }
    };

    const getNewData = async () => {
        try {
            const response = await api.get(API_ENDPOINTS.profilesGetNewData, {
                params: { uid },
            });

            return response.data;
        } catch (error) {
            console.error("Error fetching home data:", error);
            return null;
        }
    };

    const getRecentlyViewedData = async () => {
        try {
            const response = await api.get(API_ENDPOINTS.profilesGetRecentlyViewedData, {
                params: { uid },
            });

            return response.data;
        } catch (error) {
            console.error("Error fetching home data:", error);
            return null;
        }
    };

    const getLikelyData = async () => {
        try {
            const response = await api.get(API_ENDPOINTS.profilesGetLikelyData, {
                params: { uid },
            });

            return response.data;
        } catch (error) {
            console.error("Error fetching home data:", error);
            return null;
        }
    };

    const getMatchesData = async () => {
        try {
            const response = await api.get(API_ENDPOINTS.profilesGetMatchesData, {
                params: { uid },
            });

            return response.data;
        } catch (error) {
            console.error("Error fetching home data:", error);
            return null;
        }
    };

    const fetchRequestDetails = async (toUid) => {
        try {
            const response = await api.get(API_ENDPOINTS.profilesFetchRequestDetails, {
                params: { fromUid: uid, toUid },
            });

            return response.data;
        } catch (error) {
            console.error("Error fetching home data:", error);
            return null;
        }
    };

    const getNotificationsData = async () => {
        try {
            const response = await api.get(API_ENDPOINTS.profilesGetNotificationsData, {
                params: { uid },
            });

            return response.data;
        } catch (error) {
            console.error("Error fetching home data:", error);
            return null;
        }
    };

    const makeAMatch = async (profileId) => {
        try {
            const response = await api.get(API_ENDPOINTS.profilesGetNotificationsData, {
                params: { uid, profileId },
            });

            return response.data;
        } catch (error) {
            console.error("Error fetching home data:", error);
            return null;
        }
    };


    const sendContactRequest = async (toUid) => {
        try {
            const response = await api.get(API_ENDPOINTS.profilesSendContactRequest, {
                params: { fromUid: uid, toUid },
            });

            return response.data;
        } catch (error) {
            console.error("Error fetching home data:", error);
            return null;
        }
    };

    const sendRequestToAgent = async (agentId) => {
        try {
            const response = await api.get(API_ENDPOINTS.profilesSendRequestToAgent, {
                params: { uid, agentId },
            });

            return response.data;
        } catch (error) {
            console.error("Error fetching home data:", error);
            return null;
        }
    };

    const sendMatchingRequestToAgent = async (profile_a_id, profile_b_id, agentId) => {
        try {
            const response = await api.get(API_ENDPOINTS.profilesSendMatchingRequestToAgent, {
                params: { profile_a_id, profile_b_id, agentId},
            });

            return response.data;
        } catch (error) {
            console.error("Error fetching home data:", error);
            return null;
        }
    };

    return {
        createProfile,
        getHomeData,
        getHomeData2,
        getNewData,
        getRecentlyViewedData,
        getLikelyData,
        getMatchesData,
        fetchRequestDetails,
        getNotificationsData,
        makeAMatch,
        sendContactRequest,
        sendRequestToAgent,
        sendMatchingRequestToAgent
    }
}

export default useFirestore2;