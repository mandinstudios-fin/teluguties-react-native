import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const UserProfileDetails = ({ route }) => {
    const { user } = route.params
  return (
    <View>
      <Text>{user?.name}</Text>
    </View>
  )
}

export default UserProfileDetails

const styles = StyleSheet.create({})