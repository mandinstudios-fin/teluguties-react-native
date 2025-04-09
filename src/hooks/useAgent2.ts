import auth from '@react-native-firebase/auth';
import { API_ENDPOINTS } from '../constants';
import api from '../constants/axios';

const useAgent2 = () => {
    const uid = auth().currentUser?.uid;

    const getAgentsDetails = async (setAgentFormData) => {
        try {
            const response = await api.get(API_ENDPOINTS.agentsGetAgentDetails, {
                params: { uid },
            });

            return response.data;
        } catch (error) {
            console.error("Error fetching home data:", error);
            return null;
        }
    };

    const getAgentsCurrentDetails = async (setAgentsData) => {
        try {
            const response = await api.get(API_ENDPOINTS.agentsGetAgentCurrentDetails, {
                params: { uid },
            });

            return response.data;
        } catch (error) {
            console.error("Error fetching home data:", error);
            return null;
        }
    };

    const getAgentsData = async (setData) => {
        try {
            const response = await api.get(API_ENDPOINTS.agentsGetAllAgents, {
                params: { uid },
            });

            return response.data;
        } catch (error) {
            console.error("Error fetching home data:", error);
            return null;
        }
    };

    const getProfilesData = async (setData) => {
        try {
            const response = await api.get(API_ENDPOINTS.agentsGetAllProfiles, {
                params: { uid },
            });

            return response.data;
        } catch (error) {
            console.error("Error fetching home data:", error);
            return null;
        }
    };

    const getMatchingRequestData = async (setAssignedData) => {
        try {
            const response = await api.get(API_ENDPOINTS.agentsGetMatchingRequests, {
                params: { uid },
            });

            return response.data;
        } catch (error) {
            console.error("Error fetching home data:", error);
            return null;
        }
    };

    const getProfilesUploadedByAgent = async (setData) => {
        try {
            const response = await api.get(API_ENDPOINTS.agentsGetProfilesUploadedByAgent, {
                params: { uid },
            });

            return response.data;
        } catch (error) {
            console.error("Error fetching home data:", error);
            return null;
        }
    };

    const acceptAssignRequest = async (user_id) => {
        try {
            const response = await api.get(API_ENDPOINTS.agentsAcceptAssignRequest, {
                params: { uid, user_id },
            });

            return response.data;
        } catch (error) {
            console.error("Error fetching home data:", error);
            return null;
        }
    };

    const rejectAssignRequest = async (user_id) => {
        try {
            const response = await api.get(API_ENDPOINTS.agentsRejectAssignRequest, {
                params: { uid, user_id },
            });

            return response.data;
        } catch (error) {
            console.error("Error fetching home data:", error);
            return null;
        }
    };

    const getAgentsAcceptedProfiles = async (setAcceptedData) => {
        try {
            const response = await api.get(API_ENDPOINTS.agentsGetAcceptedProfiles, {
                params: { uid },
            });

            return response.data;
        } catch (error) {
            console.error("Error fetching home data:", error);
            return null;
        }
    };

    return { getAgentsDetails, getAgentsCurrentDetails, getAgentsData, getProfilesData, getMatchingRequestData, getProfilesUploadedByAgent, acceptAssignRequest, rejectAssignRequest, getAgentsAcceptedProfiles }
}

export default useAgent2