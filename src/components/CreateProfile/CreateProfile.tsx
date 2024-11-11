import { Alert, Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import Header from '../Header/Header'
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const { width, height } = Dimensions.get('window');

const CreateProfile: React.FC = ({ navigation }) => {
  const [userData, setUserData] = useState<any>({});
  const [firstname, setFirstName] = useState<string>('');
  const [middlename, setMiddleName] = useState<string>('');
  const [lastname, setLastName] = useState<string>('');
  const [dob, setDob] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [isEmailEdited, setIsEmailEdited] = useState<boolean>(false);
  const [gender, setGender] = useState<string>('');
  const [phoneno, setPhoneNo] = useState<string>('');
  const [community, setCommunity] = useState<string>('');
  const [place, setPlace] = useState<string>('');
  const [religion, setReligion] = useState<string>('');
  const [caste, setCaste] = useState<string>('');
  const [country, setCountry] = useState<string>('');
  const [state, setState] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [maritialstatus, setMaritialaStatus] = useState<string>('');
  const [children, setChildren] = useState<string>('');
  const [age, setAge] = useState<string>('');
  const [education, setEducation] = useState<string>('');
  const [occupation, setOccupation] = useState<string>('');
  const [nationality, setNationality] = useState<string>('');
  const [passport, setPassport] = useState<string>('');
  const [income, setIncome] = useState<string>('');
  const [drinking, setDrinking] = useState<boolean>(false);
  const [smoking, setSmoking] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [built, setBuilt] = useState<string>('');
  const [complexion, setComplexion] = useState<string>('');
  const [haircolor, setHairColor] = useState<string>('');
  const [eyecolor, setEyeColor] = useState<string>('');
  const [culture, setCulture] = useState<string>('');
  const [about, setAbout] = useState<string>('');
  const [diet, setDiet] = useState<string>('');
  const [lifestyle, setLifeStyle] = useState<string>('');
  const [purpose, setPurpose] = useState<string>('');
  const [weddingplan, setWeddingPlan] = useState<string>('');
  const [familystatus, setFamilyStatus] = useState<string>('');
  const [visatype, setVisaType] = useState<string>('');
  const [relocate, setRelocate] = useState<string>('');
  const [manglik, setManglik] = useState<string>('');
  const [countryborn, setCountryBorn] = useState<string>('');
  const [countrygrew, setCountryGrew] = useState<string>('');

  const firstnameRef = useRef(null);
  const middlenameRef = useRef(null);
  const lastnameRef = useRef(null);
  const dobRef = useRef(null);
  const emailRef = useRef(null);
  const genderRef = useRef(null);
  const phonenoRef = useRef(null);
  const communityRef = useRef(null);
  const placeRef = useRef(null);
  const religionRef = useRef(null);
  const casteRef = useRef(null);
  const countryRef = useRef(null);
  const stateRef = useRef(null);
  const cityRef = useRef(null);
  const addressRef = useRef(null);
  const maritialstatusRef = useRef(null);
  const childrenRef = useRef(null);
  const ageRef = useRef(null);
  const educationRef = useRef(null);
  const occupationRef = useRef(null);
  const nationalityRef = useRef(null);
  const passportRef = useRef(null);
  const incomeRef = useRef(null);
  const drinkingRef = useRef(null);
  const smokingRef = useRef(null);
  const weightRef = useRef(null);
  const heightRef = useRef(null);
  const builtRef = useRef(null);
  const complexionRef = useRef(null);
  const haircolorRef = useRef(null);
  const eyecolorRef = useRef(null);
  const cultureRef = useRef(null);
  const aboutRef = useRef(null);
  const dietRef = useRef(null);
  const lifestyleRef = useRef(null);
  const purposeRef = useRef(null);
  const weddingplanRef = useRef(null);
  const familystatusRef = useRef(null);
  const visatypeRef = useRef(null);
  const relocateRef = useRef(null);
  const manglikRef = useRef(null);
  const countrybornRef = useRef(null);
  const countrygrewRef = useRef(null);

  const checkEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  const getCurrentUserDetails = async () => {
    const currentUser = auth().currentUser;

    if (currentUser) {
      try {
        const userDoc = await firestore().collection('users').doc(currentUser.uid).get();

        if (userDoc.exists) {
          const userDataFirestore = userDoc.data();
          setUserData(userDataFirestore);

          setFirstName(userDataFirestore?.firstname);
          setMiddleName(userDataFirestore?.middlename);
          setLastName(userDataFirestore?.lastname);
          setDob(userDataFirestore?.dob);
          setEmail(userDataFirestore?.email);
          setGender(userDataFirestore?.gender);
          setPhoneNo(userDataFirestore?.phoneno);
          setCommunity(userDataFirestore?.community);
          setPlace(userDataFirestore?.place);
          setReligion(userDataFirestore?.religion);
          setCaste(userDataFirestore?.caste);
          setCountry(userDataFirestore?.country);
          setState(userDataFirestore?.state);
          setCity(userDataFirestore?.city);
          setAddress(userDataFirestore?.address);
          setMaritialaStatus(userDataFirestore?.maritialstatus);
          setChildren(userDataFirestore?.children);
          setAge(userDataFirestore?.age);
          setEducation(userDataFirestore?.education);
          setOccupation(userDataFirestore?.occupation);
          setNationality(userDataFirestore?.nationality);
          setPassport(userDataFirestore?.passport);
          setIncome(userDataFirestore?.income);
          setDrinking(userDataFirestore?.drinking);
          setSmoking(userDataFirestore?.smoking);
          setWeight(userDataFirestore?.weight);
          setHeight(userDataFirestore?.height);
          setComplexion(userDataFirestore?.complexion);
          setHairColor(userDataFirestore?.haircolor);
          setEyeColor(userDataFirestore?.eyecolor);
          setCulture(userDataFirestore?.culture);
          setAbout(userDataFirestore?.about);
          setDiet(userDataFirestore?.diet);
          setLifeStyle(userDataFirestore?.lifestyle);
          setPurpose(userDataFirestore?.purpose);
          setWeddingPlan(userDataFirestore?.weddingplan);
          setFamilyStatus(userDataFirestore?.familystatus);
          setVisaType(userDataFirestore?.visatype);
          setRelocate(userDataFirestore?.relocate);
          setManglik(userDataFirestore?.manglik);
          setCountryBorn(userDataFirestore?.countryborn);
          setCountryGrew(userDataFirestore?.countrygrew);
        } else {
          console.log("No user data found for this UID");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    } else {
      console.log("No user is currently authenticated.");
    }
  }

  useEffect(() => {
    getCurrentUserDetails();
  }, []);

  const clearRefs = () => {
    firstnameRef?.current?.blur();
    middlenameRef?.current?.blur();
    lastnameRef?.current?.blur();
    dobRef?.current?.blur();
    emailRef?.current?.blur();
    genderRef?.current?.blur();
    phonenoRef?.current?.blur();
    communityRef?.current?.blur();
    placeRef?.current?.blur();
    religionRef?.current?.blur();
    casteRef?.current?.blur();
    countryRef?.current?.blur();
    stateRef?.current?.blur();
    cityRef?.current?.blur();
    addressRef?.current?.blur();
    maritialstatusRef?.current?.blur();
    childrenRef?.current?.blur();
    ageRef?.current?.blur();
    educationRef?.current?.blur();
    occupationRef?.current?.blur();
    nationalityRef?.current?.blur();
    passportRef?.current?.blur();
    incomeRef?.current?.blur();
    drinkingRef?.current?.blur();
    smokingRef?.current?.blur();
    weightRef?.current?.blur();
    heightRef?.current?.blur();
    builtRef?.current?.blur();
    complexionRef?.current?.blur();
    haircolorRef?.current?.blur();
    eyecolorRef?.current?.blur();
    cultureRef?.current?.blur();
    aboutRef?.current?.blur();
    dietRef?.current?.blur();
    lifestyleRef?.current?.blur();
    purposeRef?.current?.blur();
    weddingplanRef?.current?.blur();
    familystatusRef?.current?.blur();
    visatypeRef?.current?.blur();
    relocateRef?.current?.blur();
    manglikRef?.current?.blur();
    countrybornRef?.current?.blur();
    countrygrewRef?.current?.blur();
  }

  const handleUserUpdate = async () => {
    const currentUser = auth().currentUser;

    if (!firstname || !middlename || !lastname || !dob || !checkEmail(email)) {
      Alert.alert("Error", "Please fill all the fields before updating.");
      return;
    }

    if (currentUser) {
      try {
        await firestore()
          .collection('users')
          .doc(currentUser.uid)
          .update({
            firstname: firstname,
            middlename: middlename,
            lastname: lastname,
            dob: dob,
            email: email,
            gender: gender,
            phoneno: phoneno,
            community: community,
            place: place,
            religion: religion,
            caste: caste,
            state: state,
            city: city,
            address: address,
            maritialstatus: maritialstatus,
            children: children,
            age: age,
            education: education,
            occupation: occupation,
            nationality: nationality,
            passport: passport,
            income: income,
            drinking: drinking,
            smoking: smoking,
            weight: weight,
            height: height,
            built: built,
            complexion: complexion,
            haircolor: haircolor,
            eyecolor: eyecolor,
            culture: culture,
            about: about,
            diet: diet,
            lifestyle: lifestyle,
            purpose: purpose,
            weddingplan: weddingplan,
            familystatus: familystatus,
            visatype: visatype,
            relocate: relocate,
            manglik: manglik,
            countryborn: countryborn,
            countrygrew: countrygrew
          });

        Alert.alert('Success', 'Your profile has been updated.');
        clearRefs();
        setUserData(prevData => ({
          ...prevData, firstname, middlename, lastname, dob, email, gender,
          phoneno, community, place, religion, country, state, city, address, maritialstatus,
          children, age, education, occupation, nationality, passport, income, drinking, smoking,
          weight, height, built, complexion, haircolor, eyecolor, culture, about, lifestyle, purpose,
          visatype, relocate, manglik, countryborn, countrygrew
        }));

      } catch (error) {
        console.error("Error updating user data:", error);
        Alert.alert('Error', 'There was an issue updating your profile.');
      }
    }
  }

  const handleEmailChange = (newEmail: string) => {
    if (!isEmailEdited) {
      setEmail(newEmail);
    }
  };

  return (
    <SafeAreaView style={styles.safearea}>
      <ScrollView style={styles.main}>
        <Header navigation={navigation} />
        <View style={styles.container}>
          <View style={styles.profile} >
            <Text style={styles.profiletext}>CREATE PROFILE</Text>
          </View>

          <View>
            <Text style={styles.label}>First Name</Text>
            <TextInput
              style={styles.input}
              placeholder='First Name'
              placeholderTextColor="#EBC7B1"
              value={firstname}
              onChangeText={setFirstName}
              editable={userData?.firstname? false : true}
              ref={firstnameRef}
            />
          </View>

          <View>
            <Text style={styles.label}>Middle Name</Text>
            <TextInput
              placeholder='Middle Name'
              style={styles.input}
              placeholderTextColor="#EBC7B1"
              value={middlename}
              onChangeText={setMiddleName}
              editable={userData?.middlename? false : true}
              ref={middlenameRef}
            />
          </View>

          <View>
            <Text style={styles.label}>Last Name</Text>
            <TextInput
              placeholder='Last Name'
              style={styles.input}
              placeholderTextColor="#EBC7B1"
              value={lastname}
              onChangeText={setLastName}
              editable={userData?.lastname? false : true}
              ref={lastnameRef}
            />
          </View>
          <View>
            <Text style={styles.label}>Gender</Text>
            <TextInput
              placeholder='Gender'
              style={styles.input}
              placeholderTextColor="#EBC7B1"
              value={gender}
              onChangeText={setGender}
              editable={userData?.gender? false : true}
              ref={genderRef}
            />
          </View>
          <View>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              placeholder='Phone Number'
              style={styles.input}
              placeholderTextColor="#EBC7B1"
              value={phoneno}
              onChangeText={setPhoneNo}
              editable={userData?.phoneno? false : true}
              ref={phonenoRef}
            />
          </View>
          <View>
            <Text style={styles.label}>Community</Text>
            <TextInput
              placeholder='Community'
              style={styles.input}
              placeholderTextColor="#EBC7B1"
              value={community}
              onChangeText={setCommunity}
              editable={userData?.community? false : true}
              ref={communityRef}
            />
          </View>
          <View>
          <Text style={styles.label}>Place</Text>
            <TextInput
              placeholder='Place'
              style={styles.input}
              placeholderTextColor="#EBC7B1"
              value={place}
              onChangeText={setPlace}
              editable={userData?.place? false : true}
              ref={placeRef}
            />
          </View>
          <View>
          <Text style={styles.label}>Date of Birth</Text>
            <TextInput
              placeholder='Date of Birth'
              style={styles.input}
              placeholderTextColor="#EBC7B1"
              value={dob}
              onChangeText={setDob}
              editable={userData?.dob? false : true}
              ref={dobRef}
            />
          </View>

          <View>
          <Text style={styles.label}>Email</Text>
            <TextInput
              placeholder='Email'
              style={styles.input}
              placeholderTextColor="#EBC7B1"
              value={email}
              onChangeText={handleEmailChange}
              editable={userData?.email? false : true}
              ref={emailRef}
            />
          </View>

          <View>
          <Text style={styles.label}>Religion</Text>
            <TextInput
              placeholder='Religion'
              style={styles.input}
              placeholderTextColor="#EBC7B1"
              value={religion}
              onChangeText={setReligion}
              editable={userData?.religion? false : true}
              ref={religionRef}
            />
          </View>

          <View>
          <Text style={styles.label}>Caste</Text>
            <TextInput
              placeholder='Caste'
              style={styles.input}
              placeholderTextColor="#EBC7B1"
              value={caste}
              onChangeText={setCaste}
              editable={userData?.caste? false : true}
              ref={casteRef}
            />
          </View>

          <View>
          <Text style={styles.label}>Country</Text>
            <TextInput
              placeholder='Country'
              style={styles.input}
              placeholderTextColor="#EBC7B1"
              value={country}
              onChangeText={setCountry}
              editable={userData?.country? false : true}
              ref={countryRef}
            />
          </View>

          <View>
          <Text style={styles.label}>State</Text>
            <TextInput
              placeholder='State'
              style={styles.input}
              placeholderTextColor="#EBC7B1"
              value={state}
              onChangeText={setState}
              editable={userData?.state? false : true}
              ref={stateRef}
            />
          </View>

          <View>
          <Text style={styles.label}>City</Text>
            <TextInput
              placeholder='City'
              style={styles.input}
              placeholderTextColor="#EBC7B1"
              value={city}
              onChangeText={setCity}
              editable={userData?.city? false : true}
              ref={cityRef}
            />
          </View>
          <View>
          <Text style={styles.label}>Address</Text>
            <TextInput
              placeholder='Address'
              style={styles.input}
              placeholderTextColor="#EBC7B1"
              value={address}
              onChangeText={setAddress}
              editable={userData?.address? false : true}
              ref={religionRef}
            />
          </View>

          <View>
          <Text style={styles.label}>Maritial Status</Text>
            <TextInput
              placeholder='Maritial Status'
              style={styles.input}
              placeholderTextColor="#EBC7B1"
              value={maritialstatus}
              onChangeText={setMaritialaStatus}
              editable={userData?.maritialstatus? false : true}
              ref={maritialstatusRef}
            />
          </View>

          <View>
          <Text style={styles.label}>Children</Text>
            <TextInput
              placeholder='Children'
              style={styles.input}
              placeholderTextColor="#EBC7B1"
              value={children}
              onChangeText={setChildren}
              editable={userData?.children? false : true}
              ref={childrenRef}
            />
          </View>

          <View>
          <Text style={styles.label}>Age</Text>
            <TextInput
              placeholder='Age'
              style={styles.input}
              placeholderTextColor="#EBC7B1"
              value={age}
              onChangeText={setAge}
              editable={userData?.age? false : true}
              ref={ageRef}
            />
          </View>

          <View>
          <Text style={styles.label}>Education</Text>
            <TextInput
              placeholder='Education'
              style={styles.input}
              placeholderTextColor="#EBC7B1"
              value={education}
              onChangeText={setEducation}
              editable={userData?.education? false : true}
              ref={educationRef}
            />
          </View>

          <View>
          <Text style={styles.label}>Occupation</Text>
            <TextInput
              placeholder='Occupation'
              style={styles.input}
              placeholderTextColor="#EBC7B1"
              value={occupation}
              onChangeText={setOccupation}
              editable={userData?.occupation? false : true}
              ref={occupationRef}
            />
          </View>

          <View>
          <Text style={styles.label}>Nationality</Text>
            <TextInput
              placeholder='Nationality'
              style={styles.input}
              placeholderTextColor="#EBC7B1"
              value={occupation}
              onChangeText={setOccupation}
              editable={userData?.religion? false : true}
              ref={occupationRef}
            />
          </View>

          <View>
          <Text style={styles.label}>Passport</Text>
            <TextInput
              placeholder='Passport'
              style={styles.input}
              placeholderTextColor="#EBC7B1"
              value={passport}
              onChangeText={setPassport}
              editable={userData?.passport? false : true}
              ref={passportRef}
            />
          </View>

          <View>
          <Text style={styles.label}>Income</Text>
            <TextInput
              placeholder='Income'
              style={styles.input}
              placeholderTextColor="#EBC7B1"
              value={income}
              onChangeText={setIncome}
              editable={userData?.religion? false : true}
              ref={religionRef}
            />
          </View>

          <View>
          <Text style={styles.label}>Drinking</Text>
            <TextInput
              placeholder='Drinking'
              style={styles.input}
              placeholderTextColor="#EBC7B1"
              value={drinking}
              onChangeText={setDrinking}
              editable={userData?.drinking? false : true}
              ref={drinkingRef}
            />
          </View>

          <View>
          <Text style={styles.label}>Smoking</Text>
            <TextInput
              placeholder='Smoking'
              style={styles.input}
              placeholderTextColor="#EBC7B1"
              value={smoking}
              onChangeText={setSmoking}
              editable={userData?.smoking? false : true}
              ref={smokingRef}
            />
          </View>

          <View>
          <Text style={styles.label}>Weight</Text>
            <TextInput
              placeholder='Weight'
              style={styles.input}
              placeholderTextColor="#EBC7B1"
              value={weight}
              onChangeText={setWeight}
              editable={userData?.weight? false : true}
              ref={weightRef}
            />
          </View>

          <View>
          <Text style={styles.label}>Height</Text>
            <TextInput
              placeholder='Height'
              style={styles.input}
              placeholderTextColor="#EBC7B1"
              value={height}
              onChangeText={setHeight}
              editable={userData?.height? false : true}
              ref={heightRef}
            />
          </View>

          <View>
          <Text style={styles.label}>Built</Text>
            <TextInput
              placeholder='Built'
              style={styles.input}
              placeholderTextColor="#EBC7B1"
              value={built}
              onChangeText={setBuilt}
              editable={userData?.built? false : true}
              ref={builtRef}
            />
          </View>

          <View>
          <Text style={styles.label}>Complexion</Text>
            <TextInput
              placeholder='Complexion'
              style={styles.input}
              placeholderTextColor="#EBC7B1"
              value={complexion}
              onChangeText={setComplexion}
              editable={userData?.complexion? false : true}
              ref={complexionRef}
            />
          </View>

          <View>
          <Text style={styles.label}>Hair Color</Text>
            <TextInput
              placeholder='Hair Color'
              style={styles.input}
              placeholderTextColor="#EBC7B1"
              value={haircolor}
              onChangeText={setHairColor}
              editable={userData?.built? false : true}
              ref={builtRef}
            />
          </View>

          <View>
          <Text style={styles.label}>Eye Color</Text>
            <TextInput
              placeholder='Eye Color'
              style={styles.input}
              placeholderTextColor="#EBC7B1"
              value={eyecolor}
              onChangeText={setEyeColor}
              editable={userData?.eyecolor? false : true}
              ref={eyecolorRef}
            />
          </View>

          <View>
          <Text style={styles.label}>Culture</Text>
            <TextInput
              placeholder='Culture'
              style={styles.input}
              placeholderTextColor="#EBC7B1"
              value={culture}
              onChangeText={setCulture}
              editable={userData?.culture? false : true}
              ref={cultureRef}
            />
          </View>

          <View>
          <Text style={styles.label}>About</Text>
            <TextInput
              placeholder='About'
              style={styles.input}
              placeholderTextColor="#EBC7B1"
              value={about}
              onChangeText={setAbout}
              editable={userData?.built? false : true}
              ref={aboutRef}
            />
          </View>

          <View>
          <Text style={styles.label}>Diet</Text>
            <TextInput
              placeholder='Diet'
              style={styles.input}
              placeholderTextColor="#EBC7B1"
              value={diet}
              onChangeText={setDiet}
              editable={userData?.diet? false : true}
              ref={dietRef}
            />
          </View>

          <View>
          <Text style={styles.label}>Lifestyle</Text>
            <TextInput
              placeholder='Lifestyle'
              style={styles.input}
              placeholderTextColor="#EBC7B1"
              value={lifestyle}
              onChangeText={setLifeStyle}
              editable={userData?.lifestyle? false : true}
              ref={lifestyleRef}
            />
          </View>

          <View>
          <Text style={styles.label}>Purpose</Text>
            <TextInput
              placeholder='Purpose'
              style={styles.input}
              placeholderTextColor="#EBC7B1"
              value={purpose}
              onChangeText={setPurpose}
              editable={userData?.purpose? false : true}
              ref={purposeRef}
            />
          </View>

          <View>
          <Text style={styles.label}>Wedding Plan</Text>
            <TextInput
              placeholder='Wedding Plan'
              style={styles.input}
              placeholderTextColor="#EBC7B1"
              value={weddingplan}
              onChangeText={setWeddingPlan}
              editable={userData?.weddingplan? false : true}
              ref={weddingplanRef}
            />
          </View>

          <View>
          <Text style={styles.label}>Family Status</Text>
            <TextInput
              placeholder='Family Status'
              style={styles.input}
              placeholderTextColor="#EBC7B1"
              value={familystatus}
              onChangeText={setFamilyStatus}
              editable={userData?.familystatus? false : true}
              ref={familystatusRef}
            />
          </View>

          <View>
          <Text style={styles.label}>Visa Type</Text>
            <TextInput
              placeholder='Visa Type'
              style={styles.input}
              placeholderTextColor="#EBC7B1"
              value={visatype}
              onChangeText={setVisaType}
              editable={userData?.visatype? false : true}
              ref={visatypeRef}
            />
          </View>

          <View>
          <Text style={styles.label}>Relocate</Text>
            <TextInput
              placeholder='Relocate'
              style={styles.input}
              placeholderTextColor="#EBC7B1"
              value={relocate}
              onChangeText={setRelocate}
              editable={userData?.relocate? false : true}
              ref={relocateRef}
            />
          </View>

          <View>
          <Text style={styles.label}>Manglik</Text>
            <TextInput
              placeholder='Manglik'
              style={styles.input}
              placeholderTextColor="#EBC7B1"
              value={manglik}
              onChangeText={setManglik}
              editable={userData?.manglik? false : true}
              ref={manglikRef}
            />
          </View>

          <View>
          <Text style={styles.label}>Country Born</Text>
            <TextInput
              placeholder='Country Born'
              style={styles.input}
              placeholderTextColor="#EBC7B1"
              value={countryborn}
              onChangeText={setCountryBorn}
              editable={userData?.countryborn? false : true}
              ref={countrybornRef}
            />
          </View>

          <View>
          <Text style={styles.label}>Country Grew</Text>
            <TextInput
              placeholder='Country Grew'
              style={styles.input}
              placeholderTextColor="#EBC7B1"
              value={countrygrew}
              onChangeText={setCountryGrew}
              editable={userData?.countrygrew? false : true}
              ref={countrygrewRef}
            />
          </View>

          <TouchableOpacity style={styles.creat} onPress={handleUserUpdate}>
            <Text style={styles.creattext}>Create Profile</Text>
          </TouchableOpacity>
        </View>


      </ScrollView>
    </SafeAreaView>
  )
}

export default CreateProfile

const styles = StyleSheet.create({
  safearea: {
    flex: 1,
    backgroundColor: 'white',
  },
  main: {
    flexGrow: 1,
  },
  container: {
    backgroundColor: '#f5f5f5',
    flex: 1,
    gap: width / 30,
    paddingLeft: width / 20,
    paddingRight: width / 20,
    paddingBottom: width / 30
  },
  profile: {
    alignItems: 'center',
    padding: 20,
  },
  profiletext: {
    fontSize: 25,
    color: '#792A37'
  },
  label: {
    color: 'black'
  },
  input: {
    borderColor: '#EBC7B1',
    borderWidth: 1,
    borderRadius: 12,
    paddingLeft: width / 40,
    color: '#EBC7B1'
  },
  creat: {
    borderRadius: 12,
    backgroundColor: '#a4737b',
    padding: width / 30
  },
  creattext: {
    color: 'white',
    textAlign: 'center',
  }

})