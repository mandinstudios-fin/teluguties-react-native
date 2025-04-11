import React, { useEffect, useState } from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AuthNavigation from './AuthNavigation';
import Layout from './_layout';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text } from 'react-native';
import Steps from '../Steps/Steps';
import AgentsLayout from './AgentsLayout';

import { navigate, navigationRef, resetNavigation } from './Navigation';
import { getUserCategoryFromToken } from '../../utils';
import Loader from '../Loader/Loader';

const Stack = createStackNavigator();

const Navigator = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Add a loading state
  const [category, setCategory] = useState('');



  useEffect(() => {
    const checkAuthenticatedUser = async () => {
      try {
        const userToken = await AsyncStorage.getItem('userToken');

        if (userToken) {
          try {
            const categoryMain = await getUserCategoryFromToken(userToken);
            setCategory(categoryMain || '');
          } catch (categoryError) {
            console.error("Error getting user category:", categoryError);
            setCategory('');
          }
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          setCategory('');
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        setIsAuthenticated(false);
        setCategory('');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthenticatedUser();
  }, []);

  const getInitialRouteName = () => {
    if (!isAuthenticated) {
      return 'Auth';
    }

    if (category === 'profiles') {
      return 'Layout';
    } else {
      return 'AgentsLayout';
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#f5f5f5', justifyContent: 'center', alignItems: 'center' }}>
        <Loader />
      </View>
    );
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        initialRouteName={getInitialRouteName()}
        screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Auth" component={AuthNavigation} options={{ presentation: 'transparentModal' }} />
        <Stack.Screen name="Layout" component={Layout} options={{ presentation: 'transparentModal' }} />
        <Stack.Screen name="AgentsLayout" component={AgentsLayout} options={{ presentation: 'transparentModal' }} />
        <Stack.Screen name="Steps" component={Steps} options={{ presentation: 'transparentModal' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigator;
