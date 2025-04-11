import auth from '@react-native-firebase/auth';
import { API_ENDPOINTS } from '../constants';
import api from '../constants/axios';
import { camelToSnakeCase } from '../utils';

const useAgent2 = () => {
    const uid = auth().currentUser?.uid;

    const createAgent = async (agentsData) => {
        try {
            console.log(agentsData)
            const response = await api.post(API_ENDPOINTS.agentsCreateAgent, agentsData);

            return response.data;
        } catch (error) {
            console.error("Error createAgent", error);
            return null;
        }
    };

    const agentsPartialUpdateAgentProfile = async (agentsData) => {
        try {
            const response = await api.patch(API_ENDPOINTS.agentsPartialUpdateAgentProfile, { uid, ...agentsData });

        } catch (error) {
            console.error("Error agentsPartialUpdateAgentProfile", error);
            return null;
        }
    };


    const agentsCheckAgentMailId = async (mail_id) => {
        try {
            await api.post(API_ENDPOINTS.agentsCheckAgentMailId, { mail_id });

            return true;
        } catch (error) {
            console.error("Error agentsPartialUpdateAgentProfile", error);
            return false;
        }
    };

    const agentsDeleteAgent = async () => {
        try {
            const response = await api.delete(API_ENDPOINTS.agentsDeleteAgent, { data: { uid } });

        } catch (error) {
            console.error("Error agentsDeleteAgent", error);
            return null;
        }
    };

    const getAgentsDetails = async (setAgentFormData) => {
        try {
            const response = await api.get(API_ENDPOINTS.agentsGetAgentDetails, {
                params: { uid },
            });

            setAgentFormData(response.data)
        } catch (error) {
            console.error("Error getAgentsDetails", error);
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
            console.error("Error getAgentsCurrentDetails", error);
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
            console.error("Error getAgentsData", error);
            return null;
        }
    };

    const getProfilesData = async (setData) => {
        try {
            const response = await api.get(API_ENDPOINTS.agentsGetAllProfiles, {
                params: { uid },
            });

            setData(response.data);
        } catch (error) {
            console.error("Error getProfilesData", error);
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
            console.error("Error getMatchingRequestData", error);
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
            console.error("Error fetching getProfilesUploadedByAgent", error);
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
            console.error("Error fetching acceptAssignRequest", error);
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
            console.error("Error fetching rejectAssignRequest", error);
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
            console.error("Error fetching getAgentsAcceptedProfiles", error);
            return null;
        }
    };

    return { createAgent, agentsPartialUpdateAgentProfile, getAgentsDetails, getAgentsCurrentDetails, getAgentsData, getProfilesData, getMatchingRequestData, getProfilesUploadedByAgent, acceptAssignRequest, rejectAssignRequest, getAgentsAcceptedProfiles, agentsCheckAgentMailId, agentsDeleteAgent }
}

export default useAgent2