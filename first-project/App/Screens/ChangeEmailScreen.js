import { StatusBar } from 'expo-status-bar';
import React, {useState} from 'react';
import {TextInput, StyleSheet , Text, View ,Button,ImageBackground, Alert} from 'react-native';
import  AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import axios from 'axios';

export default function ChangeEmailScreen({navigation,route}) {
    const ip="192.168.68.109"
    const [Email, setEmail] = useState('');
    const [EmailError, setEmailError] = useState(false);

    const submit= async()=>{
      var mailformat = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
      var RandomNumber = Math.floor(100000 + Math.random() * 900000);
      var OTP=RandomNumber.toString();
      
      if(Email.match(mailformat))
      { setEmailError(false)
        }
      else{
        setEmailError(true)
      }

      
     // api call  to check if email  exists or not
      const EmailExists = await axios({
        url:`http://${ip}:3000/GetEmail?Email=${Email}`,
        method:"get",
        
      })
     console.log(EmailExists.data) 

     
     
      if(Email.match(mailformat)){
       setEmailError(false);

       if(EmailExists.data[0]==null){
       const resp = await axios({
         url:`http://${ip}:3000`,
         method:"post",
         data:{
           email:Email,
           otp:OTP,
         }
       })
      console.log(resp.data)
     
      if(resp.data=="sent"){
      Alert.alert("OTP sent to Entered Email");
      navigation.navigate("VerifyEmailScreen",{
        UserID: route.params.UserID,
        FirstName:route.params.FirstName,
        Email:Email,
        OTP:OTP,
      })
      }
    }

    else{
      Alert.alert('Email Already Registered')
    }

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
        
           <Text style={{ fontSize:22, color:'white',textAlign:'left',paddingBottom:10,paddingLeft:10,}}>Please enter your new email</Text>
           <TextInput 
           style={styles.input}
           placeholder='Email'
           autoCapitalize='none'
           returnKeyType='done'
           onChangeText={(value)=>setEmail(value)}
           value={Email}
           />
           {EmailError &&
           <View>
           <Text style={{color:"#ffffff"}}>Please enter a valid Email</Text>
           </View>
         }
         <Button
         title='Send OTP'
         onPress={()=> submit()}
         />
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