import { Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Header from '../Header/Header'

const {width, height} = Dimensions.get('window');

const CreateProfile = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.safearea}>
        <ScrollView style={styles.main}>
            <Header navigation={navigation}/>
            <View style={styles.container}>
              <View style={styles.profile} >
                <Text style={styles.profiletext}>CREATE PROFILE</Text>
              </View>
              <View>
                <TextInput
                style={styles.input}
                placeholder='First Name'
                placeholderTextColor="#EBC7B1"
                />
              </View>
              <View>
                <TextInput
                placeholder='Last Name'
                style={styles.input}
                placeholderTextColor="#EBC7B1"
                />
              </View>
              <View>
                <TextInput
                placeholder='Gender'
                style={styles.input}
                placeholderTextColor="#EBC7B1"
                />
              </View>
              <View>
                <TextInput 
                placeholder='Phone Number'
                style={styles.input}
                placeholderTextColor="#EBC7B1"
                />
              </View>
              <View>
                <TextInput 
                placeholder='Community'
                style={styles.input}
                placeholderTextColor="#EBC7B1"
                />
              </View>
              <View>
                <TextInput 
                placeholder='Place'
                style={styles.input}
                placeholderTextColor="#EBC7B1"
                />
              </View>
              <View>
                <TextInput 
                placeholder='Date of Birth'
                style={styles.input}
                placeholderTextColor="#EBC7B1"
                />
              </View>
              <TouchableOpacity style={styles.creat}>
                <Text style={styles.creattext}>Create Profile</Text>
              </TouchableOpacity>
            </View>
            
            
        </ScrollView>
    </SafeAreaView>
  )
}

export default CreateProfile

const styles = StyleSheet.create({
  safearea:{
    flex:1,
    backgroundColor:'white',
  },
  main:{
    flexGrow:1,
  },
  container:{
    backgroundColor:'#f5f5f5',
    flex:1,
    gap: width/30,
    paddingLeft:width/20,
    paddingRight:width/20,
    paddingBottom: width / 30
  },
  profile:{
    alignItems:'center',
    padding:20,
  },
  profiletext:{
    fontSize:25,
    color:'#792A37'
  },
  input:{
    borderColor: '#EBC7B1',
    borderWidth: 1,
    borderRadius: 12,
    paddingLeft: width / 40,
    color:'#EBC7B1'
  },
  creat:{
    borderRadius:12,
    backgroundColor:'#a4737b',
    padding:width/30
  },
  creattext:{
    color:'white',
    textAlign:'center',
  }

})