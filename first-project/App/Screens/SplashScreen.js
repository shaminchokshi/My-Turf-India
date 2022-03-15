import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View , Image, Button} from 'react-native';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {useNavigate,useHref} from "react-router-native"

const SplashScreen=({navigation}) => {

  

    return(
        <>
        <View style={styles.container} >
         
         <Icon 
         name="soccer-field"
         color="#36c249"
         size="200"
         
         ></Icon>

         <Text style={{fontWeight:"bold",paddingLeft:20, paddingTop:20, paddingBottom:1, fontSize:40, color:'#36c249',textAlign:'center'}}>{"My Turf India"}</Text>
         <Text style={{paddingLeft:20, paddingTop:10, paddingBottom:30, fontSize:17, color:'#FFFFFF',textAlign:'center'}}>{"Book Football Arenas and Cricket grounds around you in a Jiffy"}</Text>
         <Button title="Next" color={'#9ceb4d'} onPress={() => navigation.navigate("SignupScreen")}/>
         
         </View>
        </>
    );
}
export default SplashScreen

const styles = StyleSheet.create({
    container: {
      padding:10,
      flex: 1,
      backgroundColor:'#141414',
      justifyContent:"center",
      alignItems:"center"
        
    },

    
    
  });