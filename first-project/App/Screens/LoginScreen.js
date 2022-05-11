import { StatusBar } from 'expo-status-bar';
import React, {useState} from 'react';
import {TextInput, StyleSheet, Text, View ,Button,ImageBackground, ScrollView} from 'react-native';
import  AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import axios from 'axios';
import {ip} from "../../constants"


export default function LoginScreen({navigation,route}) {

  

  const [Email, setEmail] = useState('');
  const [EmailError, setEmailError] = useState(false);
  const [Password, setPassword] = useState('');
  const [PasswordError, setPasswordError] = useState(false);
  var asyncstoragetoken;
  

  const submit=async()=>{
    var mailformat = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    
    const getuserdetail=async()=>{
      const GetLoginDetails = await axios(
        {
          url:`http://${ip}:3000/GetLoginDetails`,
          method:"post",
          data:{
            Email:Email,
            Password:Password,
          }
          
        }
        
      );return GetLoginDetails.data;
    }
      

    const getjwt=async()=>{
      const token = await axios(
        {
          url:`http://${ip}:3000/token`,
          method:"get",
          
          
        }
        
      );
      return token.data["token"];
      
      
    }

   

        const Userobj= await getuserdetail();
        console.log(Userobj);
        
        
       
       if(Userobj.message=="Login Success" ){
        
        setEmailError(false);
        setPasswordError(false)
        const Token=await getjwt();
        try {
          await AsyncStorage.setItem('token',Token);
          await AsyncStorage.setItem('userobject',
          JSON.stringify({"FirstName": Userobj.FirstName,
           "UserID": Userobj.UserID,
           "UserRole":Userobj.UserRole,
        }));
          
        } catch (error) {
          console.log(error);
        }
        
        
        if(Userobj.UserRole=="Booker")
        {
        navigation.navigate("HomeScreen", {
          "FirstName":Userobj.FirstName,
          "UserID":Userobj.UserID
          })}
          
          if(Userobj.UserRole=="Turf Owner"){
            navigation.navigate("TurfOwnerHomeScreen", {
              "FirstName":Userobj.FirstName,
              "UserID":Userobj.UserID,
              
              })
          }
         
          
       }
       else if(Userobj.message=='Invalid Email or Password'){
         setEmailError(false)
         setPasswordError(true);
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
        <Text style={{fontWeight:"bold",paddingLeft:20, paddingBottom:"2%", fontSize:45, color:'#3a7a25'}}>{"My Turf India"}</Text>
     
        </View>
        
        <View style={styles.formcontainer}>
        <Text style={{paddingLeft:20, paddingTop:"5%", paddingBottom:20, fontSize:40, color:'#41d955'}}>{"Login"}</Text>
         
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
        secureTextEntry={true}
        onChangeText={(value)=>setPassword(value)}
        value={Password}
         />

         {PasswordError &&
           <View>
           <Text style={{color:"#ffffff"}}>Incorrect Email or password</Text>
           </View>
         }
        <>
         <Button 
         marginBottom={2}
         title='Forgot Password '
        onPress={() => navigation.navigate("ForgotPasswordScreen")}
        />
         </>
         <View style={styles.buttoncontainer}>
         <Button title="Log in" onPress={submit} color={'#9ceb4d'}/>
         </View>
          
        </View>
        <Text style={{  fontSize:18, color:'white',paddingBottom:10}}>Don't have an account ?</Text>
        <Button
        title='Signup'
        color={'#9ceb4d'}
        onPress={() => navigation.navigate("SignupScreen")}/>
        </View>
        
        </>
    );
}
const styles = StyleSheet.create({
    
  container: {
    
    flex: 1,
    backgroundColor:'#141414',
    alignItems:'center'
    },
  
  formcontainer: {
      paddingTop:10,
      backgroundColor:'#212121',
      width:"82%",
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
     width:"92%",
    },

    buttoncontainer:{
      width:"50%",
      marginTop:"2.5%",
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