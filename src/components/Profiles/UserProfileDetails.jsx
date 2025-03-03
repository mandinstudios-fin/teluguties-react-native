import { Dimensions, Alert, FlatList, Image, SafeAreaView, ScrollView, StyleSheet, Text, Linking, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '../Header/Header'
import Slider from './Slider';
import { useNavigationState } from '@react-navigation/native';
import { getUsersAge, isAgentAssignedForProfileB, isProfileBInMatches, isUserAccepted, isUserRejected } from '../../utils';
import useFirestore from '../../hooks/useFirestore';
import useAgent from '../../hooks/useAgent';
import auth from '@react-native-firebase/auth';
import DetailsCard from './DetailsCard';
import { ArrowLeft, ChevronLeft, ChevronRight, Heart, Instagram, MessageCircle } from 'lucide-react-native';
import Loader from '../Loader/Loader';
import useToastHook from '../../utils/useToastHook';

const { width, height, fontScale } = Dimensions.get("window")

const UserProfileDetails = ({ route, navigation }) => {
  const currentUser = auth().currentUser;
  const { profiles, index } = route.params;
  const user = profiles[index];

  const images = (user && user.contactInformation?.profilePicture && user.images && user.images.length > 0)
    ? [user.contactInformation?.profilePicture, ...user.images]
    : (user && user.contactInformation?.profilePicture ? [user.contactInformation?.profilePicture] : []);
  const [routeName, setRouteName] = useState();
  const [isAgentAssigned, setIsAgentAssigned] = useState();
  const [isProfileInMatches, setIsProfileInMatches] = useState();
  const [status, setStatus] = useState(null);
  const state = useNavigationState(state => state);
  const [loading, setLoading] = useState(false);
  const { successToast, errorToast } = useToastHook();
  const {
    requestData,
    fetchRequestDetails,
    addToShortlist,
    makeAMatch,
    sendContactRequest,
  } = useFirestore();
  const { getAgentsCurrentDetails, acceptAssignRequest, rejectAssignRequest } = useAgent();
  const { profilePicture, ...filteredContactInfo } = user?.contactInformation || {};

  // First useEffect - fetch request details
  useEffect(() => {
    if (user?.id) {
      fetchRequestDetails(user.id);
    }
  }, [user, fetchRequestDetails]);

  // Second useEffect - track navigation state
  useEffect(() => {
    if (state && state.index > 0) {
      const previousRoute = state.routes[state.index - 1];
      setRouteName(previousRoute.name);
    }
  }, [state]);

  // Third useEffect - agent assignment check
  useEffect(() => {
    const handleIsAgentAssignedForProfileB = async () => {
      if (currentUser?.uid && user?.id) {
        const result = await isAgentAssignedForProfileB(currentUser.uid, user.id);
        setIsAgentAssigned(result);
      }
    }

    handleIsAgentAssignedForProfileB();
  }, [currentUser?.uid, user?.id]);

  // Fourth useEffect - match status check
  useEffect(() => {
    const handleIsProfileBInMatches = async () => {
      if (currentUser?.uid && user?.id) {
        const result = await isProfileBInMatches(currentUser.uid, user.id);
        setIsProfileInMatches(result);
      }
    }

    handleIsProfileBInMatches();
  }, [currentUser?.uid, user?.id]);

  // Fifth useEffect - acceptance/rejection status check
  useEffect(() => {
    const checkStatus = async () => {
      if (user?.id) {
        const accepted = await isUserAccepted(user.id);
        const rejected = await isUserRejected(user.id);

        if (accepted) setStatus('Accepted');
        else if (rejected) setStatus('Rejected');
        else setStatus(null);
      }
    };

    checkStatus();
  }, [user?.id]);

  console.log(routeName)

  const goToPrevious = () => {
    if (index > 0) {
      navigation.push('UserProfileDetails', { navigation, profiles, index: index - 1 });
    }
  };

  const goToNext = () => {
    if (index < profiles.length - 1) {
      navigation.push('UserProfileDetails', { navigation, profiles, index: index + 1 });
    }
  };

  const checkWhatsAppAccount = (phoneNumber) => {
    const whatsappUrl = `https://wa.me/${phoneNumber}`;

    Linking.canOpenURL(whatsappUrl)
      .then((supported) => {
        if (supported) {
          Linking.openURL(whatsappUrl);
        } else {
          errorToast("The user doesn't have a WhatsApp account.");
        }
      })
      .catch((err) => console.error("Error checking WhatsApp:", err));
  };

  const openInstagram = () => {
    if (user?.contactInformation?.instagramId) {
      const appUrl = `instagram://user?username=${user?.contactInformation?.instagramId}`; // Opens in Instagram App
      const webUrl = `https://www.instagram.com/${user?.contactInformation?.instagramId}/`; // Opens in Browser

      Linking.canOpenURL(appUrl)
        .then((supported) => {
          if (supported) {
            return Linking.openURL(appUrl);
          } else {
            return Linking.openURL(webUrl);
          }
        })
        .catch((err) => console.error("Error opening Instagram:", err));
    }
  };


  return (
    <SafeAreaView style={styles.safearea}>

      <View style={styles.headerbox}>
        <TouchableOpacity style={styles.iconcontainer} onPress={() => navigation.goBack()}><ArrowLeft strokeWidth={1} size={23} color={'#7b2a38'} /></TouchableOpacity>
        <Text style={styles.headertext}>Profile Details</Text>
        <TouchableOpacity style={styles.iconcontainer} onPress={() => makeAMatch(user.id)}><Heart strokeWidth={1} size={23} color={'#7b2a38'} /></TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.scrollview}>
        <View style={styles.main}>
          <Slider images={images} />
          <View style={styles.userdetails}>
            <View style={styles.name}>
              <Text style={styles.username}>{user?.personalInformation?.firstName} <Text style={styles.userage}>{user?.personal_info?.age ? user.personal_info.age : user?.personal_info?.date_of_birth ? getUsersAge(user.personal_info.date_of_birth) : null}</Text></Text>
              <View style={styles.icons}>
                <TouchableOpacity
                  style={styles.iconcontainer}
                  onPress={() => checkWhatsAppAccount(user?.contactInformation?.phone)} // Replace with dynamic user number
                >
                  <MessageCircle strokeWidth={1} size={23} color={'green'} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconcontainer} onPress={openInstagram}>
                  <Instagram strokeWidth={1} size={23} color={"#7b2a38"} />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.userdetailsmain}>
            <DetailsCard title='Personal Information' data={user?.personalInformation} />
            {/* <DetailsCard title='Family Details' data={user?.familyInformation} />
            <DetailsCard title='Education & Profession' data={user?.educationAndCareer} />
            <DetailsCard title='Marital Preferences & Lifestyle' data={user?.lifestyleAndInterests} />
            <DetailsCard title='Partner Preferences' data={user?.partnerPreferences} />
            <DetailsCard title='Contact & Verification' data={filteredContactInfo} /> */}
            {
              requestData?.status == "approved" &&
              <View style={styles.detailscontainer}>
                <Text style={styles.detailsnameparamater} numberOfLines={1}>Phone</Text>
                <Text style={styles.detailsnamecolon}>:</Text>
                <Text style={styles.detailsnamevalue} >
                  {user?.contact_info?.phone ? `${user.contact_info.phone}` : 'Not Specified'}
                </Text>
              </View>
            }

            {
              requestData?.status == "approved" &&
              <View style={styles.detailscontainer}>
                <Text style={styles.detailsnameparamater} numberOfLines={1}>Email</Text>
                <Text style={styles.detailsnamecolon}>:</Text>
                <Text style={styles.detailsnamevalue}>
                  {user?.contact_info?.email ? `${user.contact_info.email}` : 'Not Specified'}
                </Text>
              </View>
            }
          </View>

          {routeName &&
            (routeName === 'Shortlist' || routeName === 'Matches' ? (
              <View style={styles.contactmain}>
                <View style={styles.contactbox}>
                  <TouchableOpacity
                    style={styles.contact}
                    onPress={() => {
                      if (!requestData) sendContactRequest(user.id);
                    }}>
                    <Text style={styles.contacttext}>{requestData?.status ? requestData.status : 'Contact'}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : routeName === 'Home' || routeName === 'UserProfileDetails' ? (
              <View style={styles.shortmatchbox}>
                {/* CASE 1: If an agent is assigned → Show "Agent Assigned" and hide "Make a Match" */}
                {isAgentAssigned && (
                  <View style={styles.shortlistbox}>
                    <TouchableOpacity style={[styles.shortlist, { backgroundColor: 'gray' }]} disabled={true}>
                      <Text style={styles.shortlisttext}>Agent Assigned</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {/* CASE 2: If a match is already pending → Show "Pending" and hide "Assign Agent" */}
                {isProfileInMatches && (
                  <View style={styles.matchbox}>
                    <TouchableOpacity style={[styles.match, { backgroundColor: 'gray' }]} disabled={true}>
                      <Text style={styles.matchtext}>Pending</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {/* CASE 3: If both agent is NOT assigned and no match is pending → Show both "Assign Agent" & "Make a Match" */}
                {!isAgentAssigned && !isProfileInMatches && (
                  <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: width/5, paddingHorizontal: 10 }}>
                    <TouchableOpacity
                      style={styles.shortlist}
                      onPress={() =>
                        navigation.navigate('AssignAgentForMatch', {
                          profile_a_id: currentUser?.uid,
                          profile_b_id: user?.id
                        })
                      }
                    >
                      <Text style={styles.shortlisttext}>Assign Agent</Text>
                    </TouchableOpacity>



                    <TouchableOpacity style={styles.match} onPress={() => makeAMatch(user.id)}>
                      <Text style={styles.matchtext}>Make a Match</Text>
                    </TouchableOpacity>

                  </View>
                )}
              </View>


            ) : routeName === 'AllAssignedUser' || routeName === 'AgentsAssign' ? (
              <View style={styles.shortmatchbox}>
                {status === 'Accepted' ? (
                  <TouchableOpacity
                    style={styles.shortlist}>
                    <Text style={styles.shortlisttext}>Accepted</Text>
                  </TouchableOpacity>
                ) : status === 'Rejected' ? (
                  <TouchableOpacity
                    style={styles.shortlist}>
                    <Text style={styles.shortlisttext}>Rejected</Text>
                  </TouchableOpacity>
                ) : (
                  <>
                    <View style={styles.shortlistbox}>
                      <TouchableOpacity
                        style={styles.shortlist}
                        onPress={() => acceptAssignRequest(user.id)}>
                        <Text style={styles.shortlisttext}>Accept</Text>
                      </TouchableOpacity>
                    </View>

                    <View style={styles.matchbox}>
                      <TouchableOpacity
                        style={styles.match}
                        onPress={() => rejectAssignRequest(user.id)}>
                        <Text style={styles.shortlisttext}>Reject</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                )}
              </View>
            ) : null)}

          {/* <View style={styles.prevnextbox}>
            {index > 0 && <TouchableOpacity style={styles.button} onPress={goToPrevious} disabled={index === 0}>
              <ChevronLeft strokeWidth={1} color={'white'} />
              <Text style={styles.buttontext}>Previous</Text>
            </TouchableOpacity>}

            {index < profiles.length - 1 && <TouchableOpacity style={styles.button} onPress={goToNext} disabled={index === profiles.length - 1}>
              <Text style={styles.buttontext}>Next</Text>
              <ChevronRight strokeWidth={1} color={'white'} />
            </TouchableOpacity>}
          </View> */}

          <View style={styles.prevnextbox}>
            {/* Previous Button (Always Visible, but Disabled at index 0) */}
            <TouchableOpacity
              style={[styles.button, index === 0 && styles.disabledButton]}
              onPress={goToPrevious}
              disabled={index === 0}
            >
              <ChevronLeft strokeWidth={1} color={'white'} />
              <Text style={styles.buttontext}>Previous</Text>
            </TouchableOpacity>

            {/* Next Button (Always Visible, but Disabled at the Last Index) */}
            <TouchableOpacity
              style={[styles.button, index === profiles.length - 1 && styles.disabledButton]}
              onPress={goToNext}
              disabled={index === profiles.length - 1}
            >
              <Text style={styles.buttontext}>Next</Text>
              <ChevronRight strokeWidth={1} color={'white'} />
            </TouchableOpacity>
          </View>


        </View>
      </ScrollView>
      <View style={loading ? styles.loadingContainer : null}>
        {loading && <Loader />}
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
  scrollview: {
    flexGrow: 1,
  },
  main: {
    flexGrow: 1,
    paddingBottom: width / 20,
  },
  iconcontainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 100,
    padding: 8,
  },
  headerbox: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 18,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center'
  },
  headertext: {
    color: '#7b2a38',
    fontSize: 16,
    fontWeight: '700'
  },
  userdetails: {
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
    justifyContent: 'space-between',
    paddingRight: width / 20,


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
  nameiconcontainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  icons: {
    display: 'flex',
    flexDirection: 'row',
    gap: 15,

  },
  namesubdata: {
    color: '#7b2a50',
    fontSize: fontScale * 16,
    paddingLeft: width / 20,
  },
  userdetailsmain: {
    marginTop: width / 30,
    width: '100%',
    gap: 15,
    paddingHorizontal: 12,
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
    display:'flex',
    alignItems:'center',
    justifyContent:'center'
  },
  shortlist: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    backgroundColor: '#7b2a38',
    borderRadius: 5,
  },
  shortlisttext: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 13,
  },
  match: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    backgroundColor: '#7b2a38',
    borderRadius: 5,
  },
  matchtext: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 13,
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
  shortlistbox: {
  },
  matchbox: {
  },

  prevnextbox: {
    display: 'flex',
    flexDirection: 'row',
    gap: 3,
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginTop: 30,

  },

  button: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#7b2a38',
    paddingHorizontal: 18,
    paddingVertical: 10,
    marginHorizontal: 'auto'
  },
  buttontext: {
    textAlign: 'center',
    color: 'white',
  },

  disabledButton: {
    opacity: 0.5, // Make disabled buttons look faded
  },

});
