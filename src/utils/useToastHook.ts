import { useToast } from 'react-native-toast-notifications'

const useToastHook = () => {
    const toast = useToast();

    const successToast = (message: string) => {
        toast.show(message, { type: 'success' });
    }

    const errorToast = (message: string) => {
        toast.show(message, { type: 'danger' });
    }

    return {
        successToast, errorToast
    }
};

export default useToastHook;