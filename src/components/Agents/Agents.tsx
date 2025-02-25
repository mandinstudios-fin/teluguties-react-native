import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Header from '../Header/Header';
import React, {useEffect, useState} from 'react';
import ProfileGrid from '../Profiles/ProfileGrid';
import useFirestore from '../../hooks/useFirestore';
import useAgent from '../../hooks/useAgent';

const Agents = ({navigation}) => {
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const {getAgentsData} = useAgent();

  useEffect(() => {
    const agentData = async () => {
       const unsubscribe =   getAgentsData(setData);
       return () => unsubscribe()
    }
    agentData();
    console.log(data)

  },[])

  return (
    <SafeAreaView style={styles.safearea}>
      <ScrollView contentContainerStyle={styles.main}>
        <View>
          <Header navigation={navigation} />
          <View style={styles.boxContainer}>
            <View style={styles.box}></View>
          </View>
          <View>
            <Text style={styles.agenttext}>Agents Profiles</Text>
          </View>
          <ProfileGrid navigation={navigation} data={data} isAgent={true} />
        </View>
      </ScrollView>
      <View style={loading ? styles.loadingContainer : null}>
        {loading && <ActivityIndicator size="large" color="#a4737b" />}
      </View>
    </SafeAreaView>
  );
};

export default Agents;

const styles = StyleSheet.create({
  safearea: {
    flex: 1,
    backgroundColor: 'white',
  },
  main: {
    flexGrow: 1,
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
  agenttext: {
    color: '#000',
    fontSize: 25,
    textAlign: 'center',
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
