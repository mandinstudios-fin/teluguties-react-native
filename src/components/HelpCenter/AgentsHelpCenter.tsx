import {
    ActivityIndicator,
    Alert,
    Dimensions,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
  } from 'react-native';
  import React, { useEffect, useRef, useState } from 'react';
  import Header from '../Header/Header';
  import auth from '@react-native-firebase/auth';
  import firestore from '@react-native-firebase/firestore';
  import useToastHook from '../../utils/useToastHook';
  import { getUserCategory } from '../../utils';
  import DrawerSceneWrapper from '../Navigation/draw';
import AgentsHeader from '../Header/AgentsHeader';
  
  const { width, height } = Dimensions.get('window');
  
  const AgentsHelpCenter = ({ navigation }) => {
    const [loading, setLoading] = useState(false);
    const [category, setCategory] = useState('');
    const [message, setMessage] = useState('');
    const { successToast, errorToast } = useToastHook();
  
    const sendMessageToAdmin = async () => {
      const userId = auth().currentUser?.uid;
  
      if (!message) {
        Alert.alert('Enter your query');
        return;
      }
      setLoading(true);
      try {
        await firestore().collection('queries').add({
          message,
          userId,
          sentAt: firestore.FieldValue.serverTimestamp(),
          userType: category === 'profiles' ? 'Individual' : 'Agent'
        });
        successToast('Message sent successfully...');
        setMessage('');
      } catch (error) {
        errorToast('Error sending message. Please try after some time...');
      }
      setLoading(false);
    };
  
    useEffect(() => {
      const handleSetCategory = async () => {
        const result = await getUserCategory();
        setCategory(result)
      }
  
      handleSetCategory();
    }, [])
  
    return (
      < DrawerSceneWrapper>
        <SafeAreaView style={styles.safearea}>
          <ScrollView contentContainerStyle={styles.scrollview}>
            <View style={styles.main}>
              <AgentsHeader navigation={navigation} />
              <View style={styles.boxContainer}>
                <View style={styles.box}></View>
              </View>
              <View style={styles.form}>
                <View style={styles.imagecontainer}>
                  <Image
                    style={styles.image}
                    source={require('../../assets/message.png')}
                  />
                </View>
                <Text style={styles.head}>How can we help</Text>
                <Text style={styles.head}>you today?</Text>
  
                <View style={styles.msgbox}>
                  <Text style={styles.msg}>Give more information</Text>
                  <Text style={styles.msg}>
                    about your problem please drop your query
                  </Text>
                </View>
  
                <View style={styles.inputbox}>
                  <TextInput
                    value={message}
                    onChangeText={setMessage}
                    style={styles.input}
                    multiline={true}
                    placeholder="Message..."
                    placeholderTextColor={'black'}
                  />
                </View>
                <View style={styles.submitbox}>
                  <TouchableOpacity
                    style={styles.submitcontainer}
                    onPress={sendMessageToAdmin}>
                    <Text style={styles.submittext}>Submit</Text>
                  </TouchableOpacity>
                </View>
              </View>
  
            </View>
          </ScrollView>
          <View style={loading ? styles.loadingContainer : null}>
            {loading && <ActivityIndicator size="large" color="#a4737b" />}
          </View>
        </SafeAreaView>
      </DrawerSceneWrapper>
    );
  };
  
  export default AgentsHelpCenter;
  
  const styles = StyleSheet.create({
    safearea: {
      flex: 1,
      backgroundColor: 'white',
    },
    scrollview: {
      flexGrow: 1,
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
    imagecontainer: {
      height: height * 0.2,
      width: width,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    image: {
      height: '100%',
      resizeMode: 'contain',
    },
    form: {
      flex: 1,
      paddingHorizontal: width * 0.04,
    },
    head: {
      fontSize: 40,
      fontWeight: 'bold',
      color: '#7b2a38',
      textAlign: 'center',
    },
    msgbox: {
      marginTop: width * 0.04,
    },
    msg: {
      color: 'black',
      textAlign: 'center',
    },
    inputbox: {
      height: height * 0.2,
      marginTop: width * 0.09,
    },
    input: {
      backgroundColor: '#e7e7e7',
      padding: 10,
      flex: 1,
      justifyContent: 'flex-start',
      textAlignVertical: 'top',
      borderRadius: 12,
      color: '#000',
    },
    submitbox: {
      display: 'flex',
      alignItems: 'flex-end',
      marginTop: width * 0.04,
    },
    submitcontainer: {
      paddingHorizontal: width * 0.1,
      paddingVertical: width * 0.05,
      backgroundColor: '#7b2a38',
      borderRadius: 5,
    },
    submittext: {
      fontWeight: 'bold',
      color: 'white',
      fontSize: 15,
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
  