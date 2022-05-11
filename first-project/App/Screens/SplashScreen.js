import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View , ImageBackground, Button} from 'react-native';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import  AsyncStorage from '@react-native-async-storage/async-storage';
import {ip} from "../../constants"

const SplashScreen=({navigation}) => {

   const submit=()=>{

      try {
        AsyncStorage.getItem('userobject')
        .then(value => {
          if(JSON.parse(value)!=null){
           var userobj=JSON.parse(value);
           if(userobj.UserRole=="Booker"){
            navigation.navigate("HomeScreen",{
              "FirstName":userobj.FirstName,
              "UserID":userobj.UserID,
              });
           }
           else if(userobj.UserRole=="Turf Owner"){
            navigation.navigate("TurfOwnerHomeScreen",{
              "FirstName":userobj.FirstName,
              "UserID":userobj.UserID,
              });
           }
           
          }
          else{
            navigation.navigate("LoginScreen")
          }
        })
      } catch (error) {
        console.log(error);
      }
     
   }
   setTimeout(function() { submit(); }, 3000);
    return(
        <>
        <View style={styles.container} >
        <ImageBackground
         source={require("../Assets/Images/blob.png")}
         style={{width:"100%",height:600, position: 'absolute', top: 400, left: -100, right: 0, bottom: 0,}}
         ></ImageBackground>
         <ImageBackground
         source={require("../Assets/Images/blob.png")}
         style={{width:"100%",height:700, position: 'absolute', top: -200, left: 100, right: 0, bottom: 0,}}
         ></ImageBackground>
         <Icon 
         name="soccer-field"
         color="#3a7a25"
         size={200}
         
         ></Icon>

         <Text style={{fontWeight:"bold",paddingLeft:20, paddingTop:20, paddingBottom:1, fontSize:40, color:'#3a7a25',textAlign:'center'}}>{"My Turf India"}</Text>
         <Text style={{paddingLeft:20, paddingTop:10, paddingBottom:30, fontSize:17, color:'#FFFFFF',textAlign:'center'}}>{"Book Football Arenas and Cricket grounds around you in a Jiffy"}</Text>
         
         
         </View>
        </>
    );
}
export default SplashScreen

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:'#141414',
      justifyContent:"center",
      alignItems:"center"
        
    },

    
    
  });