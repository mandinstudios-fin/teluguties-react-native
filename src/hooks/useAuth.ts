import auth from '@react-native-firebase/auth';
import ConfirmationResult from "@react-native-firebase/auth"
import { Alert } from "react-native";
import { TRegisterFormData } from "../types";
import { useState } from 'react';
import { CustomConfirmationResult } from '../utils/types';

const useAuth = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [otp, setOtp] = useState('');
    const [verificationId, setVerificationId] = useState();
    const [confirmation, setConfirmation] = useState(null);

    const userRegister = async (formData: TRegisterFormData, navigation) => {
        const fullPhoneNumber = formData.selectedCode + formData.phoneNumber;
        setLoading(true);

        try {
            console.log("enter")
            const confirmationResult = await auth().signInWithPhoneNumber(fullPhoneNumber);
            console.log(confirmationResult)
            setConfirmation(confirmationResult);
            setVerificationId(confirmationResult.verificationId)
            console.log(confirmation)
            console.log('OTP sent successfully.');
            navigation.navigate("Otp", { verificationId })
        } catch (err) {
            console.error('Error sending OTP:', err);
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    const verifyOtp = async (verificationId: string, otp: string, navigation: any) => {
        // if (!confirmation) {
        //     console.error('No confirmation result available.');
        //     return;
        // }

        try {
            // Verify the OTP and sign in the user
            await confirmation.confirm(otp)
            console.log('OTP verified successfully.');

            // Navigate to the success screen
            navigation.navigate("Success");
        } catch (err) {
            console.error('Error verifying OTP:', err);
        }
    };

    return {
        userRegister,
        otp,
        loading,
        error,
        setOtp, // Allow manual OTP input if needed
        verifyOtp
    };
};

export default useAuth;