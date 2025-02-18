import {
    ActivityIndicator,
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import React, { useState } from 'react';
import auth from '@react-native-firebase/auth';

const { width, height } = Dimensions.get('window');

const Category = ({ navigation, route }) => {
    const { formData } = route.params;
    const [category, setCategory] = useState('');
    const [uploading, setUploading] = useState();

    const handleCategory = async () => {
        setUploading(true);
        const confirmation = await auth().signInWithPhoneNumber(
            formData.selectedCode + formData.phoneNumber,
        );

        const isRegistration = true;
        const updatedFormData = {
            ...formData, category
        }
        navigation.replace('Otp', { confirmation, isRegistration, updatedFormData });
        setUploading(false);
    };

    return (
        <View style={styles.stepContainer}>
            <View style={styles.logo}>
                <Image style={styles.image} source={require('../../assets/logo.png')} />
            </View>
            <Text style={styles.header}>Create Profile</Text>

            <View style={styles.genderSelectionContainer}>
                {/* Male Selection */}
                <View style={styles.female}>
                    <TouchableOpacity
                        style={[
                            styles.genderButton,
                            category === 'individual' && styles.selectedGenderButton,
                        ]}
                        onPress={() => {
                            setCategory('individual');
                            console.log(formData)
                        }}>
                        {/* <FIcon color="#7b2a38" size={110} name="male" /> */}
                        <Image
                            source={require('../../assets/Indivisual.png')}
                            style={styles.genderimage}
                        />
                    </TouchableOpacity>
                    <Text style={styles.genderButtonText}>Individual</Text>
                </View>

                {/* Female Selection */}
                <View style={styles.female}>
                    <TouchableOpacity
                        style={[
                            styles.genderButton,
                            category === 'agent' && styles.selectedGenderButton,
                        ]}
                        onPress={() => {
                            setCategory('agent');
                            console.log(formData)
                        }}>
                        {/* <FIcon color="#7b2a38" size={110} name="female" /> */}
                        <Image
                            source={require('../../assets/Agent.png')}
                            style={styles.genderimage}
                        />
                    </TouchableOpacity>
                    <Text style={styles.genderButtonText}>Agent</Text>
                </View>
            </View>

            {/* Create Button with Opacity Change */}
            <TouchableOpacity
                onPress={handleCategory}
                style={[styles.button, { opacity: category ? 1 : 0.5 }]}
                disabled={!category}>
                <Text style={styles.buttontext}>Create</Text>
            </TouchableOpacity>
            <View style={uploading ? styles.loadingContainer : null}>
                {uploading && <ActivityIndicator size="large" color="#a4737b" />}
            </View>
        </View>
    );
};

export default Category;

const styles = StyleSheet.create({
    stepContainer: {
        flex: 1,
        padding: 20,
        borderColor: 'black',
        borderEndWidth: 2,
    },
    logo: {
        alignItems: 'center',
        marginBottom: 10,
    },

    image: {
        height: 60,
        width: 300,
        resizeMode: 'contain',
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'black',
        textAlign: 'center',
        marginTop: height * 0.1,
    },
    genderSelectionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: width * 0.05,
        marginTop: height * 0.05,
    },

    genderButton: {
        padding: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 100,
        aspectRatio: 1,
        height: width * 0.4,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    female: {
        display: 'flex',
        flexDirection: 'column',
    },

    selectedGenderButton: {
        backgroundColor: '#BE7356',
    },
    genderimage: {
        width: '100%',
        objectFit: 'contain',
    },

    genderButtonText: {
        color: '#BE7356',
        textAlign: 'center',
        fontSize: 20,
        fontWeight: '600',
    },
    button: {
        borderRadius: 12,
        backgroundColor: '#BE7356',
        width: '50%',
        padding: width / 30,
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 30,
    },
    buttontext: {
        textAlign: 'center',
        color: 'white',
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
});
