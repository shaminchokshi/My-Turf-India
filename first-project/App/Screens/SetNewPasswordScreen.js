import { StatusBar } from 'expo-status-bar';
import React, {useState} from 'react';
import {TextInput, StyleSheet , Text, View ,Button,ImageBackground, Alert} from 'react-native';
import  AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import axios from 'axios';

export default function SetNewPasswordScreen({navigation,route}) {
    const ip="192.168.68.109"
  const [Password, setPassword] = useState('');
  const [PasswordError, setPasswordError] = useState(false);
  const [ConfirmPassword, setConfirmPassword] = useState('');
  const [ConfirmPasswordError, setConfirmPasswordError] = useState(false);
  var Passwordformat = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    const submit= async()=>{
     
        if(Password.match(Passwordformat))
      {
        setPasswordError(false)
      }
      else{
        setPasswordError(true)
      }

      if(ConfirmPassword==Password)
      {
        setConfirmPasswordError(false)
      }
      else{
        setConfirmPasswordError(true)
      }

      if(Password.match(Passwordformat) && ConfirmPassword==Password)
      {
        const PasswordUpdate = await axios({
            url:`http://${ip}:3000/UpdatePassword`,
            method:"put",
            data:{
              Email:route.params.Email,
              Password:Password,
              
            }
          })
         console.log(PasswordUpdate.data)
         Alert.alert('New password set !')
         navigation.navigate("LoginScreen");

      }
      

    }


    return(
        <>
          
        <View style={styles.container}>

        <ImageBackground
         source={require("../Assets/Images/blob.png")}
         style={{width:"100%",height:900, position: 'absolute', top: -310, left: 0, right: 0, bottom: 0,}}
         ></ImageBackground>
        <View>
        <Icon name="soccer-field" color="#3a7a25" size={70}></Icon>
        </View>
        <View>
        <Text style={{fontWeight:"bold",paddingLeft:20, paddingBottom:30, fontSize:40, color:'#3a7a25'}}>{"My Turf India"}</Text>
        </View>
        <Text style={{ fontSize:22, color:'white',textAlign:'left',paddingBottom:10,paddingLeft:10,}}>Please enter new password</Text>
        <TextInput style={styles.input}
        placeholder='Password'
        title="Password"
        returnKeyType='done'
        secureTextEntry={true}
        onChangeText={(value)=>setPassword(value)}
        value={Password}
         />

        {PasswordError &&
        <View>
        <Text style={{color:"#ffffff"}}>needs 8 characters, a letter, a Digit and a Special Character</Text>
        </View>
         }

         <TextInput style={styles.input}
        placeholder='Confirm Password'
        title="Confirm Password"
        returnKeyType='done'
        secureTextEntry={true}
        onChangeText={(value)=>setConfirmPassword(value)}
        value={ConfirmPassword}
         />

        {ConfirmPasswordError &&
        <View>
        <Text style={{color:"#ffffff"}}>Pasword and Confirm Password dont match</Text>
        </View>
        
         }
         <Button
         title='Set Password'
         onPress={()=>submit()}/>
        </View>
        
        </>
    )
}
const styles = StyleSheet.create({
    
    container: {
      paddingTop:20,
      flex: 1,
      backgroundColor: "#141414",
      alignItems: "center",
      
    },
      
      formcontainer: {
          paddingTop:10,
          backgroundColor:'#212121',
          width:350,
          borderRadius: 20,
          marginBottom:30,
          marginTop:10,
          marginHorizontal:20,
          alignItems:'center',
          
        },
        topcontainer:{
          backgroundColor:'#141414',
          height: 45,
      
        },
      
        input: {
          borderRadius : 15,
          paddingLeft:15,
         marginTop:15,
         marginBottom:15,
         backgroundColor:'#ffffff', 
         fontSize:20, 
         height:50,
         width:"83%",
        },
    
        buttoncontainer:{
          width:150,
          alignSelf:"flex-end", 
          flexDirection:'row',
          backgroundColor:'#74ba29',
          borderBottomRightRadius:20,
          borderTopLeftRadius:20,
          justifyContent:'center',
          shadowColor: '#e5eb34',
          shadowOffset: {width: -5, height: -5},
          shadowOpacity: 0.7,
          shadowRadius: 35 
        },
        
      });