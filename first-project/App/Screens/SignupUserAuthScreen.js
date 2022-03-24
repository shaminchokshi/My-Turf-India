import { StatusBar } from 'expo-status-bar';
import React, {useState, createRef,Component } from 'react';
import { StyleSheet, Text, TextInput, View , Image, Button, Alert} from 'react-native';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import axios from "axios";
const ip="192.168.68.100";

export default function SignupUserAuthScreen ({navigation,route}){
  
  
  const [OTP, setOTP] = useState('');
  const [OTPError, setOTPError] = useState(false);
  const EmailID=route.params.Email;
  
  const checkOTP=async()=>{
    
    const CheckForOTP = await axios(
      {
        url:`http://${ip}:3000/CheckForOTP?Email=${EmailID}`,
        method:"get"
        
      }
    );
    
      return CheckForOTP.data[0].OTP;
    
    }

  const submit=async()=>{
  var SENT_OTP=await checkOTP();
  if(OTP==SENT_OTP)
  {// API CALL TO UPDATE VERIFICATION STATUS OF USER
    const UpdateVerificationStatus = await axios({
      url:`http://${ip}:3000/UpdateVerificationStatus`,
      method:"put",
      data:{
        email:EmailID,
        otp:SENT_OTP
      }
    });
   console.log(UpdateVerificationStatus.data)

  Alert.alert("User Registered Successfully!!");
  navigation.navigate("LoginScreen");
  }
  else{
    setOTPError(true)   
  }

  }
    
  return(
        <>
        <View style={styles.container} >
         
         <Icon 
         name="soccer-field"
         color="#36c249"
         size="170"
         
         ></Icon>

         <Text style={{fontWeight:"bold",paddingLeft:20, paddingTop:5, paddingBottom:1, fontSize:40, color:'#36c249',textAlign:'center'}}>{"My Turf India"}</Text>
         <Text style={{paddingLeft:20, paddingTop:10, paddingBottom:30, fontSize:25, color:'#FFFFFF',textAlign:'center'}}>{"Please enter the OTP sent to your Entered Email"}</Text>
         
         <TextInput style={styles.input}
          placeholder='OTP'
          title='OTP'
          keyboardType='numeric'
          onChangeText={(value)=>setOTP(value)}
          value={OTP}
         />
         {OTPError &&
         <View>

         <Text style={{color:"#ffffff"}}>Entered OTP is Incorrect</Text>
         </View>
        
         }
         <Button title="Verify" color={'#9ceb4d'} onPress={submit}/>
         <Text style={{ paddingTop:5, paddingBottom:5, fontSize:20, color:'#ffffff'}}>name: {route.params.FirstName}</Text>
         <Text style={{ paddingTop:5, paddingBottom:5, fontSize:20, color:'#ffffff'}}>surname: {route.params.LastName}</Text>
         <Text style={{ paddingTop:5, paddingBottom:5, fontSize:20, color:'#ffffff'}}>Mobile: {route.params.Mobileno}</Text>
         <Text style={{ paddingTop:5, paddingBottom:5, fontSize:20, color:'#ffffff'}}>Email: {route.params.Email}</Text>
         <Text style={{ paddingTop:5, paddingBottom:5, fontSize:20, color:'#ffffff'}}>User Role: {route.params.UserRole}</Text>
         
         </View>
        </>
    );
}
const styles = StyleSheet.create({
    container: {
      padding:10,
      flex: 1,
      backgroundColor:'#141414',
      
      alignItems:"center"
        
    },
    input: {
        borderRadius : 10,
        paddingLeft:15,
       marginTop:10,
       marginBottom:10,
       backgroundColor:'#ffffff', 
       fontSize:18, 
       height:35,
       width:300,
      },
      

    
    
  });