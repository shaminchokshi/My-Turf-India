import { StatusBar } from 'expo-status-bar';
import React, {useState} from 'react';
import {TextInput, StyleSheet , Text, View ,Button,ImageBackground, Alert} from 'react-native';
import  AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import axios from 'axios';

export default function VerifyEmailScreen({navigation,route}) {
     const ip="192.168.68.109"
     const [OTP,setOTP]=useState("");
     const [OTPError, setOTPError] = useState(false);
     const [asyncstoragetoken,setasyncstoragetoken] =useState('');

     const GetAsyncStorageData = async()=>{
        try {
         await AsyncStorage.getItem('token').then(value => {
           if(value!=null){
            setasyncstoragetoken(value);
            
           }
         })
       } catch (error) {
         console.log(error);
       }
      }
     GetAsyncStorageData();

    const submit= async()=>{
     
      if(OTP==route.params.OTP){
        setOTPError(false);
        const EmailUpdate = await axios({
            url:`http://${ip}:3000/UpdateEmail`,
            method:"put",
            data:{
              Email: route.params.Email,
              UserID: route.params.UserID,
              
            },
            headers: {
                Authorization: asyncstoragetoken,
             }
          })
         console.log(EmailUpdate.data)
         Alert.alert("Email updated");
         
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

        ;

      }
      else{
        setOTPError(true);
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

        <Text style={{ fontSize:22, color:'white',textAlign:'left',paddingBottom:10,paddingLeft:10,}}>Please Enter your OTP</Text>
        <TextInput 
           style={styles.input}
           placeholder='OTP'
           keyboardType='numeric'
           autoCapitalize='none'
           returnKeyType='done'
           onChangeText={(value)=>setOTP(value)}
           value={OTP}
           />
           {OTPError &&
         <View>

         <Text style={{color:"#ffffff"}}>Entered OTP is Incorrect</Text>
         </View>
        
         }
         <Button
         title='Verify'
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