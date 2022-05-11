import { StatusBar } from "expo-status-bar";
import React, { useState, createRef, Component, useEffect } from "react";
import {TextInput, StyleSheet, Text,View,Image,ScrollView,Button,ImageBackground} from "react-native";
import { Navigate, Route } from "react-router-native";
import axios from "axios";
import  AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from "react-native-vector-icons/Entypo";
import {Menu, MenuOptions, MenuOption, MenuTrigger,} from 'react-native-popup-menu';
import {ip} from "../../constants"



export default function HomeScreen({ navigation, route }) {
  const [turfarray, setturfarray] = useState([]);
  const [UserBookingArray,setUserBookingArray]=useState([])
  const[devicelatitude,setdevicelatitude]=useState(null);
  const[devicelongitude,setdevicelongitude]=useState(null);
  const [devicecity,setdevicecity]=useState('');
  const [TurfListRender,SetTurfListRender]=useState(true);
  const [MyBookingRender,SetMyBookingRender]=useState(false);
  const [asyncstoragetoken,setasyncstoragetoken] =useState('');
  const [SearchCity, setSearchCity]=useState('');
  const nameofuser=route.params.FirstName;
  const IDofUser= route.params.UserID;


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

const Logout=async ()=>{
    try {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("userobject");
      console.log('Data removed');
      navigation.navigate('LoginScreen');
  }
  catch(exception) {
      console.log(exception)
  }
  }


  const ChangeEmail= async()=>{
    navigation.navigate("ChangeEmailScreen",{
      UserID: route.params.UserID,
      FirstName:route.params.FirstName,
    });

  }



  const GetBookingsofUser = async () => {
      
    //API to get all the bookings of that particular user
    const GetUserBookings = await axios({
      url: `http://${ip}:3000/GetUserBookings?UserID=${route.params.UserID}`,
      method: "get",
      headers: {
        Authorization: asyncstoragetoken,
     }

    });
    setUserBookingArray(GetUserBookings.data);
  };
  

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
    // const getdevicelocation = async () => {
      
    //   var options = {
    //     method: 'GET',
    //     url: 'https://ip-geo-location.p.rapidapi.com/ip/check',
    //     params: {format: 'json'},
    //     headers: {
    //       'x-rapidapi-host': 'ip-geo-location.p.rapidapi.com',
    //       'x-rapidapi-key': '919196aa32mshf8f9004eb449f79p1c45b8jsnf86593c545dc'
    //     }
    //   };
    //   axios.request(options).then(function (response) {
    //     console.log(response.data.location["latitude"])
    //     setdevicelatitude(response.data.location["latitude"]);
         
    //     console.log(response.data.location["longitude"])
    //     setdevicelongitude(response.data.location["longitude"]);
        
    //     setdevicecity(response.data.city["name"]);
    //    }).catch(function (error) {
    //      console.error(error);
    //    });
      
    // };
    // getdevicelocation();  
  
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


 
 

  return (
    <>
      <View style={styles.container}>
      <View style={styles.iconmenu}>
        <Text style={{ fontWeight: "bold", paddingTop: 10, paddingLeft:30, paddingRight:"33%", paddingBottom: 15, fontSize: 25, color: "#ffffff",alignSelf:'flex-start'}}> Hi, {nameofuser} </Text>
        
    <View >
       <Menu  >
         <MenuTrigger>
         <Icon
            name="menu"
            color="#9ceb4d"
            size={42}
            
            ></Icon>
         </MenuTrigger>
           <MenuOptions style={{backgroundColor:"#2e2e2e",padding:10,}}>
            <MenuOption onSelect={() => Logout()}>
              <Text style={{color:'#9ceb4d'}}>Logout </Text>
            </MenuOption>
            <MenuOption onSelect={() => ChangeEmail()}>
              <Text style={{color:'#9ceb4d'}}>Change Email </Text>
            </MenuOption>
          </MenuOptions>
        </Menu>
    </View>
            
         </View>
         {TurfListRender &&
         <>
        <View>
        
          <TextInput 
          style={styles.input} 
          placeholder='Search City' 
          onChangeText={(value)=>setSearchCity(value)}
        value={SearchCity}/>
        </View>
        <ScrollView style={{width:"100%",opacity:1}}>
          {turfarray.map(({ TurfID ,TurfName, Address, Phone, PricePerHour,TurfStartTime,TurfEndTime,latitude,longitude,city }) =>city=="Ahmedabad"||SearchCity?(
           
           <View style={styles.Cards}>
           <Text style={{ fontWeight:"bold", fontSize:25, color:'#9ceb4d',paddingBottom:10}}>{TurfName}</Text>
           <Text style={{  fontSize:18, color:'white',paddingBottom:10}}>{Address}</Text>
           <Text style={{ fontSize:18, color:'white',paddingBottom:10}}>{Phone}</Text>
           <Text style={{ fontSize:17, color:'#9ceb4d',textAlign:'left',paddingBottom:10}}>₹ {PricePerHour} /Hr</Text>
           <Text style={{ fontSize:17, color:'white',textAlign:'left'}}>{distance(latitude,longitude,devicelatitude,devicelongitude)} Km</Text>
           <View style={styles.buttoncontainer} >
           
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

           })} color={'#cbff1f'}/>
           
           </View>
        </View>
          ):null)}
        </ScrollView>
        </>
        }

       {MyBookingRender &&
       <>
       <Text style={{ fontWeight:"bold", fontSize:25, color:'#6cb52b',paddingBottom:10}}>My Bookings:</Text>
       <ScrollView style={{width:"100%"}}>
       {UserBookingArray.map(({ TurfName,BookingID ,DateOfBooking,BookingStartTime,BookingEndTime }) =>(
           
           <View style={styles.Cards}>
           <Text style={{ fontWeight:"bold", fontSize:25, color:'#9ceb4d',paddingBottom:10}}>{TurfName}</Text>
           <Text style={{ fontSize:17, color:'white',textAlign:'left',paddingBottom:10}}>Booking ID: {BookingID}</Text>
           <View style={styles.iconmenu}>
           <Icon
            name="calendar"
            color="#9ceb4d"
            size={22}
            ></Icon>
           <Text style={{ fontSize:17, color:'white',textAlign:'left',paddingBottom:10,paddingLeft:10,}}>{DateOfBooking.substring(0,10)}</Text>
           </View>
           <View style={styles.iconmenu}>
           <Icon
            name="clock"
            color="#9ceb4d"
            size={22}
            ></Icon>
           <Text style={{ fontSize:17, color:'white',textAlign:'left',paddingBottom:10,paddingLeft:10,}}>{BookingStartTime}-{BookingEndTime}</Text>
           </View>
           
           </View>
        ))}
       </ScrollView>
       </>
       }

        <View style={styles.navbar}>
          <View style={{paddingHorizontal:"17%"}}>
          <Icon 
            
            name="home"
            color="#86c452"
            size={40}
            onPress={()=>{SetTurfListRender(true), SetMyBookingRender(false)}}
            ></Icon>
            </View>
         
            <View style={{paddingHorizontal:"17%"}}>
          <Icon 
                name="book"
                color="#86c452"
                size={40}
                onPress={()=>{GetBookingsofUser(),SetMyBookingRender(true),SetTurfListRender(false)}}
              ></Icon>
              </View>
  
    
      </View>
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
    marginBottom: 10,
    backgroundColor: "#ffffff",
    fontSize: 20,
    height: 50,
    width: 320,
  },
  
  Cards:{
    alignSelf:'center',
    marginBottom:20,
    backgroundColor:'#212121',
    paddingTop:10,
    paddingLeft:10,
    borderRadius: 20 ,
    width:"85%",
    
     
 },

 navbar: {
  alignItems:"center",
  justifyContent:"center",
  flexDirection:'row',
  backgroundColor:'#141414',
  borderWidth:2,
  borderTopColor:'#86c452',
  borderColor:'#141414',
  borderRadius:15,
  paddingBottom:10,
  paddingTop:10,
  paddingLeft:15,
  width:"100%",

},


 buttoncontainer:{
  width:"50%",
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

iconmenu:{
  paddingLeft:5,
  paddingBottom:10,
  alignSelf:"flex-start", 
  flexDirection:'row'
},
});
