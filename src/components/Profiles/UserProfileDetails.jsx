import { Dimensions, Image, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Header from '../Header/Header'
import { getUsersAge } from '../../utils'

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
              <Text style={styles.username}>{user?.personal_info?.name} <Text style={styles.userage}>{user?.personal_info.age ? user.personal_info.age : getUsersAge(user?.personal_info.date_of_birth)}</Text></Text>
            </View>
            <View>
              <Text style={styles.namesubdata}>
                {user?.personal_info?.height ? `${user.personal_info.height}cm` : ''}
                {user?.religious_cultural?.religion ? ` / ${user.religious_cultural.religion}` : ''}
                {user?.professional_details?.occupation ? ` / ${user.professional_details.occupation}` : ''}
              </Text>
            </View>
          </View>

          <View style={styles.userdetailsmain}>
            <View style={styles.detailscontainer}>
              <Text style={styles.detailsnameparamater}>Name</Text>
              <Text style={styles.detailsnamecolon}>:</Text>
              <Text style={styles.detailsnamevalue}>
                {user?.personal_info?.name || 'Not Specified'}
              </Text>
            </View>
            <View style={styles.detailscontainer}>
              <Text style={styles.detailsnameparamater}>Date of Birth</Text>
              <Text style={styles.detailsnamecolon}>:</Text>
              <Text style={styles.detailsnamevalue}>
                {user?.personal_info?.date_of_birth || 'Not Specified'}
              </Text>
            </View>
            <View style={styles.detailscontainer}>
              <Text style={styles.detailsnameparamater}>City</Text>
              <Text style={styles.detailsnamecolon}>:</Text>
              <Text style={styles.detailsnamevalue}>
                {user?.contact_info?.current_city || 'Not Specified'}
              </Text>
            </View>
            <View style={styles.detailscontainer}>
              <Text style={styles.detailsnameparamater}>Caste</Text>
              <Text style={styles.detailsnamecolon}>:</Text>
              <Text style={styles.detailsnamevalue}>
                {user?.religious_cultural?.caste || 'Not Specified'}
              </Text>
            </View>
            <View style={styles.detailscontainer}>
              <Text style={styles.detailsnameparamater}>Religion</Text>
              <Text style={styles.detailsnamecolon}>:</Text>
              <Text style={styles.detailsnamevalue}>
                {user?.religious_cultural?.religion || 'Not Specified'}
              </Text>
            </View>
            <View style={styles.detailscontainer}>
              <Text style={styles.detailsnameparamater}>Occupation</Text>
              <Text style={styles.detailsnamecolon}>:</Text>
              <Text style={styles.detailsnamevalue}>
                {user?.professional_details?.occupation || 'Not Specified'}
              </Text>
            </View>
            <View style={styles.detailscontainer}>
              <Text style={styles.detailsnameparamater}>Height</Text>
              <Text style={styles.detailsnamecolon}>:</Text>
              <Text style={styles.detailsnamevalue}>
                {user?.personal_info?.height ? `${user.personal_info.height}cm` : 'Not Specified'}
              </Text>
            </View>
            <View style={styles.detailscontainer}>
              <Text style={styles.detailsnameparamater}>Weight</Text>
              <Text style={styles.detailsnamecolon}>:</Text>
              <Text style={styles.detailsnamevalue}>
                {user?.personal_info?.weight ? `${user.personal_info.weight}kg` : 'Not Specified'}
              </Text>
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
    flexGrow: 1,
    paddingBottom: width / 20
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
    fontSize: fontScale * 16
  },
  userdetailsmain: {
    display: 'flex',
    alignItems: 'center',
    marginTop: width / 30,
    gap: width / 60
  },
  detailscontainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  detailsnameparamater: {
    width: width * 0.25,
    color: '#752B35',
    fontSize: fontScale * 20,
  },
  detailsnamecolon: {
    width: width * 0.1,
    color: '#752B35',
    fontWeight: 'bold',
    fontSize: fontScale * 20,
  },
  detailsnamevalue: {
    width: width * 0.3,
    color: '#752B35',
    fontSize: fontScale * 20,
  },
});
