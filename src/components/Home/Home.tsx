import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { createStackNavigator } from '@react-navigation/stack';
import { DATA } from '../../utils';
import ProfileGrid from '../Profiles/ProfileGrid';
import {
  BottomTabBar,
  useBottomTabBarHeight,
} from '@react-navigation/bottom-tabs';
import Header from '../Header/Header';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import useFirestore from '../../hooks/useFirestore';
import Loader from '../Loader/Loader';

const Stack = createStackNavigator();
const { width } = Dimensions.get('window');
let bottomPadding = 0;

const Home = ({ navigation }) => {
  const tabBarHeight = useBottomTabBarHeight();
  bottomPadding = tabBarHeight;

  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const {getHomeData} = useFirestore();

  useEffect(() => {
    const homeData =async () => {
      setLoading(true)
        const data = await getHomeData();
        setData(data);
        setLoading(false)
    } 

    homeData();
  }, []);

  return (
    <SafeAreaView style={styles.safearea}>
      <ScrollView>
        <View style={styles.main}>
          <Header navigation={navigation} />
          <View style={styles.boxContainer}>
            <View style={styles.box}></View>
          </View>
          <View style={styles.container}>
            <View style={styles.subnavigationbar}>
              <TouchableOpacity >
                <Text style={styles.subnavigationactivetext}>Daily</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.push('New')}>
                <Text style={styles.subnavigationtext}>New</Text>
              </TouchableOpacity>
              {/* <TouchableOpacity onPress={() => navigation.push('Shortlist')}>
                <Text style={styles.subnavigationtext}>Shortlist</Text>
              </TouchableOpacity> */}
              <TouchableOpacity
                onPress={() => navigation.push('RecentlyViewed')}>
                <Text style={styles.subnavigationtext}>Recently Viewed</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.push('Likely')}>
                <Text style={styles.subnavigationtext}>Likely</Text>
              </TouchableOpacity>
            </View>
          </View>

          <ProfileGrid navigation={navigation} data={data} />
        </View>
      </ScrollView>
      <View style={loading ? styles.loadingContainer : null}>
        {loading && <Loader/>}
      </View>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  safearea: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollview: {
    flex: 1,
  },
  main: {
    flexGrow: 1,
  },
  topsection: {
    paddingHorizontal: 10,
    paddingTop: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  profile: {
    backgroundColor: '#AFAFAF',
    height: 50,
    width: 50,
    borderRadius: 200,
  },

  logo: {
    alignItems: 'center',
    marginBottom: 10,
  },

  image: {
    height: 100,
    width: 300,
    resizeMode: 'contain',
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
    justifyContent: 'space-between',
  },
  subnavigationtext: {
    fontSize: 15,
    color: '#AFAFAF',
    fontWeight: 'bold',
    fontFamily: 'inter'
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
