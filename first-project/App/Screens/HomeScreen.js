import { StatusBar } from "expo-status-bar";
import React, { useState, createRef, Component, useEffect } from "react";
import {TextInput, StyleSheet, Text,View,Image,ScrollView,Button} from "react-native";
import { Navigate, Route } from "react-router-native";
import axios from "axios";
import  AsyncStorage from '@react-native-async-storage/async-storage';


const ip = "192.168.68.100";

export default function HomeScreen({ navigation, route }) {
  const [turfarray, setturfarray] = useState([]);
  const[devicelatitude,setdevicelatitude]=useState(null);
  const[devicelongitude,setdevicelongitude]=useState(null);
  const [devicecity,setdevicecity]=useState('');
  

  useEffect(() => {
    
    const turfmenu = async () => {
      
      //API to get all the turf details
      const GetTurfMenu = await axios({
        url: `http://${ip}:3000/GetTurfMenu`,
        method: "get",
       
      });
      setturfarray(GetTurfMenu.data);
    };
    turfmenu();
  //api to get the device location
    const getdevicelocation = async () => {
      
      var options = {
        method: 'GET',
        url: 'https://ip-geo-location.p.rapidapi.com/ip/check',
        params: {format: 'json'},
        headers: {
          'x-rapidapi-host': 'ip-geo-location.p.rapidapi.com',
          'x-rapidapi-key': '919196aa32mshf8f9004eb449f79p1c45b8jsnf86593c545dc'
        }
      };
      axios.request(options).then(function (response) {
        console.log(response.data.location["latitude"])
        setdevicelatitude(response.data.location["latitude"]);
         
        console.log(response.data.location["longitude"])
        setdevicelongitude(response.data.location["longitude"]);
        
        setdevicecity(response.data.city["name"]);
       }).catch(function (error) {
         console.error(error);
       });
      
    };
    getdevicelocation();  
  
  }, []
  );


// FUNCTION TO CALCULATE DICTANCE BETWEEN 2 POINTS ON A GLOBE
function distance(lat1,lon1,lat2,lon2) {
 
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km

  return (d).toFixed(2);
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}


 const nameofuser=route.params.FirstName;
 const IDofUser= route.params.UserID;
 

  return (
    <>
      <View style={styles.container}>
        <Text style={{ fontWeight: "bold", paddingTop: 20, paddingBottom: 15, fontSize: 22, color: "#ffffff",}}> Hi, {nameofuser} </Text>
        <Text style={{ fontWeight: "bold", paddingBottom: 15, fontSize: 15, color: "#ffffff",}}> UserID: {IDofUser} </Text>
        <View>
          <TextInput style={styles.input} placeholder='Search' />
        </View>
        <ScrollView >
          {turfarray.map(({ TurfID ,TurfName, Address, Phone, PricePerHour,TurfStartTime,TurfEndTime,latitude,longitude,city }) =>city==devicecity?(
           
           <View style={styles.Cards}>
           <Text style={{ fontWeight:"bold", fontSize:30, color:'#9ceb4d',paddingBottom:10}}>#{TurfID}) {TurfName}</Text>
           <Text style={{ fontWeight:"bold", paddingBottom:5 ,fontSize:20, color:'white',paddingBottom:10}}>{Address}</Text>
           <Text style={{ fontSize:17, color:'white'}}>{Phone}</Text>
           <Text style={{ fontSize:17, color:'#9ceb4d',fontWeight:'bold',textAlign:'right'}}>Rs.{PricePerHour} /Hr</Text>
           <Text style={{ fontSize:17, color:'#9ceb4d',fontWeight:'bold',textAlign:'left'}}>{distance(latitude,longitude,devicelatitude,devicelongitude)} Km</Text>
           <View style={{alignSelf:"flex-end",}} >
           <Button title="Book Now" onPress={()=>navigation.navigate("BookingDetailsScreen",
           {
            TurfName:TurfName,
            TurfID:TurfID,
            PricePerHour:PricePerHour,
            Address:Address,
            Phone:Phone,
            TurfStartTime:TurfStartTime,
            TurfEndTime:TurfEndTime,
            UserID:IDofUser,
            latitude:latitude,
            longitude:longitude,

           })} color={'#74ba29'}/>
           
           </View>
        </View>
          ):null)}
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
    
    backgroundColor: "#141414",
    alignItems: "center",
  },
  topcontainer: {
    backgroundColor: "#141414",
    height: 45,
  },

  input: {
    borderRadius: 15,
    paddingLeft: 15,
    marginTop: 2,
    marginBottom: 15,
    backgroundColor: "#ffffff",
    fontSize: 20,
    height: 50,
    width: 290,
  },
  
  Cards:{
    marginBottom:20,
    backgroundColor:'#212121',
    padding:10,
    borderRadius: 20 ,
    width:330,
     
 },

 buttoncontainer:{
    
  padding:5,
  alignSelf:"flex-end", 
  flexDirection:'row',
  backgroundColor:'#74ba29',
  borderRadius:10,
  justifyContent:'center'
},
});
