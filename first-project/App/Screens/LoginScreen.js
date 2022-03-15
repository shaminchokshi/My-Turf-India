import { StatusBar } from 'expo-status-bar';
import React, {useState, createRef} from 'react';
import {TextInput, StyleSheet, Text, View , Image, ScrollView,Button} from 'react-native';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import axios from 'axios';

export default function LoginScreen({navigation,route}) {

  

  const [Email, setEmail] = useState('');
  const [EmailError, setEmailError] = useState(false);
  const [Password, setPassword] = useState('');
  const [PasswordError, setPasswordError] = useState(false);

  const ip="192.168.68.112";

  const submit=async()=>{
    var mailformat = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    
    const getuserdetail=async()=>{
      const GetLoginDetails = await axios(
        {
          url:`http://${ip}:3000/GetLoginDetails?Email=${Email}`,
          method:"get"
          
        }
        
      );return GetLoginDetails.data;
    }
      
        const Userobj= await getuserdetail();
        if(Userobj[0]==null){
          setEmailError(true)
        }
        
       else{
       if(Password==Userobj[0].Password && Email==Userobj[0].Email){
        console.log(Userobj[0].UserID);
        setEmailError(false)
        navigation.navigate("HomeScreen", {
          "FirstName":Userobj[0].FirstName,
          "UserID":Userobj[0].UserID
          }
          )
       }
       else{
         setEmailError(false)
         setPasswordError(true);
       }
      }
    

  }

    return(
        <>
        <View style={styles.container}>
        <View>
        <Icon name="soccer-field" color="#36c249" size="70"></Icon>
        </View>
        <View>
        <Text style={{fontWeight:"bold",paddingLeft:20, paddingBottom:30, fontSize:40, color:'#41d955'}}>{"My Turf India"}</Text>
     
        </View>
        
        <View style={styles.formcontainer}>
        <Text style={{paddingLeft:20, paddingTop:20, paddingBottom:20, fontSize:40, color:'#41d955'}}>{"Login"}</Text>
         
         <TextInput style={styles.input}
        placeholder='Email'
        autoCapitalize='none'
        onChangeText={(value)=>setEmail(value)}
        value={Email}
         />

         {EmailError &&
           <View>
           <Text style={{color:"#ffffff"}}>email has not been registered</Text>
           </View>
         }

         <TextInput style={styles.input}
        placeholder='Password'
        onChangeText={(value)=>setPassword(value)}
        value={Password}
         />

         {PasswordError &&
           <View>
           <Text style={{color:"#ffffff"}}>Incorrect Email or password</Text>
           </View>
         }

         <Button title="Log in" onPress={submit} color={'#9ceb4d'}/>
         
        </View>
        </View>
        </>
    );
}
const styles = StyleSheet.create({
    
  container: {
    padding:10,
    flex: 1,
    backgroundColor:'#141414',
    alignItems:'center'
    },
  
  formcontainer: {
      padding:10,
      backgroundColor:'#212121',
      width:350,
      borderRadius: 20,
      marginBottom:30,
      marginTop:10,
      marginHorizontal:20,
      alignItems:'center'
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
     width:300,
    },
    
  });