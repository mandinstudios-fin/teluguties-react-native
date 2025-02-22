import {
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
import firestore, {Timestamp} from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import useFirestore from '../../hooks/useFirestore';

const {width, height, fontScale} = Dimensions.get('window');

const New = ({navigation}) => {
  const [data, setData] = useState<any>(() => []);
  const{getNewData} = useFirestore();

  useEffect( () => {

    const newData =async () =>{
      const dataN = await getNewData();
      setData(dataN || []);
      console.log(dataN)

    }

    newData();
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
              <TouchableOpacity onPress={() => navigation.push('Home')}>
                <Text style={styles.subnavigationtext}>Daily</Text>
              </TouchableOpacity>
              <TouchableOpacity >
                <Text style={styles.subnavigationactivetext}>New</Text>
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
          {data?.length === 0 ? (
            <View style={styles.warncontainer}>
              <View style={styles.imagecontainer}>
              <Image style={styles.image} source={require('../../assets/star.png')}/>
            </View>
            <Text style={styles.warn}>Woo...!</Text>
            <Text style={styles.warn2}>something awaits on your way! </Text>
            </View>
          ) : (
            <ProfileGrid navigation={navigation} data={data} />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default New;

const styles = StyleSheet.create({
  safearea: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollview: {
    flexGrow: 1
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
    justifyContent: 'space-between',
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
    flex: 1,
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
    textAlign: 'center'
  },
  imagecontainer:{
    height:height*0.1,
    width:width,
    display:'flex',
    alignItems:'center'
  },
  image:{
    height:'100%',
    resizeMode:'contain'
  }
});
