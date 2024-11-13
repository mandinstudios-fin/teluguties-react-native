import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Header from '../Header/Header'

const UserProfileDetails = ({ route }) => {
  const { user,navigation } = route.params
  return (
    <View>

      {/* <SafeAreaView style={styles.safearea}>
        <View style={styles.main}>
          <Header navigation={navigation} /> */}
          <View >
            <Text>{user?.name}</Text>
            <Text>{user?.gender}</Text>
            <Text>{user?.phoneno}</Text>
            <Text>{user?.community}</Text>
            <Text>{user?.place}</Text>
            <Text>{user?.dob}</Text>
            <Text>{user?.email}</Text>
            <Text>{user?.religion}</Text>
            <Text>{user?.caste}</Text>
            <Text>{user?.country}</Text>
            <Text>{user?.state}</Text>
            <Text>{user?.city}</Text>
            <Text>{user?.address}</Text>
            <Text>{user?.maritialstatus}</Text>
            <Text>{user?.children}</Text>
            <Text>{user?.age}</Text>
            <Text>{user?.education}</Text>
            <Text>{user?.occupation}</Text>
            <Text>{user?.nationality}</Text>
            <Text>{user?.passport}</Text>
            <Text>{user?.income}</Text>
            <Text>{user?.drinking}</Text>
            <Text>{user?.smoking}</Text>
            <Text>{user?.weight}</Text>
            <Text>{user?.height}</Text>
            <Text>{user?.built}</Text>
            <Text>{user?.complexion}</Text>
            <Text>{user?.haircolor}</Text>
            <Text>{user?.eyecolor}</Text>
            <Text>{user?.culture}</Text>
            <Text>{user?.about}</Text>
            <Text>{user?.diet}</Text>
            <Text>{user?.lifestyle}</Text>
            <Text>{user?.purpose}</Text>
            <Text>{user?.weddingplan}</Text>
            <Text>{user?.familystatus}</Text>
            <Text>{user?.visatype}</Text>
            <Text>{user?.relocate}</Text>
            <Text>{user?.manglik}</Text>
            <Text>{user?.countryborn}</Text>
            <Text>{user?.countrygrew}</Text>
          </View>
        </View>
    //   </SafeAreaView>

    // </View>
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
})