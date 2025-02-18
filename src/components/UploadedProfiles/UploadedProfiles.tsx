import {
  ActivityIndicator,
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Header from '../Header/Header';
import ProfileGrid from '../Profiles/ProfileGrid';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import useFirestore from '../../hooks/useFirestore';
import useAgent from '../../hooks/useAgent';

const {width, height, fontScale} = Dimensions.get('window');

const UploadedProfiles = ({navigation}) => {
  const [data, setData] = useState<any>([]);
  const {getRecentlyViewedData} = useFirestore();
  const { getProfilesUploadedByAgent } = useAgent();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
        setLoading(true);
        await getProfilesUploadedByAgent(setData); // Ensure data is fully fetched
        setLoading(false);
    };

    fetchData();
}, []);

  return (
    <SafeAreaView style={styles.safearea}>
      <ScrollView contentContainerStyle={styles.scrollview}>
        <View style={styles.main}>
          <Header navigation={navigation} />
          <View style={styles.boxContainer}>
            <View style={styles.box}></View>
          </View>

          <View style={styles.container}>
            <View style={styles.subnavigationbar}>
              <TouchableOpacity onPress={() => navigation.replace('AgentsLayout')}>
                <Text style={styles.subnavigationtext}>All Profiles</Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text style={styles.subnavigationactivetext}>
                  Uploded Profiles
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {data.length === 0 ? (
            <View style={styles.warncontainer}>
              <View style={styles.imagecontainer}>
                <Image
                  style={styles.image}
                  source={require('../../assets/star.png')}
                />
              </View>
              <Text style={styles.warn}>Woo...!</Text>
              <Text style={styles.warn2}>something awaits on your way! </Text>
            </View>
          ) : (
            <ProfileGrid navigation={navigation} data={data} />
          )}
        </View>
      </ScrollView>
      <View style={loading ? styles.loadingContainer : null}>
        {loading && <ActivityIndicator size="large" color="#a4737b" />}
      </View>
    </SafeAreaView>
  );
};

export default UploadedProfiles;

const styles = StyleSheet.create({
  safearea: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollview: {
    flexGrow: 1,
  },
  main: {
    flex: 1,
  },
  boxContainer: {
    paddingHorizontal: 10,
  },
  box: {
    backgroundColor: 'transparent',
    borderColor: '#AFAFAF',
    borderWidth: 0.5,
    height: 60,
    width: '100%',
    borderRadius: 15,
    marginBottom: 10,
  },

  subnavigationbar: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  subnavigationtext: {
    fontSize: 15,
    color: '#AFAFAF',
    fontWeight: 'bold',
  },
  subnavigationactivetext: {
    fontSize: 15,
    color: '#7b2a39',
    fontWeight: 'bold',
  },
  container: {
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  warncontainer: {
    flex:1,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  warn: {
    fontSize: 20,
    color: '#7b2a38',
    textAlign: 'center',
  },
  warn2: {
    fontSize: 20,
    color: '#000',
    textAlign: 'center',
  },
  imagecontainer: {
    height: height * 0.1,
    width: width,
    display: 'flex',
    alignItems: 'center',
  },
  image: {
    height: '100%',
    resizeMode: 'contain',
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
