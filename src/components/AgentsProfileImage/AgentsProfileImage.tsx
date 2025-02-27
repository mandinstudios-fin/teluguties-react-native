import { StyleSheet, Text, View, Image, Dimensions, TouchableOpacity, Animated } from 'react-native';
import React, { useState, useEffect } from 'react';
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import LinearGradient from 'react-native-linear-gradient';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';
import { getFirstName, getUsersAge } from '../../utils';
import IIcon from 'react-native-vector-icons/FontAwesome6';
import { ChevronRight, MapPin, Star } from 'lucide-react-native';

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient)
const shimmerColors = ['#D0D0D0', '#E5E5E5', '#D0D0D0'];


const { width } = Dimensions.get('window');
const IMAGE_SIZE = width / 2 - 25; // Two columns with some spacing

const AgentsProfileImage = ({ agent, navigation }) => {
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, []);



    const handleProfile = () => {
        navigation.navigate("AgentsProfileDetails", { agent, navigation });
    }

    return (
        <>
            {loading ?
                <ShimmerPlaceholder style={styles.container} shimmerColors={shimmerColors} linearGradientProps={{
                    colors: shimmerColors, // Gradient colors
                    start: { x: 0, y: 0 },
                    end: { x: 1, y: 0 },
                }}>
                </ShimmerPlaceholder>
                :
                <TouchableOpacity key={agent.id} style={styles.touchable} onPress={handleProfile}>
                    <Image source={{ uri: agent?.profilepic }} style={styles.cardImage} />
                    <View style={styles.cardContent}>
                        <Text style={styles.name}>{agent?.fullname || "Name Not Specified"}</Text>
                        <View style={styles.locationRedirectContainer}>
                            <View style={styles.locationContainer}>
                                <MapPin size={16} color="#666" />
                                <Text style={styles.location}>{agent.location || 'Location Not Specified'}</Text>
                            </View>
                            <TouchableOpacity onPress={handleProfile}><ChevronRight size={24} color="#666" /></TouchableOpacity>
                        </View>
                        <View style={[styles.locationRedirectContainer, { justifyContent: 'flex-start', gap: 5 }]}>
                            <Text style={styles.age}>{agent.rating || '4'}</Text>
                            <Star size={20} color={'#000'} strokeWidth={1} />
                        </View>
                    </View>
                </TouchableOpacity>
            }
        </>
    );
};

export default AgentsProfileImage;

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 120,
        position: 'relative',
        borderRadius: 12,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: 'white',
        padding: 12
    },
    touchable: {
        width: '100%',
        height: 120,
        position: 'relative',
        borderRadius: 12,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'row',
        elevation: 5,
        backgroundColor: 'white',
        padding: 12
    },
    image: {
        height: '100%',
        objectFit: 'cover',
    },
    overlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    name: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 18,
    },
    userage: {
        fontSize: 12,
    },
    subname: {
        paddingLeft: width / 80,
        paddingBottom: width / 80,
        color: 'white',
        marginTop: width / 80
    },
    profileCard: {
        flexDirection: 'row',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        alignItems: 'center',
    },
    cardImage: {
        width: 120,
        height: '100%',
        borderRadius: 8,
        marginRight: 12,
    },
    cardContent: {
        flex: 1,
        justifyContent: 'space-between',
        paddingVertical: 7
    },
    locationRedirectContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row'
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 2,
    },
    location: {
        color: '#666',
        marginLeft: 4,
        fontSize: 12,
    },
    age: {
        color: '#666',
    },

});
