import { StatusBar } from 'expo-status-bar';
import React, {useState, createRef,Component } from 'react';
import {Alert, TextInput, StyleSheet, Text, View , Image, ScrollView, Button} from 'react-native';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import axios from "axios";


const SignupScreen=({navigation,route}) => {
  



  const [Email, setEmail] = useState('');
  const [EmailError, setEmailError] = useState(false);
  const [Mobileno, setMobileno] = useState('');
  const [MobilenoError, setMobilenoError] = useState(false);
  const [FirstName, setFirstName] = useState('');
  const [FirstNameError, setFirstNameError] = useState(false);
  const [LastName, setLastName] = useState('');
  const [Password, setPassword] = useState('');
  const [PasswordError, setPasswordError] = useState(false);
  const [ConfirmPassword, setConfirmPassword] = useState('');
  const [ConfirmPasswordError, setConfirmPasswordError] = useState(false);
  const ip="192.168.68.100";
  
  const submit=async()=>{
    try {
      var mailformat = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    var Mobileformat = /^(\+\d{1,3}[- ]?)?\d{10}$/;
    var Passwordformat = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if(Email.match(mailformat))
      { setEmailError(false)
        }
      else{
        setEmailError(true)
      }

      if(Mobileno.match(Mobileformat))
      {
        setMobilenoError(false)
      }
      else{
        setMobilenoError(true)
      }

      if(FirstName!="")
      {
        setFirstNameError(false)
      }
      else{
        setFirstNameError(true)
      }
      
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
      
      if(Email.match(mailformat) && Mobileno.match(Mobileformat) && FirstName!="" && Password.match(Passwordformat) && ConfirmPassword==Password ) 
      {   
         
         var RandomNumber = Math.floor(100000 + Math.random() * 900000);
         var OTP=RandomNumber.toString();
        
        
          const resp = await axios({
            url:`http://${ip}:3000`,
            method:"post",
            data:{
              email:Email,
              otp:OTP
            }
          })
         console.log(resp.data)
         
         //Calling API to add entry in User table after signup
          const SignUp = await axios({
            url:`http://${ip}:3000/SignUp`,
            method:"post",
            data:{
              firstName:FirstName,
              lastName:LastName,
              mobileno:Mobileno,
              email:Email,
              password:Password,
              sentOTP:OTP
            }
          })
         console.log(SignUp.data)
        
         
        navigation.navigate("SignupUserAuthScreen", {
          FirstName:FirstName,
          LastName:LastName,
          Mobileno:Mobileno,
          Email:Email,
          Password:Password,
          UserRole:"Booker",
          VerificationStatus:"No",
          OTP:OTP,
          TNCStatus:"Yes"
        })
      }
    } catch (error) {
     console.log(error) 
     Alert.alert("Email already registered, Please Try with another Email")
    }
    
  }

  return(
        <>
        <View style={styles.container}>
        <View>
        <Icon name="soccer-field" color="#36c249" size="70"></Icon>
        </View>
        <View>
        <Text style={{fontWeight:"bold",paddingLeft:20, paddingBottom:10, fontSize:25, color:'#41d955'}}>{"My Turf India"}</Text>
     
        </View>
        
        
        <View style={styles.formcontainer}>
        <Text style={{paddingLeft:20, paddingTop:10, paddingBottom:10, fontSize:30, color:'#41d955'}}>{"Sign Up"}</Text>
        
        <ScrollView>
        
        <TextInput style={styles.input}
        placeholder='First Name'
        title='First Name'
        onChangeText={(value)=>setFirstName(value)}
        value={FirstName}
         />

        {FirstNameError &&
         <View>
         <Text style={{color:"#ffffff"}}>First Name is a required</Text>
          </View>
         }

         <TextInput style={styles.input}
        placeholder='Last Name'
        title='Last Name'
        onChangeText={(value)=>setLastName(value)}
        value={LastName}
         />
         <TextInput style={styles.input}
        placeholder='Mobile number'
        keyboardType="numeric"
        title="MobileNo."
        returnKeyType='done'
        onChangeText={(value)=>setMobileno(value)}
        value={Mobileno}
         />

          {MobilenoError &&
           <View>
           <Text style={{color:"#ffffff"}}>Please enter a valid Mobile number</Text>
           </View>
         }

         <TextInput style={styles.input}
        placeholder='Email'
        title="EmailID"
        onChangeText={(value)=>setEmail(value)}
        value={Email}
        
         />
         {EmailError &&
           <View>
           <Text style={{color:"#ffffff"}}>Please enter a valid Email</Text>
           </View>
         }
         <TextInput style={styles.input}
        placeholder='Password'
        title="Password"
        onChangeText={(value)=>setPassword(value)}
        value={Password}
         />

        {PasswordError &&
        <View>
        <Text style={{color:"#ffffff", fontSize:10}}>Password needs 8 characters, a letter, a Digit and a Special Character</Text>
        </View>
         }

         <TextInput style={styles.input}
        placeholder='Confirm Password'
        title="Confirm Password"
        onChangeText={(value)=>setConfirmPassword(value)}
        value={ConfirmPassword}
         />

        {ConfirmPasswordError &&
        <View>
        <Text style={{color:"#ffffff"}}>Pasword and Confirm Password dont match</Text>
        </View>
        
         }

         </ScrollView>
         <Button title="Sign Up" onPress={submit}  color={'#9ceb4d'}/>
         
        </View>
        </View>
        </>
    );
     
    
}

 export default SignupScreen

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
      //marginHorizontal:20,
      alignItems:'center'
    },
    topcontainer:{
      backgroundColor:'#141414',
      height: 45,
  
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