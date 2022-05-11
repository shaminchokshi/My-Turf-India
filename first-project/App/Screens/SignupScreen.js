import { StatusBar } from 'expo-status-bar';
import React, {useState, createRef,Component } from 'react';
import {Alert, TextInput, StyleSheet, Text, View , ImageBackground, ScrollView, Button} from 'react-native';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import axios from "axios";
import {ip} from "../../constants"

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
        <ImageBackground
         source={require("../Assets/Images/blob.png")}
         style={{width:"100%",height:900, position: 'absolute', top: -310, left: 0, right: 0, bottom: 0,}}
         ></ImageBackground>
        <View>
        <Icon name="soccer-field" color="#3a7a25" size="70"></Icon>
        </View>
        <View>
        <Text style={{fontWeight:"bold",paddingLeft:20, paddingBottom:10, fontSize:25, color:'#3a7a25'}}>{"My Turf India"}</Text>
     
        </View>
        
        <ScrollView style={{width:"100%"}}>
        <View style={styles.formcontainer}>
        <Text style={{ paddingTop:10, paddingBottom:10, fontSize:30, color:'#41d955',alignSelf:"center"}}>{"Sign Up"}</Text>
        
        <View style={{width:"100%"}}>
        
        <TextInput style={styles.input}
        placeholder='First Name'
        title='First Name'
        onChangeText={(value)=>setFirstName(value)}
        value={FirstName}
         />

        {FirstNameError &&
         <View>
         <Text style={{color:"#ffffff",alignSelf:"center",}}>First Name is a required</Text>
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
           <Text style={{color:"#ffffff",alignSelf:"center",}}>Please enter a valid Mobile number</Text>
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
           <Text style={{color:"#ffffff",alignSelf:"center",}}>Please enter a valid Email</Text>
           </View>
         }
         <TextInput style={styles.input}
        placeholder='Password'
        title="Password"
        secureTextEntry={true}
        onChangeText={(value)=>setPassword(value)}
        value={Password}
         />

        {PasswordError &&
        <View>
        <Text style={{color:"#ffffff", fontSize:10,alignSelf:"center",}}>needs 8 characters, a letter, a Digit and a Special Character</Text>
        </View>
         }

         <TextInput style={styles.input}
        placeholder='Confirm Password'
        title="Confirm Password"
        secureTextEntry={true}
        onChangeText={(value)=>setConfirmPassword(value)}
        value={ConfirmPassword}
         />

        {ConfirmPasswordError &&
        <View>
        <Text style={{color:"#ffffff",alignSelf:"center",}}>Pasword and Confirm Password dont match</Text>
        </View>
        
         }

         </View>
         <View style={styles.buttoncontainer}>
         <Button title="Sign Up" onPress={submit}  color={'#9ceb4d'}/>
         </View>
        </View>
        </ScrollView>
        </View>
        </>
    );
     
    
}

 export default SignupScreen

const styles = StyleSheet.create({
   
  container: {
    
    flex: 1,
    backgroundColor:'#141414',
    alignItems:'center'
    },
  
  formcontainer: {
      alignSelf:"center",
      paddingTop:10,
      backgroundColor:'#212121',
      width:"85%",
      borderRadius: 20,
      marginBottom:30,
      marginTop:10,
      
    },

    topcontainer:{
      backgroundColor:'#141414',
      height: 45,
  
    },
  
    input: {
      alignSelf:"center",
      borderRadius : 10,
      paddingLeft:15,
     marginTop:10,
     marginBottom:10,
     backgroundColor:'#ffffff', 
     fontSize:18, 
     height:35,
     width:"90%",
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