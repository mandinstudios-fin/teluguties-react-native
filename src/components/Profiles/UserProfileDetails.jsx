import { Dimensions, Alert, FlatList, Image, SafeAreaView, ScrollView, StyleSheet, Text, ActivityIndicator, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '../Header/Header'
import Slider from './Slider';
import { useNavigationState } from '@react-navigation/native';
import { getUsersAge, isUserAccepted, isUserRejected } from '../../utils';
import useFirestore from '../../hooks/useFirestore';
import useAgent from '../../hooks/useAgent';

const { width, height, fontScale } = Dimensions.get("window")

const UserProfileDetails = ({ route, navigation }) => {
  const { user } = route.params;
  const images = (user && user.profile_pic && user.images && user.images.length > 0)
    ? [user.profile_pic, ...user.images]
    : (user && user.profile_pic ? [user.profile_pic] : []);
  const [routeName, setRouteName] = useState();
  const [agentsData, setAgentsData] = useState();
  const [status, setStatus] = useState(null);
  const state = useNavigationState(state => state);
  const {
    loading,
    requestData,
    fetchRequestDetails,
    addToShortlist,
    makeAMatch,
    sendContactRequest,
  } = useFirestore();
  const { getAgentsCurrentDetails, acceptAssignRequest, rejectAssignRequest } = useAgent();

  useEffect(() => {
    if (user?.id) {
      fetchRequestDetails(user.id);
    }
  }, [user, fetchRequestDetails]);


  useEffect(() => {
    if (state && state.index > 0) {
      const previousRoute = state.routes[state.index - 1]; // Get the previous route
      setRouteName(previousRoute.name);
    }
  }, [state]);

  useEffect(() => {
    getAgentsCurrentDetails(setAgentsData);
  }, [user]);

   // Track accepted/rejected status

  useEffect(() => {
    const checkStatus = async () => {
      const accepted = await isUserAccepted(user.id);
      const rejected = await isUserRejected(user.id);

      if (accepted) setStatus('Accepted');
      else if (rejected) setStatus('Rejected');
      else setStatus(null);
    };

    checkStatus();
  }, [user.id]);

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
              <Text style={styles.username}>{user?.personal_info?.name} <Text style={styles.userage}>{user?.personal_info?.age ? user.personal_info.age : user?.personal_info?.date_of_birth ? getUsersAge(user.personal_info.date_of_birth) : null}</Text></Text>

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
              <Text style={styles.detailsnameparamater} numberOfLines={1}>Current City</Text>
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
              <Text style={styles.detailsnameparamater}>Religion</Text>
              <Text style={styles.detailsnamecolon}>:</Text>
              <Text style={styles.detailsnamevalue} numberOfLines={1}>
                {user?.religious_cultural?.religion || 'Not Specified'}
              </Text>
            </View>
            <View style={styles.detailscontainer}>
              <Text style={styles.detailsnameparamater}>Caste</Text>
              <Text style={styles.detailsnamecolon}>:</Text>
              <Text style={styles.detailsnamevalue} numberOfLines={1}>
                {user?.religious_cultural?.caste ? `${user.religious_cultural?.caste}` : 'Not Specified'}
              </Text>
            </View>
            <View style={styles.detailscontainer}>
              <Text style={styles.detailsnameparamater}>Sub Caste</Text>
              <Text style={styles.detailsnamecolon}>:</Text>
              <Text style={styles.detailsnamevalue} >
                {user?.religious_cultural?.subcaste ? `${user.religious_cultural?.subcaste}` : 'Not Specified'}
              </Text>
            </View>
            <View style={styles.detailscontainer}>
              <Text style={styles.detailsnameparamater}>Gothra</Text>
              <Text style={styles.detailsnamecolon}>:</Text>
              <Text style={styles.detailsnamevalue} >
                {user?.religious_cultural?.gothra ? `${user.religious_cultural?.gothra}` : 'Not Specified'}
              </Text>
            </View>
            <View style={styles.detailscontainer}>
              <Text style={styles.detailsnameparamater}>Star/Rashi</Text>
              <Text style={styles.detailsnamecolon}>:</Text>
              <Text style={styles.detailsnamevalue} >
                {user?.religious_cultural?.star_rashi ? `${user.religious_cultural?.star_rashi}` : 'Not Specified'}
              </Text>
            </View>
            <View style={styles.detailscontainer}>
              <Text style={styles.detailsnameparamater}>Manglik Status</Text>
              <Text style={styles.detailsnamecolon}>:</Text>
              <Text style={styles.detailsnamevalue} >
                {user?.religious_cultural?.manglik_status ? `${user.religious_cultural?.manglik_status}` : 'Not Specified'}
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
            <View style={styles.detailscontainer}>
              <Text style={styles.detailsnameparamater}>Marital Statua</Text>
              <Text style={styles.detailsnamecolon}>:</Text>
              <Text style={styles.detailsnamevalue} numberOfLines={1}>
                {user?.personal_info?.marital_status ? `${user.personal_info.marital_status}` : 'Not Specified'}
              </Text>
            </View>
            <View style={styles.detailscontainer}>
              <Text style={styles.detailsnameparamater}>Gender</Text>
              <Text style={styles.detailsnamecolon}>:</Text>
              <Text style={styles.detailsnamevalue} numberOfLines={1}>
                {user?.personal_info?.gender ? `${user.personal_info.marital_status}` : 'Not Specified'}
              </Text>
            </View>
            <View style={styles.detailscontainer}>
              <Text style={styles.detailsnameparamater}>No. of Children</Text>
              <Text style={styles.detailsnamecolon}>:</Text>
              <Text style={styles.detailsnamevalue} numberOfLines={1}>
                {user?.personal_info?.num_children ? `${user.personal_info.num_children}` : 'Not Specified'}
              </Text>
            </View>
            <View style={styles.detailscontainer}>
              <Text style={styles.detailsnameparamater}>Blood Type</Text>
              <Text style={styles.detailsnamecolon}>:</Text>
              <Text style={styles.detailsnamevalue} numberOfLines={1}>
                {user?.personal_info?.blood_group ? `${user.personal_info.blood_group}` : 'Not Specified'}
              </Text>
            </View>
            <View style={styles.detailscontainer}>
              <Text style={styles.detailsnameparamater} >State</Text>
              <Text style={styles.detailsnamecolon}>:</Text>
              <Text style={styles.detailsnamevalue} >
                {user?.contact_info?.permanent_address.state ? `${user.contact_info.permanent_address.state}` : 'Not Specified'}
              </Text>
            </View>
            <View style={styles.detailscontainer}>
              <Text style={styles.detailsnameparamater} >City</Text>
              <Text style={styles.detailsnamecolon}>:</Text>
              <Text style={styles.detailsnamevalue} >
                {user?.contact_info?.permanent_address.city ? `${user.contact_info.permanent_address.city}` : 'Not Specified'}
              </Text>
            </View>
            <View style={styles.detailscontainer}>
              <Text style={styles.detailsnameparamater} >Country</Text>
              <Text style={styles.detailsnamecolon}>:</Text>
              <Text style={styles.detailsnamevalue} >
                {user?.contact_info?.permanent_address.country ? `${user.contact_info.permanent_address.country}` : 'Not Specified'}
              </Text>
            </View>
            <View style={styles.detailscontainer}>
              <Text style={styles.detailsnameparamater} >Street</Text>
              <Text style={styles.detailsnamecolon}>:</Text>
              <Text style={styles.detailsnamevalue} >
                {user?.contact_info?.permanent_address.street ? `${user.contact_info.permanent_address.street}` : 'Not Specified'}
              </Text>
            </View>
            <View style={styles.detailscontainer}>
              <Text style={styles.detailsnameparamater} >Family Type</Text>
              <Text style={styles.detailsnamecolon}>:</Text>
              <Text style={styles.detailsnamevalue} >
                {user?.family_background?.family_type ? `${user.family_background.family_type}` : 'Not Specified'}
              </Text>
            </View>
            <View style={styles.detailscontainer}>
              <Text style={styles.detailsnameparamater} >Mother's Name</Text>
              <Text style={styles.detailsnamecolon}>:</Text>
              <Text style={styles.detailsnamevalue} >
                {user?.family_background?.mother_name ? `${user.family_background.mother_name}` : 'Not Specified'}
              </Text>
            </View>
            <View style={styles.detailscontainer}>
              <Text style={styles.detailsnameparamater} >Father's Name</Text>
              <Text style={styles.detailsnamecolon}>:</Text>
              <Text style={styles.detailsnamevalue} >
                {user?.family_background?.father_name ? `${user.family_background.father_name}` : 'Not Specified'}
              </Text>
            </View>
            <View style={styles.detailscontainer}>
              <Text style={styles.detailsnameparamater} >No.of Brothers</Text>
              <Text style={styles.detailsnamecolon}>:</Text>
              <Text style={styles.detailsnamevalue} >
                {user?.family_background?.num_brothers ? `${user.family_background.num_brothers}` : 'Not Specified'}
              </Text>
            </View>
            <View style={styles.detailscontainer}>
              <Text style={styles.detailsnameparamater} >No.of Sisters</Text>
              <Text style={styles.detailsnamecolon}>:</Text>
              <Text style={styles.detailsnamevalue} >
                {user?.family_background?.num_sisters ? `${user.family_background.num_sisters}` : 'Not Specified'}
              </Text>
            </View>
            <View style={styles.detailscontainer}>
              <Text style={styles.detailsnameparamater} >Family Status</Text>
              <Text style={styles.detailsnamecolon}>:</Text>
              <Text style={styles.detailsnamevalue} >
                {user?.family_background?.family_status ? `${user.family_background.family_ststus}` : 'Not Specified'}
              </Text>
            </View>
            <View style={styles.detailscontainer}>
              <Text style={styles.detailsnameparamater} >Family Values</Text>
              <Text style={styles.detailsnamecolon}>:</Text>
              <Text style={styles.detailsnamevalue} >
                {user?.family_background?.family_values ? `${user.family_background.family_values}` : 'Not Specified'}
              </Text>
            </View>
            <View style={styles.detailscontainer}>
              <Text style={styles.detailsnameparamater} >Annual Income</Text>
              <Text style={styles.detailsnamecolon}>:</Text>
              <Text style={styles.detailsnamevalue} >
                {user?.professional_details?.annual_income ? `${user.professional_details.annual_income}` : 'Not Specified'}
              </Text>
            </View>
            <View style={styles.detailscontainer}>
              <Text style={styles.detailsnameparamater} >Employer</Text>
              <Text style={styles.detailsnamecolon}>:</Text>
              <Text style={styles.detailsnamevalue} >
                {user?.professional_details?.employer ? `${user.professional_details.employer}` : 'Not Specified'}
              </Text>
            </View>
            <View style={styles.detailscontainer}>
              <Text style={styles.detailsnameparamater} >Job Location</Text>
              <Text style={styles.detailsnamecolon}>:</Text>
              <Text style={styles.detailsnamevalue} >
                {user?.professional_details?.job_location ? `${user.professional_details.job_location}` : 'Not Specified'}
              </Text>
            </View>
            <View style={styles.detailscontainer}>
              <Text style={styles.detailsnameparamater} >Occupation</Text>
              <Text style={styles.detailsnamecolon}>:</Text>
              <Text style={styles.detailsnamevalue} >
                {user?.professional_details?.occupation ? `${user.professional_details.occupation}` : 'Not Specified'}
              </Text>
            </View>
            <View style={styles.detailscontainer}>
              <Text style={styles.detailsnameparamater} >Highest Education</Text>
              <Text style={styles.detailsnamecolon}>:</Text>
              <Text style={styles.detailsnamevalue} >
                {user?.education?.highest_education ? `${user.education?.highest_education}` : 'Not Specified'}
              </Text>
            </View>
            <View style={styles.detailscontainer}>
              <Text style={styles.detailsnameparamater} >Field Of Study</Text>
              <Text style={styles.detailsnamecolon}>:</Text>
              <Text style={styles.detailsnamevalue} >
                {user?.education?.field_of_study ? `${user.education?.field_of_study}` : 'Not Specified'}
              </Text>
            </View>
            <View style={styles.detailscontainer}>
              <Text style={styles.detailsnameparamater} >Graduation Year</Text>
              <Text style={styles.detailsnamecolon}>:</Text>
              <Text style={styles.detailsnamevalue} >
                {user?.education?.graduation_year ? `${user.education?.graduation_year}` : 'Not Specified'}
              </Text>
            </View>
            <View style={styles.detailscontainer}>
              <Text style={styles.detailsnameparamater} >College</Text>
              <Text style={styles.detailsnamecolon}>:</Text>
              <Text style={styles.detailsnamevalue} >
                {user?.education?.college ? `${user.education?.college}` : 'Not Specified'}
              </Text>
            </View>
            <View style={styles.detailscontainer}>
              <Text style={styles.detailsnameparamater} >Drinking Habits</Text>
              <Text style={styles.detailsnamecolon}>:</Text>
              <Text style={styles.detailsnamevalue} >
                {user?.lifestyle_preferences?.drinking_habits ? `${user.lifestyle_preferences?.drinking_habits}` : 'Not Specified'}
              </Text>
            </View>
            <View style={styles.detailscontainer}>
              <Text style={styles.detailsnameparamater} >Smoking Habits</Text>
              <Text style={styles.detailsnamecolon}>:</Text>
              <Text style={styles.detailsnamevalue} >
                {user?.lifestyle_preferences?.smoking_habits ? `${user.lifestyle_preferences?.smoking_habits}` : 'Not Specified'}
              </Text>
            </View>
            <View style={styles.detailscontainer}>
              <Text style={styles.detailsnameparamater} >Hobbies & Interests</Text>
              <Text style={styles.detailsnamecolon}>:</Text>
              <Text style={styles.detailsnamevalue} >
                {user?.hobbies_interests ? `${user?.hobbies_interests.map((item) => <Text>{item}{" "}</Text>)}` : 'Not Specified'}
              </Text>
            </View>
            <View style={styles.detailscontainer}>
              <Text style={styles.detailsnameparamater} >Drinking Habits</Text>
              <Text style={styles.detailsnamecolon}>:</Text>
              <Text style={styles.detailsnamevalue} >
                {user?.lifestyle_preferences?.drinking_habits ? `${user.lifestyle_preferences?.drinking_habits}` : 'Not Specified'}
              </Text>
            </View>
            <View style={styles.detailscontainer}>
              <Text style={styles.detailsnameparamater} >Age Range(Min)</Text>
              <Text style={styles.detailsnamecolon}>:</Text>
              <Text style={styles.detailsnamevalue} >
                {user?.matrimonial_expectations?.preferred_age_range?.min ? `${user.matrimonial_expectations?.preferred_age_range?.min}` : 'Not Specified'}
              </Text>
            </View>
            <View style={styles.detailscontainer}>
              <Text style={styles.detailsnameparamater} >Age Range(Max)</Text>
              <Text style={styles.detailsnamecolon}>:</Text>
              <Text style={styles.detailsnamevalue} >
                {user?.matrimonial_expectations?.preferred_age_range?.max ? `${user.matrimonial_expectations?.preferred_age_range?.max}` : 'Not Specified'}
              </Text>
            </View>
            <View style={styles.detailscontainer}>
              <Text style={styles.detailsnameparamater} >Height Range(Min)</Text>
              <Text style={styles.detailsnamecolon}>:</Text>
              <Text style={styles.detailsnamevalue} >
                {user?.matrimonial_expectations?.preferred_height_range?.min ? `${user.matrimonial_expectations?.preferred_height_range?.min}cm` : 'Not Specified'}
              </Text>
            </View>
            <View style={styles.detailscontainer}>
              <Text style={styles.detailsnameparamater} >Height Range(Max)</Text>
              <Text style={styles.detailsnamecolon}>:</Text>
              <Text style={styles.detailsnamevalue} >
                {user?.matrimonial_expectations?.preferred_height_range?.max ? `${user.matrimonial_expectations?.preferred_height_range?.max}cm` : 'Not Specified'}
              </Text>
            </View>
            <View style={styles.detailscontainer}>
              <Text style={styles.detailsnameparamater} >Preferred Education</Text>
              <Text style={styles.detailsnamecolon}>:</Text>
              <Text style={styles.detailsnamevalue} >
                {user?.matrimonial_expectations?.preferred_education ? `${user.matrimonial_expectations?.preferred_education}` : 'Not Specified'}
              </Text>
            </View>
            <View style={styles.detailscontainer}>
              <Text style={styles.detailsnameparamater} >Preferred Location</Text>
              <Text style={styles.detailsnamecolon}>:</Text>
              <Text style={styles.detailsnamevalue} >
                {user?.matrimonial_expectations?.preferred_location ? `${user.matrimonial_expectations?.preferred_location}` : 'Not Specified'}
              </Text>
            </View>
            <View style={styles.detailscontainer}>
              <Text style={styles.detailsnameparamater} >Preferred Occupation</Text>
              <Text style={styles.detailsnamecolon}>:</Text>
              <Text style={styles.detailsnamevalue} >
                {user?.matrimonial_expectations?.preferred_occupation ? `${user.matrimonial_expectations?.preferred_occupation}` : 'Not Specified'}
              </Text>
            </View>
            <View style={styles.detailscontainer}>
              <Text style={styles.detailsnameparamater} >Minimum Annual Income</Text>
              <Text style={styles.detailsnamecolon}>:</Text>
              <Text style={styles.detailsnamevalue} >
                {user?.matrimonial_expectations?.preferred_income ? `Rs.${user.matrimonial_expectations?.preferred_income}` : 'Not Specified'}
              </Text>
            </View>
            <View style={styles.detailscontainer}>
              <Text style={styles.detailsnameparamater} >Other Preferences</Text>
              <Text style={styles.detailsnamecolon}>:</Text>
              <Text style={styles.detailsnamevalue} >
                {user?.matrimonial_expectations?.other_preferences ? `${user.matrimonial_expectations?.other_preferences}` : 'Not Specified'}
              </Text>
            </View>
            <View style={styles.detailscontainer}>
              <Text style={styles.detailsnameparamater}>About Me</Text>
              <Text style={styles.detailsnamecolon}>:</Text>
              <Text style={styles.detailsnamevalue} >
                {user?.about_me ? `${user.about_me}` : 'Not Specified'}
              </Text>
            </View>
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
                  if (!requestData) sendContactRequest();
                }}>
                <Text style={styles.contacttext}>{requestData?.status ? requestData.status : 'Contact'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : routeName === 'HomeStack' ? (
          <View style={styles.shortmatchbox}>
            <View style={styles.shortlistbox}>
              <TouchableOpacity
                style={styles.shortlist}
                onPress={() => addToShortlist(user.id)}>
                <Text style={styles.shortlisttext}>Shortlist</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.matchbox}>
              <TouchableOpacity
                style={styles.match}
                onPress={() => makeAMatch(user.id)}>
                <Text style={styles.matchtext}>Make a Match</Text>
              </TouchableOpacity>
            </View>
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
    marginHorizontal: 'auto'
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
