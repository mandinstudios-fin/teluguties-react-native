import { Dimensions, Image, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Header from '../Header/Header'

const { width, height, fontScale } = Dimensions.get("window")

const UserProfileDetails = ({ route, navigation }) => {
  const { user } = route.params;

  return (
    <SafeAreaView style={styles.safearea}>
      <ScrollView>
        <View style={styles.main}>
          <Header navigation={navigation} />
          <View style={styles.boxContainer}>
            <View style={styles.box}></View>
          </View>
          <View style={styles.userdetails}>
            <View style={styles.imagecontainer}>
              <Image source={{ uri: user?.profile_pic }} style={styles.userimage} />
            </View>
            <View style={styles.name}>
              <Text style={styles.username}>{user?.personal_info?.name} <Text style={styles.userage}>24</Text></Text>
            </View>
            <View>
              <Text style={styles.namesubdata}>{user?.personal_info?.height}cm {`${user?.religious_cultural?.religion ? '/' : ''} ${user?.religious_cultural?.religion}`} {`${user?.professional_details?.occupation ? '/' : ''} ${user?.professional_details?.occupation}`}</Text>
            </View>
            <View>

            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default UserProfileDetails

const styles = StyleSheet.create({
  safearea: {
    flex: 1,
    backgroundColor: 'white',
  },
  main: {
    flexGrow: 1
  },
  boxContainer: {
    paddingHorizontal: 10
  },
  box: {
    backgroundColor: 'transparent',
    borderColor: '#AFAFAF',
    borderWidth: 0.5,
    height: 80,
    width: '100%',
    borderRadius: 15,
    marginBottom: 10
  },
  userdetails: {
    paddingHorizontal: width / 40
  },
  imagecontainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userimage: {
    width: width,
    height: height * 0.3,
    resizeMode: 'contain',
  },
  username: {
    color: '#000'
  },
  name: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  username: {
    fontSize: fontScale * 27,
    fontWeight: 'bold',
    color: '#752B35',
    margin: 0,
    padding: 0
  },
  userage: {
    fontWeight: 'bold',
    color: '#752B35',
    margin: 0,
    padding: 0,
    fontSize: fontScale * 20
  },
  namesubdata: {
    color: '#752B35',
    fontSize: fontScale * 14
  }
})