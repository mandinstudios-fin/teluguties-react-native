import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

import Icon from 'react-native-vector-icons/Ionicons';

const Header = ({ navigation }) => {
  return (
    <SafeAreaView>
        <View>
        <View style={styles.topsection}>
          <TouchableOpacity onPress={() => navigation.navigate("ProfileDetails")} style={styles.profile}></TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
            <Icon name="menu" size={40} color="#AFAFAF" />
          </TouchableOpacity>
        </View>

        <View style={styles.logo}>
          <Image
            style={styles.image}
            source={require('../../assets/logo.png')}
          />
        </View>
        </View>
    </SafeAreaView>
  )
}

export default Header

const styles = StyleSheet.create({

    main: {
        backgroundColor: 'white',
        
      },
      topsection:{
        paddingHorizontal:10,
        paddingTop: 10,
        display:'flex',
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center'
      },
    
      profile:{
        backgroundColor:'#AFAFAF',
        height:50,
        width:50,
        borderRadius:200
      },
    
      logo: {
        alignItems: 'center',
        marginBottom:10
      },
    
      image: {
        height: 100,
        width: 300,
        resizeMode: 'contain',
      },
})