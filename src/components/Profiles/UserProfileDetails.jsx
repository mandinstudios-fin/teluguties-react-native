import { Dimensions, Alert, FlatList, Image, SafeAreaView, ScrollView, StyleSheet, Text,ActivityIndicator, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import ImageSlider from 'react-native-image-slider';
import Header from '../Header/Header'
import { getUsersAge } from '../../utils'
import Slider from './Slider';
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import { useNavigationState } from '@react-navigation/native';

const { width, height, fontScale } = Dimensions.get("window")

const UserProfileDetails = ({ route, navigation }) => {
  const [routeName, setRouteName] = useState();
  const [loading, setLoading] = useState(false);
  const { user } = route.params;
  const images = user?.images?.length > 0 ? [user.profile_pic, ...user.images] : [user.profile_pic];

  const state = useNavigationState(state => state);

  useEffect(() => {
    if (state && state.index > 0) {
      const previousRoute = state.routes[state.index - 1]; // Get the previous route
      setRouteName(previousRoute.name);
    }
  }, [state]);

  const addToShortlist = async () => {
    setLoading(true)
    try {
      const currentUser = auth().currentUser;
      if (!currentUser) {
        return;
      }

      const userRef = firestore().collection('profiles').doc(currentUser.uid);
      await userRef.update({
        shortlisted: firestore.FieldValue.arrayUnion(user.id)
      });


      Alert.alert('Added to shortlist')
    } catch (error) {
    }
    setLoading(false)
  };

  const makeAMatch = async () => {
    setLoading(true);
    try {
      const currentUser = auth().currentUser;
      if (!currentUser) {
        return;
      }

      const userRef = firestore().collection('profiles').doc(currentUser.uid);
      await userRef.update({
        matches: firestore.FieldValue.arrayUnion(user.id)
      });


      Alert.alert('Added to Matches')
    } catch (error) {
    }
    setLoading(false);
  };

  const sendContactRequest = async (toUid) => {
    setLoading(true);
    const fromUid = auth().currentUser.uid;
    try {
      await firestore().collection('requests').add({
        fromUid,
        toUid,
        timestamp: firestore.FieldValue.serverTimestamp(),
      });
      Alert.alert('Request sent successfully');
    } catch (error) {
      console.log(error)
    }
    setLoading(false);
  };

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

          {
            routeName == 'Shortlist' || routeName == 'Matches' ?
              (
                <View style={styles.contactmain}>
                  <View style={styles.contactbox}>
                    <TouchableOpacity style={styles.contact} onPress={sendContactRequest}>
                      <Text style={styles.contacttext}>Contact</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )
              :
              (
                <View style={styles.shortmatchbox}>
                  <View style={styles.shortlistbox}>
                    <TouchableOpacity style={styles.shortlist} onPress={addToShortlist}>
                      <Text style={styles.shortlisttext}>Shortlist</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.matchbox}>
                    <TouchableOpacity style={styles.match} onPress={makeAMatch}>
                      <Text style={styles.matchtext}>Make a Match</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )
          }

        </View>
      </ScrollView>
      <View style={loading ? styles.loadingContainer : null}>
        {loading && <ActivityIndicator size="large" color="#a4737b" />}
      </View>
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
    color: '#7b2a50',
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
    color: '#7b2a50',
    fontSize: fontScale * 17,
  },
  detailsnamecolon: {
    width: width * 0.1,
    color: '#7b2a50',
    fontWeight: 'bold',
    fontSize: fontScale * 17,
  },
  detailsnamevalue: {
    width: width * 0.3,
    color: '#7b2a50',
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
  shortmatchbox: {
    marginTop: 20,
    paddingHorizontal: width * 0.05,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  shortlist: {
    paddingHorizontal: width * 0.1,
    paddingVertical: width * 0.04,
    backgroundColor: '#7b2a38',
    borderRadius: 5,

  },
  shortlisttext: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 15,
  },
  match: {
    paddingHorizontal: width * 0.1,
    paddingVertical: width * 0.04,
    backgroundColor: '#7b2a38',
    borderRadius: 5,
  },
  matchtext: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 15,
  },
  contactmain: {
    marginTop: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  contact: {
    paddingHorizontal: width * 0.1,
    paddingVertical: width * 0.04,
    backgroundColor: '#7b2a38',
    borderRadius: 5,
  },
  contacttext: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 15,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },

});
