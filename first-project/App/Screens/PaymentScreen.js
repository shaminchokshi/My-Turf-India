import React, { useState, createRef, Component, useEffect } from "react";
import {TextInput, StyleSheet, Text,View,Image,ImageBackground,ScrollView,Button,TouchableOpacity,TouchableHighlight,SafeAreaView,AppRegistry, Alert} from "react-native";
import axios from "axios";
import Icon from "react-native-vector-icons/Entypo";
import {ip} from "../../constants"
import { WebView } from 'react-native-webview';
import  AsyncStorage from '@react-native-async-storage/async-storage';

 export default function PaymentScreen({ navigation, route }) {
 
  const [asyncstoragetoken,setasyncstoragetoken] =useState('');

  // function to get data (auth key) from the async storage 
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

  console.log(`https://mticheckout.000webhostapp.com/?orderid=${route.params.orderid}&bookings=${JSON.stringify(route.params.BookingArray)}`);

  const goback=async()=>{


    const deleteunpaidbookings=async()=>{

      for (let i = 0; i < route.params.BookingArray.length; i++){
        
       const deleteDatafromBookings=await axios({

        url: `http://${ip}:3000/DeleteUnpaidBookingsOnBack`,
        method: "delete",
         headers:{
           Authorization: asyncstoragetoken,
         },
       data:{
        BookingID:route.params.BookingArray[i]
        
       }

       });
       console.log(deleteDatafromBookings.data);
      }

    }
    await deleteunpaidbookings()




    navigation.goBack();

   }

   setTimeout(function() { goback(); alert("Session Timed out !! Please try again"); } , 540000);
  
      return (
        <>
        <View style={styles.container}>
        <ImageBackground
         source={require("../Assets/Images/blob.png")}
         style={{width:"100%",height:770, position: 'absolute', top: -310, left: 0, right: 0, bottom: 0,}}
         ></ImageBackground>
        <View style={styles.backbutton}>
        <Icon
          name='chevron-left'
          color="#ffffff"
          size={35}
          onPress={()=>goback()}
          ></Icon>
        </View>
        
        <View style={styles.detailscontainer}>
    
     <Text style={{ fontWeight:"bold", fontSize:22, color:'#9ceb4d',paddingBottom:"1%", alignSelf:'flex-start'}}>{route.params.Turfname}</Text>
     <Text style={styles.heading}>Booking Date :</Text>
     <Text style={styles.subheading}>{route.params.DateOfBooking}</Text>
     <Text style={styles.heading}>Booking Time slots:</Text>
    
     {route.params.TimingArray.map((item,index) => (
     <Text style={styles.subheading}>{route.params.TimingArray[index]}</Text> 
       ))}
    <Text style={styles.heading}>Total Amount :  </Text>
     <Text style={styles.subheading}>Rs. {route.params.PaymentStatus}  </Text>
      </View>
      
      <WebView 
      style={styles.formcontainer}
      source={{ uri: `https://mticheckout.000webhostapp.com/?orderid=${route.params.orderid}&bookings=${JSON.stringify(route.params.BookingArray)}` }} 
      />
      
      </View>
      </>

      );
    
    }
 
  


const styles = StyleSheet.create({
   
    container: {
      
      flex: 1,
      backgroundColor:'#143f14',
     // alignItems:'center',
      justifyContent:"center"
      
      },
    
     

    formcontainer: {
      
      opacity:0.95,
      padding:"2%",
        marginTop:"3%",
        backgroundColor:'#212121',
        width:"82%",
        borderRadius: 20,
        marginBottom:30,
        marginTop:10,
        alignSelf:'center',
        justifyContent:"center",
        
      },


      detailscontainer: {
        opacity:0.95,
        padding:"2%",
          backgroundColor:'#212121',
          width:"82%",
          borderRadius: 20,
          alignSelf:'center',
          justifyContent:"center",
          
        },


      topcontainer:{
        backgroundColor:'#141414',
        height: 45,
    
      },
      
      heading:{
        fontSize:16, 
        color:'#ffffff',
        paddingBottom:"1%",
        alignSelf:'flex-start',
        fontWeight:"bold"
       },

       subheading:{
        fontSize:15, 
        color:'#9ceb4d',
        paddingBottom:"1%",
        alignSelf:'flex-start',
        
       },
       showtext: {
        padding:20,
        flex: 1,
        backgroundColor:'#9ceb4d',
        borderRadius : 80,
        alignItems:"center",
        marginBottom:8,
        alignSelf:'flex-start',
        justifyContent:'center'
      },

      sidebyside:{
          flexDirection:'row',
        
      },

    CreditCard:{
        
        padding:8,
        backgroundColor:'#a9ffa6',
        width:"95%",
        borderRadius: 20,
        marginBottom:30,
        marginTop:10,
        marginRight:10,
        marginLeft:10,
        alignItems:'center',
        borderWidth: 2,
      borderColor: '#a9ffa6',
      shadowColor: '#9ceb4d',
      shadowOffset: {width: -2, height: 5},
      shadowOpacity: 0.6,
      shadowRadius: 15, 
    },

    input: {
      flex:1,
      alignSelf:'flex-start',
      borderRadius : 10,
      paddingLeft:15,
       marginTop:10,
       marginBottom:10,
       backgroundColor:'#a9ffa6', 
       fontSize:18,
       height:35,
       borderColor: '#a9ffa6',
       borderWidth: 1,
       margin:3,
       color:'#212121',
       
      },
      
      shadowProp: {
        shadowColor: '#171717',
        shadowOffset: {width: -2, height: 4},
        shadowOpacity: 0.2,
        shadowRadius: 3,
      },

      backbutton:{
        alignSelf:"flex-start",
        backgroundColor:"#469c2c",
        borderRadius:17,
        marginLeft:"4%",
        marginTop:"2%",
        marginBottom:2,
    
    
      },
    })
    