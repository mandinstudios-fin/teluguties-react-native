import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import Header from '../Header/Header'
import ProfileGrid from '../Profiles/ProfileGrid'

const Matches = ({ navigation }) => {
  const [data, setData] = useState<any>([]);
  return (
    <SafeAreaView style={styles.safearea}>
      <View style={styles.main}>
        <Header navigation={navigation}/>
        <View style={styles.boxContainer}>
          <View style={styles.box}></View>
        </View>
        <View style={styles.profilegridcontainer}><ProfileGrid navigation={navigation} data={data} /></View>
      </View>
    </SafeAreaView>
  )
}

export default Matches

const styles = StyleSheet.create({
  safearea: {
    flex: 1,
    backgroundColor: 'white',
  },
  main: {
    flexGrow: 1
  },
  boxContainer: {
    paddingHorizontal: 10
  },
  box: {
    backgroundColor: 'transparent',
    borderColor: '#AFAFAF',
    borderWidth: 0.5,
    height: 80,
    width: '100%',
    borderRadius: 15,
    marginBottom: 10
  },
})