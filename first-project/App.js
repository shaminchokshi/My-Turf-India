import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View ,ScrollView, TextInput, Image, AppRegistry} from 'react-native';
import SplashScreen from './App/Screens/SplashScreen';
import LoginScreen from './App/Screens/LoginScreen';
import HomeScreen from './App/Screens/HomeScreen';
import SignupScreen from './App/Screens/SignupScreen';
import SignupUserAuthScreen from './App/Screens/SignupUserAuthScreen';
import TurfOwnerHomeScreen from './App/Screens/TurfOwnerHomeScreen';
import BookingDetailsScreen from './App/Screens/BookingDetailsScreen';
import TurfOwnerBookingDetailsScreen from './App/Screens/TurfOwnerBookingDetailsScreen';
import PaymentScreen from './App/Screens/PaymentScreen';
import ForgotPasswordScreen from './App/Screens/ForgotPasswordScreen';
import SetNewPasswordScreen from './App/Screens/SetNewPasswordScreen';
import ForgotPassUserAuthScreen from './App/Screens/ForgotPassUserAuthScreen';
import ChangeEmailScreen from './App/Screens/ChangeEmailScreen';
import VerifyEmailScreen from './App/Screens/VerifyEmailScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MenuProvider } from 'react-native-popup-menu';



const Stack = createNativeStackNavigator();


export default function App() {
  
  return (
    <> 
    <MenuProvider>
    <View style={styles.topcontainer}>
    </View>

    <NavigationContainer>
    <Stack.Navigator
      initialRouteName = "SplashScreen">

      <Stack.Screen
       name="SplashScreen"
       component={SplashScreen}
       />
      <Stack.Screen
      name="SignupScreen"
       component={SignupScreen}
      />
      <Stack.Screen
      name="SignupUserAuthScreen"
       component={SignupUserAuthScreen}
      />
      <Stack.Screen
      name="LoginScreen"
      component={LoginScreen}
      />
      <Stack.Screen
      name="HomeScreen"
      component={HomeScreen}
      />
      <Stack.Screen
       name="BookingDetailsScreen"
       component={BookingDetailsScreen}
       />
       <Stack.Screen
      name="PaymentScreen"
       component={PaymentScreen}
      />
      <Stack.Screen
       name="TurfOwnerHomeScreen"
       component={TurfOwnerHomeScreen}
       />
       <Stack.Screen
       name="TurfOwnerBookingDetailsScreen"
       component={TurfOwnerBookingDetailsScreen}
       />
       <Stack.Screen
       name="ForgotPasswordScreen"
       component={ForgotPasswordScreen}
       />
       <Stack.Screen
       name="ForgotPassUserAuthScreen"
       component={ForgotPassUserAuthScreen}
       />
       <Stack.Screen
       name="SetNewPasswordScreen"
       component={SetNewPasswordScreen}
       />
       <Stack.Screen
       name="ChangeEmailScreen"
       component={ChangeEmailScreen}
       />
       <Stack.Screen
       name="VerifyEmailScreen"
       component={VerifyEmailScreen}
       />
       
    </Stack.Navigator>
    </NavigationContainer>
    </MenuProvider>
      </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding:25,
    flex: 1,
    backgroundColor:'#141414',
    alignItems:'center',
    
  },
  topcontainer:{
    backgroundColor:'#141414',
    height:35,

  },

  input: {
    borderRadius : 15,
    paddingLeft:15,
    flex: 1,
   marginTop:15,
   marginBottom:15,
  backgroundColor:'#ffff9f', 
  fontSize:20, 
  height:50,
  },
  
});