//import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {TextInput, StyleSheet, Text,View,ScrollView,Button,Platform} from "react-native";
import axios from "axios";
import  AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from "react-native-vector-icons/Entypo";
import {Menu, MenuOptions, MenuOption, MenuTrigger,} from 'react-native-popup-menu';
import {ip} from "../../constants";
import { MaterialCommunityIcons } from 'react-native-vector-icons';




export default function HomeScreen({ navigation, route }) {

  useEffect(() => {
    
    
    
  // api to get the device location
    const getdevicelocation =  () => {
      
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
        console.log(response.data.location["latitude"]);
        setdevicelatitude(response.data.location["latitude"]);
        console.log(response.data.city["name"]);
        setdevicecity(response.data.city["name"]);
        console.log(response.data.location["longitude"]);
        setdevicelongitude(response.data.location["longitude"]);
        
        
        console.log(devicecity)
       }).catch(function (error) {
         console.error(error);
       });
      
    };
     getdevicelocation();  
     turfmenu(devicecity);
  }, []
  );
  
  const [turfarray, setturfarray] = useState([]);
  const [UserBookingArray,setUserBookingArray]=useState([])
  const[devicelatitude,setdevicelatitude]=useState(null);
  const[devicelongitude,setdevicelongitude]=useState(null);
  const [devicecity,setdevicecity]=useState('');
  const [TurfListRender,SetTurfListRender]=useState(true);
  const [MyBookingRender,SetMyBookingRender]=useState(false);
  const [asyncstoragetoken,setasyncstoragetoken] =useState('');
  //const [SearchCity, setSearchCity]= useState('');
  const nameofuser=route.params.FirstName;
  const IDofUser= route.params.UserID;
  var SearchCity;

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
      url: `${ip}/GetUserBookings?UserID=${route.params.UserID}`,
      method: "get",
      headers: {
        Authorization: asyncstoragetoken,
     }

    });
    setUserBookingArray(GetUserBookings.data);
  };
   
  const turfmenu =  async (city) => {
    // console.log(SearchCity);
    //API to get all the turf details
    const GetTurfMenu = await axios({
      url: `${ip}/GetTurfMenu?SearchCity=${city}&devicecity=${devicecity}`,
      method: "get",
     
    });
    setturfarray(GetTurfMenu.data);
  };



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
        <Text style={{ fontWeight: "bold", paddingTop: 10, paddingLeft:30, paddingRight:"45%", paddingBottom: 15, fontSize: 25, color: "#ffffff",alignSelf:'flex-end'}}> Hi, {nameofuser} </Text>
        
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
        
        
          <TextInput 
          style={styles.input} 
          placeholder='Search City or Turf Name' 
          placeholderTextColor="#777777"
          value={SearchCity}
          returnKeyType='done'
          onChangeText={(value)=>{SearchCity=value, turfmenu(SearchCity)}}
        />
        
        <ScrollView style={{width:"100%",opacity:1}}>
          {turfarray.map(({ TurfID ,TurfName, Address, Phone, PricePerHour,TurfStartTime,TurfEndTime,latitude,longitude,city,RazorpayAccount,sport }) =>
           
           <View style={styles.Cards}>
           <Text style={{ fontWeight:"bold", fontSize:20, color:'#9ceb4d',paddingBottom:"2%"}}>{TurfName}</Text>
           <Text style={{ fontSize:14, color:'white',paddingBottom:"2%"}}>{Address}, {city}</Text>
           <Text style={{ fontSize:14, color:'#9ceb4d',textAlign:'left',paddingBottom:"2%"}}>₹ {PricePerHour} /Hr</Text>
           <Text style={{ fontSize:14, color:'white',textAlign:'left'}}>{distance(latitude,longitude,devicelatitude,devicelongitude)} Km</Text>
           
      
           
           <View style={styles.sisebyside}>
           { <View style={styles.sportlist}>
           {JSON.parse(sport).map((sports)=>(
           <View style={styles.iconcontainer}>
           <MaterialCommunityIcons name={sports.name} size={27} color="#000000" style={{justifyContent:'flex-start'}} ></MaterialCommunityIcons>
           </View>
            ))}
           
           </View>  }
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
            RazorpayAccount:RazorpayAccount,
            sport:sport
           })} color={'#94f56e'} />
           
           </View>
        </View>
        </View>
          )}
        </ScrollView>
        </>
        }

       {MyBookingRender &&
       <>
       <Text style={{ fontWeight:"bold", fontSize:25, color:'#6cb52b',paddingBottom:10}}>My Bookings:</Text>
       <ScrollView style={{width:"100%"}}>
       
       {UserBookingArray.length==[]?
       <View style={{marginTop:"50%",padding:15, width:"65%", alignItems:'center',backgroundColor:'#84c94b',alignSelf:'center',borderRadius:15}}>
        <Icon
            name="emoji-sad"
            color="#ffffff"
            size={40}
            style={{padding:10}}
            ></Icon>
       <Text style={{ fontWeight:"bold", fontSize:17, color:'#ffffff',alignSelf:'center'}}>No Bookings as of now !</Text>
       </View>
       :
       UserBookingArray.map(({ TurfName,BookingID ,DateOfBooking,BookingStartTime,BookingEndTime }) =>(
           <View style={styles.Cards}>
           <>
           <Text style={{ fontWeight:"bold", fontSize:20, color:'#9ceb4d',paddingBottom:10}}>{TurfName}</Text>
           
           <View style={styles.iconmenu}>
           <Icon
            name="calendar"
            color="#9ceb4d"
            size={22}
            ></Icon>
           <Text style={{ fontSize:15, color:'white',textAlign:'left',paddingBottom:10,paddingLeft:10,}}>{DateOfBooking.substring(0,10)}</Text>
           </View>
           <View style={styles.iconmenu}>
           <Icon
            name="clock"
            color="#9ceb4d"
            size={22}
            ></Icon>
           <Text style={{ fontSize:15, color:'white',textAlign:'left',paddingBottom:10,paddingLeft:10,}}>{BookingStartTime}-{BookingEndTime}</Text>
           </View>
           </>
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
            size={30}
            onPress={()=>{SetTurfListRender(true), SetMyBookingRender(false)}}
            ></Icon>
            </View>
         
            <View style={{paddingHorizontal:"17%"}}>
          <Icon 
                name="open-book"
                color="#86c452"
                size={30}
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
    paddingLeft: "1%",
    marginBottom: "4%",
    backgroundColor: "#ffffff",
    fontSize: 17,
    height: '5%',
    width: "85%",
  },
  
  Cards:{
    alignSelf:'center',
    marginBottom:"5%",
    backgroundColor:'#212121',
    paddingTop:"2%",
    paddingLeft:"3%",
    borderRadius: 15 ,
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
  paddingTop:"2%",
  paddingLeft:15,
  width:"100%",

},


buttoncontainer:{
  width:"50%",
  marginTop:"2.5%",
 alignSelf:"flex-end", 
  borderBottomRightRadius:20,
  borderTopLeftRadius:20,
  justifyContent:'flex-end',
  shadowColor: '#e5eb34',
  // marginLeft:"10%",
  shadowOffset: {width: -5, height: -5},
  shadowOpacity: 0.7,
  shadowRadius: 35 ,
  ...Platform.select({
    ios: {
      backgroundColor: '#74ba29'
    },
    android: {
      backgroundColor: '#212121',
      paddingBottom:"2%"
    },
    default: {
      backgroundColor: '#212121'
    }
  })
},

iconmenu:{
  paddingLeft:5,
  paddingBottom:5,
  alignSelf:"flex-start", 
  flexDirection:'row'
},
sisebyside:{
 
  flexDirection:'row',
  alignItems:'center',
 // backgroundColor:'red'
},

iconcontainer:
{backgroundColor:"#84a641",
padding:'1%',
marginRight:'3%',
marginTop:'3%',
borderRadius:5
},
sportlist:{
  width:"50%",
  alignSelf:"flex-start", 
  flexDirection:'row'
},
});
