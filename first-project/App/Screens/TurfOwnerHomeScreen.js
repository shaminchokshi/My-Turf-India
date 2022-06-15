//import { StatusBar } from "expo-status-bar";
import React, { useState, createRef, Component, useEffect } from "react";
import {TextInput, StyleSheet, Text,View,Image,ScrollView,Button,TouchableOpacity, Platform} from "react-native";
import { Navigate, Route } from "react-router-native";
import axios from "axios";
import  AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from "react-native-vector-icons/FontAwesome";
import {Menu, MenuOptions, MenuOption, MenuTrigger,} from 'react-native-popup-menu';
import {ip} from "../../constants"


export default function TurfOwnwerHomeScreen({ navigation, route }) {
const [TodaysBookingsRender,SetTodaysBookingsRender]=useState(true);
const [SelfBookingRender,SetSelfBookingRender]=useState(false);
const [ idofturf ,setidofturf]=useState([]);
const [Slotarray,setSlotarray]=useState([]);
const UserID=route.params.UserID;
const [asyncstoragetoken,setasyncstoragetoken] =useState('');
const [selfbookingprice,setselfbookingprice]=useState();

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


  const GetselfBookingPrice = async () => {
      
    //API to get self booking price per hour
     const Getselfbookingprice = await axios({
        url: `http://${ip}:3000/Getselfbookingprice`,
        method: "get",
        headers: {
          Authorization: asyncstoragetoken,
       }
    
  });
  setselfbookingprice(Getselfbookingprice.data[0].KeyValue);
};




const seemyturfs= async()=>{

     const GetIDofTurf = async () => {
      
      //API to get all the booked slots of a turf on a  particular date details
       const GetTurfID = await axios({
          url: `http://${ip}:3000/GetTurfID?TurfOwnerKey=${UserID}`,
          method: "get",
          headers: {
            Authorization: asyncstoragetoken,
         }
      
    });
    setidofturf(GetTurfID.data);
  };
  GetIDofTurf();
}




function getsbookedslots(IDofTurf){
  var d = Date,
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

     var Entrydate=[year, month, day].join('-');
       
  const slotmenu = async () => {
    
    //API to get all the booked slots of a turf on a  particular date details
    const GetAlreadyBookedSlots = await axios({
      url: `http://${ip}:3000/GetAlreadyBookedSlots?turfid=${IDofTurf}&DateOfBooking=${Entrydate}`,
      method: "get",
      headers: {
        Authorization: asyncstoragetoken,
     }
    });
    setSlotarray(GetAlreadyBookedSlots.data);
  };
   slotmenu();
}


function getsbookedslots(IDofTurf,Date){
  var d = Date,
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

     var Entrydate=[year, month, day].join('-');
       
  const slotmenu = async () => {
    
    //API to get all the booked slots of a turf on a  particular date details
    const GetAlreadyBookedSlots = await axios({
      url: `http://${ip}:3000/GetAlreadyBookedSlots?turfid=${IDofTurf}&DateOfBooking=${Entrydate}`,
      method: "get",
      headers: {
        Authorization: asyncstoragetoken,
     }
    });
    setSlotarray(GetAlreadyBookedSlots.data);
  };
   slotmenu();
}


return(
<>
<View style={styles.container}>
  <View style={styles.sidebyside}>
    <Text style={{fontWeight:'bold',paddingRight:"30%", paddingBottom:"2%", paddingTop:15 ,fontSize:28, color:'white',alignSelf:"flex-start"}}>Hey, {route.params.FirstName}</Text>
    
    <View >
       <Menu  >
         <MenuTrigger>
         <Icon
            name="bars"
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
    {TodaysBookingsRender &&
    <>
    <View style={{padding:10}}>
      <Text style={{fontWeight:'bold', paddingBottom:5 ,fontSize:18, color:'white',paddingBottom:10,alignSelf:"flex-start"}}>Click the Turf for which you want to see today's Bookings</Text>
     {idofturf.map(({TurfID,TurfName }) => (
       <View style={{padding:"1%"}}>
       <Button 
             title={TurfID +")"+TurfName}
             color='#6cb52b'
             onPress={()=>getsbookedslots(TurfID,new Date())}
             />
             </View>
       ))}
      <Text style={{fontWeight:'bold', paddingBottom:5 ,fontSize:18, color:'white',paddingBottom:10,alignSelf:"flex-start"}}>Today's Bookings:</Text>  
     </View>
     <ScrollView >
    
     {Slotarray.map(({BookingStartTime,BookingEndTime,FirstName,DateOfBooking}) => (
        <View style={styles.formcontainer}>
          
          <Text style={{ paddingBottom:5 ,fontSize:17, color:'white',paddingBottom:10,alignSelf:"flex-start"}}>Timings: {BookingStartTime}-{BookingEndTime}</Text>
        </View>
       ))}
     </ScrollView>
     </>
    }  
    {SelfBookingRender &&
    <ScrollView style={{width:"100%"}}>
     {idofturf.map(({ TurfID ,TurfName, Address, Phone, PricePerHour,TurfStartTime,TurfEndTime,latitude,longitude }) =>
           
           <View style={styles.Cards}>
           <Text style={{ fontWeight:"bold", fontSize:30, color:'#9ceb4d',paddingBottom:10}}>{TurfName}</Text>
           <Text style={{ paddingBottom:5 ,fontSize:20, color:'white',paddingBottom:10}}>{Address}</Text>
           <Text style={{ fontSize:17, color:'white',paddingBottom:10}}>{Phone}</Text>
           <Text style={{ fontSize:17, color:'#9ceb4d',textAlign:'left'}}>₹ {selfbookingprice} /Hr</Text>
           <View style={{alignSelf:"flex-end",}} >
             <View style={styles.buttoncontainer}>
           <Button title="Book Now"  onPress={()=>navigation.navigate("TurfOwnerBookingDetailsScreen",
           {
            TurfName:TurfName,
            TurfID:TurfID,
            PricePerHour:selfbookingprice,
            Address:Address,
            Phone:Phone,
            TurfStartTime:TurfStartTime,
            TurfEndTime:TurfEndTime,
            UserID:UserID,
            latitude:latitude,
            longitude:longitude,

           })}
            color={'#9ceb4d'}/>
           </View>
           </View>
        </View>
          )}
     </ScrollView>
    } 

<View style={styles.navbar}>
  <View style={{alignItems:'center',paddingRight:"5%"}}>
  <Text style={{fontWeight:'bold',color:"white"}}>See Todays Bookings</Text>
  <Icon 
    name="list-alt"
    color="#ffffff"
    size={30}
    onPress={()=>{SetTodaysBookingsRender(true), SetSelfBookingRender(false),seemyturfs(),GetselfBookingPrice();}}
  ></Icon>
  </View>
  <View style={{alignItems:'center'}}>
  <Text style={{fontWeight:'bold',color:"white"}}>Prebook Slots</Text>
  <Icon 
    name="pencil-square-o"
    color="#ffffff"
    paddingRight={0}
    size={30}
    onPress={()=>{SetSelfBookingRender(true),SetTodaysBookingsRender(false),seemyturfs(),GetselfBookingPrice();}}
  ></Icon>
  </View>
    
      </View>
    
</View>
</>
)

}
const styles = StyleSheet.create({
   
    container: {
      paddingTop:10,
      flex: 1,
      backgroundColor:'#141414',
      alignItems:'center',
      
      },
    
      buttoncontainer:{
        width:"50%",
        marginTop:"2.5%",
        alignSelf:"flex-end", 
        flexDirection:'row',
        //backgroundColor:'#74ba29',
        borderBottomRightRadius:20,
        borderTopLeftRadius:20,
        justifyContent:'center',
        shadowColor: '#e5eb34',
        shadowOffset: {width: -5, height: -5},
        shadowOpacity: 0.7,
        shadowRadius: 35 ,
        ...Platform.select({
          ios: {
            backgroundColor: '#74ba29'
          },
          android: {
            backgroundColor: '#212121',
            paddingBottom:"2%",
            paddingRight:'4%'
          },
          default: {
            backgroundColor: '#212121'
          }
        })
      },

    formcontainer: {
        padding:10,
        backgroundColor:'#212121',
        width:350,
        borderRadius: 20,
        marginBottom:20,
        marginTop:10,
        //marginHorizontal:20,
        alignItems:'flex-start'
      },
      topcontainer:{
        backgroundColor:'#141414',
        height: 45,
    
      },
      
      heading:{
        fontSize:20, 
        color:'#ffffff',
        paddingBottom:10,
        alignSelf:'flex-start',
        fontWeight:"bold"
       },

       subheading:{
        fontSize:20, 
        color:'#9ceb4d',
        paddingBottom:10,
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
      paddingTop:"2%",
      paddingBottom:"4%",
      paddingLeft:15,
      width:"100%",

    },

    Cards:{
      alignSelf:"center",
      marginBottom:20,
      backgroundColor:'#212121',
      paddingLeft:10,
      paddingTop:10,
      borderRadius: 20 ,
      width:"82%",
       
   },

    })