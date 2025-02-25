import { Dimensions, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Navigation } from 'lucide-react-native';

const {width, height, fontScale} = Dimensions.get('window');

const Welcome = ({navigation}) => {
    return (
        <SafeAreaView style={styles.safearea}>
            <ScrollView contentContainerStyle={styles.scrollview}>
                <View style={styles.main}>

                    <View style={styles.logoContainer}>
                        <Image
                            source={require('../../assets/logo.png')}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                    </View>

                    {/* Welcome Text */}
                    <Text style={styles.welcomeText}>Welcome to Teluguties!</Text>

                    {/* Tagline */}
                    <Text style={styles.tagline}>
                        Where hearts unite,{'\n'}
                        and bonds for life are tied!"
                    </Text>

                    {/* Illustration */}
                    <Image
                        source={require('../../assets/login.png')}
                        style={styles.illustration}
                        resizeMode="contain"
                    />

                    {/* Call to Action */}
                    <Text style={styles.ctaText}>Start your journey today!</Text>

                    {/* Welcome Button */}
                    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
                        <Text style={styles.buttonText}>Welcome</Text>
                    </TouchableOpacity>

                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default Welcome

const styles = StyleSheet.create({
    safearea: {
        flex: 1,
        backgroundColor: 'white',
    },
    scrollview: {
        flexGrow: 1,
    },
    main: {
        flex: 1,
        paddingHorizontal:20
    },
    logoContainer: {
        width: width * 0.7,
        height: 70,
        marginBottom: 50,
        alignSelf:'center',
        marginTop:50

      },
      logo: {
        width: '100%',
        height: '100%',
      },
      welcomeText: {
        fontSize: 24,
        fontWeight: '600',
        color: '#333',
        marginBottom: 30,
        textAlign: 'center',
      },
      tagline: {
        fontSize: 16,
        color: '#000',
        textAlign: 'center',
        marginBottom: 30,
        lineHeight: 24,
      },
      illustration: {
        width: width * 0.8,
        height: width * 0.8,
        marginBottom: 30,
        alignSelf:'center'
      },
      ctaText: {
        fontSize: 18,
        color: '#000',
        marginBottom: 20,
        textAlign: 'center',
      },
      button: {
        backgroundColor: '#7b2a38',
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 12,
        width: '100%',
        marginBottom:30,
      },
      buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
      },
})