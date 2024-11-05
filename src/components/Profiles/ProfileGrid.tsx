import { Dimensions, FlatList, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ProfileImage from './ProfileImage'

const numColumns = 2;
const { width } = Dimensions.get('window');
const itemSize = width / numColumns;
const gap = 20;

const ProfileGrid: React.FC = ({ data }) => {
  return (
    <View style={styles.container}>
      <FlatList
      style={{ flex: 0 }}
        data={data}
        initialNumToRender={data.length}
        renderItem={({ item }) => <ProfileImage imgSource={item.imgSource} name={item.name} />}
        keyExtractor={item => item.id}
        numColumns={numColumns}
        showsVerticalScrollIndicator={false}
        />
    </View>
  )
}

export default ProfileGrid

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    alignItems:'center',
    marginTop: 10
  }
})