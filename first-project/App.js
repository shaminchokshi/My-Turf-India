import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View ,ScrollView, TextInput, Image, AppRegistry} from 'react-native';
import SplashScreen from './App/Screens/SplashScreen';
import LoginScreen from './App/Screens/LoginScreen';
import HomeScreen from './App/Screens/HomeScreen';
import SignupScreen from './App/Screens/SignupScreen';
import SignupUserAuthScreen from './App/Screens/SignupUserAuthScreen';
import Cards from "./App/Components/Cards/Cards";
import BookingDetailsScreen from './App/Screens/BookingDetailsScreen';
import PaymentScreen from './App/Screens/PaymentScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';



const Stack = createNativeStackNavigator();


export default function App() {
  
  return (
    <> 
    <View style={styles.topcontainer}>
    </View>
    
    <NavigationContainer>
    <Stack.Navigator
      initialRouteName = "LoginScreen">

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
    </Stack.Navigator>
    </NavigationContainer>
     
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
