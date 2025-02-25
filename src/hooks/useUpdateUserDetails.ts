import React, { useState } from 'react'
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import useToastHook from '../utils/useToastHook';


const useUpdateUserDetails = () => {
    const [uploading, setUploading] = useState(false);
    const { successToast, errorToast } = useToastHook();
    const currentUser = auth().currentUser;

    const getCurrentUserDetails = async (setUserData, setFirestoreData) => {
        if (!currentUser) return;

        try {
            const userDoc = await firestore().collection('profiles').doc(currentUser.uid).get();
            if (userDoc.exists) {
                const userDataFirestore = userDoc.data();
                setUserData(userDataFirestore);
                setFirestoreData(userDataFirestore);
            }
        } catch (error) {
            errorToast('Failed to fetch user details', error);
            console.log(error)
        }
    };

    const getUserDetails = async () => {
        if (!currentUser) return;

        try {
            const userDoc = await firestore().collection('profiles').doc(currentUser.uid).get();
            if (userDoc.exists) {
                const userDataFirestore = userDoc.data();
                return userDataFirestore
            }
        } catch (error) {
            errorToast('Failed to fetch user details');
        }
    };

    const handleUserUpdate = async (userData, setUserData,setFirestoreData) => {
        if (!currentUser) return;

        const updatedData = {
            ...userData,
            updatedAt: firestore.FieldValue.serverTimestamp(),
        };
        setUploading(true);

        try {
            await firestore().collection('profiles').doc(currentUser.uid).update(updatedData);
            successToast('Details Updated');
            getCurrentUserDetails(setUserData, setFirestoreData);
        } catch (error) {
            errorToast('Something Went Wrong');
        } finally {
            setUploading(false);
        }
    };

    const uploadImageToFirebase = async (imageUri) => {
        if (!imageUri) return null;
        const fileName = imageUri.split('/').pop();
        const uniqueFileName = `${Date.now()}_${fileName}`;
        const reference = storage().ref(`profile-images/${uniqueFileName}`);
        setUploading(true);

        try {
            await reference.putFile(imageUri);
            const downloadUrl = await reference.getDownloadURL();
            successToast('Image Uploaded');
            return downloadUrl;
        } catch (error) {
            errorToast('Error uploading image');
            return null;
        } finally {
            setUploading(false);
        }
    };

    const handleProfileImages = async (imageUri, userData, setUserData,setFirestoreData) => {
        if (!currentUser) return;

        const downloadUrl = await uploadImageToFirebase(imageUri);
        const updatedData = {
            ...userData,
            contactInformation: {
                ...userData.contactInformation,
                profilePicture: downloadUrl,   
            },
            updatedAt: firestore.FieldValue.serverTimestamp(),
        };

        try {
            await firestore().collection('profiles').doc(currentUser.uid).update(updatedData);
            successToast('Profile Image Updated');
            getCurrentUserDetails(setUserData,setFirestoreData);
        } catch (error) {
            errorToast('Something Went Wrong');
        }
    };

    const deleteProfileImage = async (userData, setUserData,setFirestoreData) => {
        if (!currentUser) return;

        const updatedData = {
            ...userData,
            contactInformation: {
                ...userData.contactInformation,
                profilePicture: ''  
            },
            images: [],
            updatedAt: firestore.FieldValue.serverTimestamp(),
        };

        try {
            await firestore().collection('profiles').doc(currentUser.uid).update(updatedData);
            successToast('Profile Image Deleted');
            getCurrentUserDetails(setUserData,setFirestoreData);
        } catch (error) {
            errorToast('Something Went Wrong');
        }
    };

    return {
        uploading,
        getCurrentUserDetails,
        handleUserUpdate,
        handleProfileImages,
        deleteProfileImage,
        getUserDetails,
    };
};

export default useUpdateUserDetails