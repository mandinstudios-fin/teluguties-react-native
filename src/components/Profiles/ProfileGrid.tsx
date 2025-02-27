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
import AgentsProfileImage from '../AgentsProfileImage/AgentsProfileImage';

const numColumns = 1;
const {width} = Dimensions.get('window');
const itemSize = width / numColumns;
const gap = 20;

interface ProfileGridProps {
  data: [];
  navigation:any;
  isAgent?: boolean
}

const ProfileGrid = ({data, navigation, isAgent = false} : ProfileGridProps) => {
  return (
    isAgent ? 
    (<FlatList
      data={data}
      contentContainerStyle={[
        styles.container,
        
      ]}
      initialNumToRender={data?.length | 0}
      renderItem={({item}) => (
        <AgentsProfileImage agent={item} navigation={navigation} />
      )}
      keyExtractor={item => item.id}
      showsVerticalScrollIndicator={false}
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
    />)
    :
    (<FlatList
      data={data}
      contentContainerStyle={[
        styles.container,
        
      ]}
      initialNumToRender={data?.length | 0}
      renderItem={({item}) => (
        <ProfileImage user={item} navigation={navigation} profiles={data}/>
      )}
      keyExtractor={item => item.id}
      showsVerticalScrollIndicator={false}
      

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
    />)
  );
};

export default ProfileGrid;

const styles = StyleSheet.create({
  container: {
    flex:1,
    gap: 15,
    alignItems:'center',
    paddingHorizontal: 15
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
