import { Dimensions, FlatList, Image, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ImageSlider from 'react-native-image-slider';
import Header from '../Header/Header'
import { getUsersAge } from '../../utils'
import Slider from './Slider';

const { width, height, fontScale } = Dimensions.get("window")

const UserProfileDetails = ({ route, navigation }) => {
  const { user } = route.params;


  const images = user?.images?.length > 0 ? [user.profile_pic, ...user.images] : [user.profile_pic];


  return (
    <SafeAreaView style={styles.safearea}>
      <ScrollView>
        <View style={styles.main}>
          <Header navigation={navigation} />
          <View style={styles.boxContainer}>
            <View style={styles.box}></View>
          </View>
          <Slider images={images} />
          <View style={styles.userdetails}>
            <View style={styles.name}>
              <Text style={styles.username}>{user?.personal_info?.name} <Text style={styles.userage}>{user?.personal_info.age ? user.personal_info.age : getUsersAge(user?.personal_info.date_of_birth)}</Text></Text>
            </View>
            <View>
              <Text style={styles.namesubdata}>
                {user?.personal_info?.height ? `${user.personal_info.height}cm` : ''}
                {user?.religious_cultural?.religion ? ` ${user.religious_cultural.religion}` : ''}
                {user?.professional_details?.occupation ? `  ${user.professional_details.occupation}` : ''}
              </Text>
            </View>
          </View>

          <View style={styles.userdetailsmain}>
            <View style={styles.detailscontainer}>
              <Text style={styles.detailsnameparamater} numberOfLines={1}>Name</Text>
              <Text style={styles.detailsnamecolon}>:</Text>
              <Text style={styles.detailsnamevalue} numberOfLines={1}>
                {user?.personal_info?.name || 'Not Specified'}
              </Text>
            </View>
            <View style={styles.detailscontainer}>
              <Text style={styles.detailsnameparamater} numberOfLines={1}>Date of Birth</Text>
              <Text style={styles.detailsnamecolon}>:</Text>
              <Text style={styles.detailsnamevalue} numberOfLines={1}>
                {user?.personal_info?.date_of_birth || 'Not Specified'}
              </Text>
            </View>
            <View style={styles.detailscontainer}>
              <Text style={styles.detailsnameparamater} numberOfLines={1}>City</Text>
              <Text style={styles.detailsnamecolon}>:</Text>
              <Text style={styles.detailsnamevalue} numberOfLines={1}>
                {user?.contact_info?.current_city || 'Not Specified'}
              </Text>
            </View>
            <View style={styles.detailscontainer}>
              <Text style={styles.detailsnameparamater} numberOfLines={1}>Caste</Text>
              <Text style={styles.detailsnamecolon}>:</Text>
              <Text style={styles.detailsnamevalue} numberOfLines={1}>
                {user?.religious_cultural?.caste || 'Not Specified'}
              </Text>
            </View>
            <View style={styles.detailscontainer}>
              <Text style={styles.detailsnameparamater} numberOfLines={1}>Religion</Text>
              <Text style={styles.detailsnamecolon}>:</Text>
              <Text style={styles.detailsnamevalue} numberOfLines={1}>
                {user?.religious_cultural?.religion || 'Not Specified'}
              </Text>
            </View>
            <View style={styles.detailscontainer}>
              <Text style={styles.detailsnameparamater} numberOfLines={1}>Occupation</Text>
              <Text style={styles.detailsnamecolon}>:</Text>
              <Text style={styles.detailsnamevalue} numberOfLines={1}>
                {user?.professional_details?.occupation || 'Not Specified'}
              </Text>
            </View>
            <View style={styles.detailscontainer}>
              <Text style={styles.detailsnameparamater} numberOfLines={1}>Height</Text>
              <Text style={styles.detailsnamecolon}>:</Text>
              <Text style={styles.detailsnamevalue} numberOfLines={1}>
                {user?.personal_info?.height ? `${user.personal_info.height}cm` : 'Not Specified'}
              </Text>
            </View>
            <View style={styles.detailscontainer}>
              <Text style={styles.detailsnameparamater} numberOfLines={1}>Weight</Text>
              <Text style={styles.detailsnamecolon}>:</Text>
              <Text style={styles.detailsnamevalue} numberOfLines={1}>
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
    height: 60,
    width: '100%',
    borderRadius: 15,
    marginBottom: 10
  },
  userdetails: {
    paddingHorizontal: width / 40,
  },
  imagecontainer: {
    width: width,
    height: height * 0.4,
    backgroundColor: '#E4BD9E',
    borderWidth: 1
  },
  userimage: {
    width: width,
    height: height * 0.3,
    resizeMode: 'contain',
  },
  profile_pic_notavailable: {
    width: width,
    height: height * 0.3,
    borderWidth: 0.2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  profile_pic_notavailabletext: {
    color: '#752B35',
    fontWeight: 'bold'
  },
  username: {
    color: '#000'
  },
  name: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingLeft: width / 20,
    paddingTop: width / 20,

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
    color: '#AFAFAF',
    fontSize: fontScale * 16,
    paddingLeft: width / 20,
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
    color: '#AFAFAF',
    fontSize: fontScale * 17,
  },
  detailsnamecolon: {
    width: width * 0.1,
    color: '#AFAFAF',
    fontWeight: 'bold',
    fontSize: fontScale * 17,
  },
  detailsnamevalue: {
    width: width * 0.3,
    color: '#AFAFAF',
    fontSize: fontScale * 17,
  },
  slider: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    display: 'flex',
  },
  flatlist: {
    flexDirection: 'row',
    paddingVertical: 10,
    width: '100%',
    height: '100%',
  },


  flatlistimagecontainer: {
    width: '100%',
    height: '100%',
    marginRight: 10,
    justifyContent: 'center',
  },


  flatlistimage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});
