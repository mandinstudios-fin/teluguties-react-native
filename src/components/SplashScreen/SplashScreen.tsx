import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
} from 'react-native';
import React from 'react';

const {width, height} = Dimensions.get('window');

const SplashScreen = () => {
  return (
    <SafeAreaView style={styles.safearea}>
      <View style={styles.main}>
        <View>
          <View style={styles.logo}>
            <Image
              style={styles.image}
              source={require('../../assets/logo.png')}
            />
          </View>
          <View style={styles.textbody}>
            <Text style={styles.text}>Find Your Perfect Match,</Text>
            <Text style={styles.text}>the Telugu Way!</Text>
          </View>
        </View>
        <View style={styles.footerbody}>
          <View style={styles.footer}>
            <Text style={styles.footertext}>
              Teluguties.in
            </Text>

            <Text style={styles.footertext}>
              24/7 Customer Service | ManDinStudios LLP | Hyderabad
            </Text>
          </View>
        </View>
      </View>
      
    </SafeAreaView>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  safearea: {
    flex: 1,
    position:'relative',
    backgroundColor:'#f5f5f5'
  },
  main: {
    flex:1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    marginTop: width / 10,
    height: height / 10,
    width: width,
    alignItems: 'center',
  },
  image: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain',
  },
  textbody: {
    marginTop: width / 20,
  },
  text: {
    textAlign: 'center',
    fontSize: 20,
    color: 'black'
  },
  footerbody: {
    position: 'absolute',
    bottom: width/20,
    left: 0,
    right: 0
  },
  footer:{
    textAlign:'center'
  },
  footertext: {
    textAlign: 'center',
    color: 'black'
  }
});
