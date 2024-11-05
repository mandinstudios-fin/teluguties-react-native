import {SafeAreaView, StyleSheet, Text, View, Image, TouchableOpacity, Dimensions} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { createStackNavigator } from '@react-navigation/stack';
import { DATA } from '../../utils';
import ProfileGrid from '../Profiles/ProfileGrid';
import { BottomTabBar, useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import Header from '../Header/Header';

const Stack = createStackNavigator();
const { width } = Dimensions.get('window')
let bottomPadding = 0;

const Home = ({ navigation }) => {
  const tabBarHeight = useBottomTabBarHeight(); 
  bottomPadding = tabBarHeight

  return (
    <SafeAreaView style={styles.safearea}>
      <View style={styles.main}>
        <Header navigation={navigation}/>
        <View style={styles.boxContainer}>
          <View style={styles.box}></View>
        </View>

        <View style={styles.container}>
          <View style={styles.subnavigationbar}>
            {/* <TouchableOpacity onPress={() => navigation.push('Matches')}>
              <Text style={styles.subnavigationtext}>My Matches</Text>
            </TouchableOpacity> */}
            <TouchableOpacity onPress={() => navigation.push('Daily')}>
              <Text style={styles.subnavigationactivetext}>Daily</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.push('New')}>
              <Text style={styles.subnavigationtext}>New</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.push('Shortlist')}>
              <Text style={styles.subnavigationtext}>Shortlist</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.push('RecentlyViewed')}>
              <Text style={styles.subnavigationtext}>Recently Viewed</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.profilegridcontainer}><ProfileGrid data={DATA}/></View>
      </View>
    </SafeAreaView>
  );
}; 

export default Home;

const styles = StyleSheet.create({
  safearea: {
    flex: 1,
    backgroundColor: 'white'
  },
  main: {
    flexGrow: 1
  },
  topsection:{
    paddingHorizontal:10,
    paddingTop: 10,
    display:'flex',
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center'
  },

  profile:{
    backgroundColor:'#AFAFAF',
    height:50,
    width:50,
    borderRadius:200
  },

  logo: {
    alignItems: 'center',
    marginBottom:10
  },

  image: {
    height: 100,
    width: 300,
    resizeMode: 'contain',
  },
  boxContainer: {
    paddingHorizontal:10
  },
  box:{
    backgroundColor:'transparent',
    borderColor:'#AFAFAF',
    borderWidth:0.5,
    height:80,
    width:'100%',
    borderRadius:15,
    marginBottom:10
  },
  subnavigationbar:{
    display:'flex',
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between',
  },
  subnavigationtext:{
    fontSize:15,
    color: '#a4737b'
  },
  subnavigationactivetext: {
    fontSize:15,
    color: '#7b2a39',
    fontWeight: 'bold'
  },
  container:{
    marginBottom:10,
    paddingHorizontal:10
  }
  

});
