import auth from '@react-native-firebase/auth';
import api from '../constants/axios';
import { API_ENDPOINTS } from '../constants';

const useUpdateUserDetails2 = () => {
    const uid = auth().currentUser?.uid;

    const getCurrentUserDetails = async () => {
        try {
            const response = await api.get(API_ENDPOINTS.profilesGetCurrentUserDetails, {
                params: { uid },
            });

            return response.data;
        } catch (error) {
            console.error("Error fetching home data:", error);
            return null;
        }
    };

    const getUserDetails = async () => {
        try {
            const response = await api.get(API_ENDPOINTS.profilesGetUserDetails, {
                params: { uid },
            });

            return response.data;
        } catch (error) {
            console.error("Error fetching home data:", error);
            return null;
        }
    };

    const handleUserUpdate = async (userData, setUserData,setFirestoreData) => {
        try {
            const response = await api.patch(API_ENDPOINTS.profilesPartialUpdateUserProfile, {
                uid, user_data: userData,
            });

            return response.data;
        } catch (error) {
            console.error("Error fetching home data:", error);
            return null;
        }
    };

    const handleProfileImages = async (imageUri, imageType, imageName, userData, setUserData, setFirestoreData) => {
        const formData = new FormData();
        formData.append('phone', userData?.contactInformation?.phone);
        formData.append('profile_picture', {
            uri: imageUri,
            type: imageType,
            name: imageName
        });

        try {
            const response = await api.post(API_ENDPOINTS.profilesUploadProfilePicture,
                formData,
                {
                    'headers': {
                        'Content-Type': 'multipart/form-data',
                    },
                },
            );

            return response.data;
        } catch (error) {
            console.error("Error fetching home data:", error);
            return null;
        }
    };

    const profilesUploadMultipleImages = async (imageFiles, phone) => {
        const formData = new FormData();
        formData.append('phone',phone);

        imageFiles.forEach((file, i) => {
            formData.append('images', {
                uri: file?.uri,
                type: file?.type,
                name: file?.name,
            });
        });

        try {
            const response = await api.post(API_ENDPOINTS.profilesUploadMultipleImages,
                formData,
                {
                    'headers': {
                        'Content-Type': 'multipart/form-data',
                    },
                },
            );

            return response.data;
        } catch (error) {
            console.error("Error fetching home data:", error);
            return null;
        }
    };

    const profilesDeleteAllImages = async (phone) => {
        try {
            const response = await api.delete(API_ENDPOINTS.profilesDeleteAllImages, {
                params: {
                    phone,
                },
            });

            return response.data;
        } catch (error) {
            console.error("Error fetching home data:", error);
            return null;
        }
    };

    return {
        getCurrentUserDetails,
        getUserDetails,
        handleUserUpdate,
        handleProfileImages,
        profilesUploadMultipleImages,
        profilesDeleteAllImages
    }
}

export default useUpdateUserDetails2;