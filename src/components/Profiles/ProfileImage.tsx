import { StyleSheet, Text, View, Image, Dimensions, TouchableOpacity } from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');
const IMAGE_SIZE = width / 2 - 25; // Two columns with some spacing

const ProfileImage = ({ imgSource, name }) => {
  return (
    <TouchableOpacity style={styles.container}>
      <Image source={imgSource} style={styles.image} />
      <LinearGradient 
        colors={['rgba(255, 255, 255, 0.3)', 'rgba(0, 0, 0, 0.5)']} // Transition from transparent white to semi-transparent black
        style={styles.overlay}
        > 
        <Text style={styles.name}>{name}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default ProfileImage;

const styles = StyleSheet.create({
  container: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE ,
    position: 'relative',
    aspectRatio: 3 / 4,
    borderRadius: 12,
    overflow: 'hidden',
    marginLeft: width / 50,
    marginRight: width / 50,
    marginBottom: width/25,
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
  },
});
