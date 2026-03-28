import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthContext } from '../context/AuthContext';

import WelcomeScreen from '../screens/WelcomeScreen';
import SignUpScreen from '../screens/SignUpScreen';
import SignInScreen from '../screens/SignInScreen';
import JobListScreen from '../screens/JobListScreen';
import CreateJobScreen from '../screens/CreateJobScreen';
import EditJobScreen from '../screens/EditJobScreen';
import JobDetailScreen from '../screens/JobDetailScreen';
import ViewUserProfile from '../screens/ViewUserProfile';

const Stack = createStackNavigator();

export default function AppNavigator() {
  const { userToken, loading } = useContext(AuthContext);

  if (loading) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {userToken == null ? (
          <>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="SignIn" component={SignInScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="JobList" component={JobListScreen} />
            <Stack.Screen name="CreateJob" component={CreateJobScreen} />
            <Stack.Screen name="EditJob" component={EditJobScreen} />
            <Stack.Screen name="JobDetail" component={JobDetailScreen} />
            <Stack.Screen name="UserProfile" component={ViewUserProfile} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}