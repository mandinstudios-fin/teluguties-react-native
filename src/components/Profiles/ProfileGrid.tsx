import {
  Animated,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import React, {useEffect, useState} from 'react';
import auth from '@react-native-firebase/auth';

import ProfileImage from './ProfileImage';

const numColumns = 2;
const {width} = Dimensions.get('window');
const itemSize = width / numColumns;
const gap = 20;

const ProfileGrid: React.FC = ({data, navigation}) => {
  return (
    <FlatList
      data={data}
      contentContainerStyle={[
        styles.container,
        
      ]}
      initialNumToRender={data.length}
      renderItem={({item}) => (
        <ProfileImage user={item} navigation={navigation} />
      )}
      keyExtractor={item => item.id}
      numColumns={numColumns}
      showsVerticalScrollIndicator={false}
      
      columnWrapperStyle={{ gap: 15 }}

      ListHeaderComponent={
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>{''}</Text>
        </View>
      }
    
      ListFooterComponent={
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>{''}</Text>
        </View>
      }
    />
  );
};

export default ProfileGrid;

const styles = StyleSheet.create({
  container: {
    flex:1,
    gap: 15,
    alignItems:'center',
  },
  oneitem: {
    alignItems: 'center',
  },
  manyitems: {
    alignItems: 'center',
  },
  headerContainer: {
    backgroundColor: '#f0f0f0',
    height:0,
  },
  headerText: {
    fontSize: 0,
    fontWeight: 'bold',
    color: '#333',
  },
  footerContainer: {
    backgroundColor: '#f0f0f0',
    height:0,
  },
  footerText: {
    fontSize: 0,
    color: '#888',
    textAlign: 'center',
  },
 
});
