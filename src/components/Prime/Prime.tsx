import { Dimensions, FlatList, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Header from '../Header/Header'
import { data } from '../../utils'
import Unorderedlist from 'react-native-unordered-list';

const { width, height } = Dimensions.get('window');

const membershipData = [
  { id: '1', title: 'Prime Plus', price: '₹2000' },
  { id: '2', title: 'Platinum Plus', price: '₹4000' },
  { id: '3', title: 'Diamond Plus', price: '₹6000' },
];


const renderItem = ({ item }) => (

  <View style={styles.box}>
    <View style={styles.membershipcontainer}>
      <Text style={styles.membershiptext}>{item.title}</Text>
      <Text style={styles.validity}>3months validity </Text>
    </View>
    <View>
      <Text style={styles.price}>{item.price}</Text>
    </View>
    <View style={styles.boxContainer}>
      <TouchableOpacity style={styles.subscribe}>
        <Text style={styles.subscribetext}>Subscribe</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const Prime = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.safearea}>
      <ScrollView contentContainerStyle={styles.main} style={styles.scrollView}>

        <View style={styles.logo}>
          <Image
            style={styles.image}
            source={require('../../assets/logo.png')}
          />
        </View>

        <View style={styles.boxesholder}>
          <FlatList
            data={membershipData}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingBottom: 20, flexGrow: 1, justifyContent: 'space-between' }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Prime

const styles = StyleSheet.create({
  safearea: {
    flex: 1,
    backgroundColor: 'white'
  },
  main: {
    flexGrow: 1,
  },
  scrollView: {
    flex: 1,
  },
  logo: {
    marginTop: width / 10,
    height: height / 10,
    width: width,
    alignItems: 'center',
  },
  image: {
    height: 60,
    width: '100%',
    resizeMode: 'contain',
  },
  boxesholder: {
    flex: 1,
    paddingLeft: width / 25,
    marginRight: width / 25,
    gap: 25,
    
  },
  boxContainer: {
    display: 'flex',
    alignItems: "center"
  },
  box: {
    backgroundColor: 'transparent',
    borderColor: '#AFAFAF',
    borderWidth: 0.7,
    width: width - width / 12,
    borderRadius: 15,
    marginBottom: 20,
    paddingHorizontal: width * 0.05,
    paddingVertical: width * 0.07
  },
  membershipcontainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 22
  },
  membershiptext: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#e4bd9e',
  },
  subscribe: {
    borderRadius: 25,
    backgroundColor: '#a4737b',
    padding: width / 30,
    marginTop: 20,
    width: "75%"
  },
  subscribetext: {
    color: 'white',
    textAlign: 'center',
  },
  validity: {
    borderRadius: 10,
    backgroundColor: '#e4bd9e',
    color: 'white',
    paddingHorizontal: width / 50,
  },
  price:{
    color:'black',
  }


})
