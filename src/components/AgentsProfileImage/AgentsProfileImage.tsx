import { StyleSheet, Text, View, Image, Dimensions, TouchableOpacity, Animated } from 'react-native';
import React, { useState, useEffect } from 'react';
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import LinearGradient from 'react-native-linear-gradient';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';
import { getFirstName, getUsersAge } from '../../utils';
import IIcon from 'react-native-vector-icons/FontAwesome6';

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
                <TouchableOpacity style={styles.touchable} onPress={handleProfile}>
                    {agent?.profilepic ? <Image source={{ uri: agent.profilepic || 'https://img.freepik.com/premium-vector/default-image-icon-vector-missing-picture-page-website-design-mobile-app-no-photo-available_87543-11093.jpg?w=996' }} style={styles.image} /> : <View style={styles.image} />}
                    <LinearGradient
                        colors={['rgba(255, 255, 255, 0.3)', 'rgba(0, 0, 0, 0.5)']}
                        style={styles.overlay}
                    >
                        <Text style={styles.name}>{getFirstName(agent?.fullname)} </Text>
                        <Text style={styles.subname}>
                            <Text>4</Text>
                            <IIcon name="star" color={'white'} size={17} />

                        </Text>
                    </LinearGradient>
                </TouchableOpacity>
            }
        </>
    );
};

export default AgentsProfileImage;

const styles = StyleSheet.create({
    container: {
        width: IMAGE_SIZE,
        height: IMAGE_SIZE,
        position: 'relative',
        aspectRatio: 3 / 4,
        borderRadius: 12,
        overflow: 'hidden',
    },
    touchable: {
        width: IMAGE_SIZE,
        height: IMAGE_SIZE,
        position: 'relative',
        aspectRatio: 3 / 4,
        borderRadius: 12,
        overflow: 'hidden',
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
        color: 'white',
        fontWeight: 'bold',
        paddingLeft: width / 80,
        fontSize: 15,
    },
    userage: {
        fontSize: 12,
    },
    subname: {
        paddingLeft: width / 80,
        paddingBottom: width / 80,
        color: 'white',
        marginTop:width/80
    },

});
