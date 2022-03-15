import { StatusBar } from 'expo-status-bar';
import React, {useState, createRef, Component, useEffect} from 'react';
import { StyleSheet, Text, TextInput,ScrollView, View , Image, Button, Alert,Linking} from 'react-native';
import axios from "axios";
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { Dropdown, MultiSelect } from 'react-native-element-dropdown';
import Icon from "react-native-vector-icons/Entypo";


const ip="192.168.68.112";

export default function BookingDetailsScreen ({navigation,route}){
  const [Slotarray, setSlotarray] = useState([]);//array of booked slots
  const [BookingDate, setBookingDate] = useState(new Date());
  const IDofTurf=route.params.TurfID;
  const [timeSlots,setTimeSlots]= useState([]);//array of all the timeslots
  let slots = [];
  let availableslots=[];//array of object having  availible slots (label and value for dropdown)
  const [dropdown, setDropdown] = useState(null);
  const [selected, setSelected] = useState([]);
  const [stringdate,setstringdate]=useState('');
  

  
 
  

   //on submit function
  const submit=async()=>{
    if(selected.length * route.params.PricePerHour<route.params.PricePerHour){
     Alert.alert("Please select a timeslot for booking !!")
    }
    else{
      navigation.navigate("PaymentScreen",
           {
            UserID: route.params.UserID,
            TurfID:route.params.TurfID,
            Turfname:route.params.TurfName,
            DateOfBooking: stringdate,
            BookingStartTime:selected,
            PaymentStatus: selected.length * route.params.PricePerHour,
            

           })
    }
  }


  //function to create time slots to display availible slots
  const createTimeSlots=( FromTime,ToTime )=>{
    let starttime=moment(FromTime,'HH:mm:ss');
    let endtime=moment(ToTime,'HH:mm:ss');
    let timeslotarr=[];
    while(starttime<=endtime){
     
     timeslotarr.push(new moment(starttime).format('HH:mm:ss'));
     starttime.add(1,"hour")
     
    }
    return timeslotarr;
  }

  

 

   //function that will be fired on on change of the datepicker and will convert date to string YYYY-MM-DD
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || BookingDate;
    
    setBookingDate(currentDate);
    
    var d = new Date(currentDate),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;
    setSelected([]);
    getsbookedslots([year, month, day].join('-'));    
    setstringdate([year, month, day].join('-'));
    setTimeSlots(createTimeSlots(route.params.TurfStartTime, route.params.TurfEndTime));
    };




  function getsbookedslots(Entrydate){
    const slotmenu = async () => {
      
      //API to get all the booked slots of a turf on a  particular date details
      const GetAlreadyBookedSlots = await axios({
        url: `http://${ip}:3000/GetAlreadyBookedSlots?turfid=${IDofTurf}&DateOfBooking=${Entrydate}`,
        method: "get",
      });
      setSlotarray(GetAlreadyBookedSlots.data);
    };
     slotmenu();
  }
  
  
  

  return(
        <>
        <View style={styles.container} >
         <ScrollView>
         <View style={styles.formcontainer} >
         <Text style={{ fontWeight:"bold", fontSize:30, color:'#9ceb4d',paddingBottom:10, alignSelf:'flex-start'}}>#{route.params.TurfID}) {route.params.TurfName}</Text> 
         <View style={styles.iconmenu}>
         <Icon
            name="location-pin"
            color="#9ceb4d"
            size={30}
          ></Icon>
           <Text style={styles.heading}> {route.params.Address}    </Text> 
           
         </View>
      <View style={styles.iconmenu}>
         <Icon
            name="mobile"
            color="#9ceb4d"
            size={25}
            ></Icon>
            <Text style={styles.heading}>  {route.params.Phone}</Text>
          </View>
          <View style={styles.iconmenu}>
          <Icon
            name="clock"
            color="#9ceb4d"
            size={22}
            ></Icon>
         <Text style={styles.heading}>  {route.params.TurfStartTime}-{route.params.TurfEndTime}</Text> 
         </View>
         <View style={styles.buttoncontainer}>
         <Icon
            name="direction"
            color="#ffffff"
            alignSelf='flex-start'
            size={30}
            onPress={() => Linking.openURL(`http://maps.google.com/maps?q=${route.params.latitude},${route.params.longitude}`)}
          ></Icon>
          <Button
            title="Get Directions"
            color="#ffffff"
            alignSelf='flex-start'
            onPress={() => Linking.openURL(`http://maps.google.com/maps?q=${route.params.latitude},${route.params.longitude}`)}
          />
          </View>
         <Text style={{ fontSize:20, color:'#9ceb4d',fontWeight:'bold',textAlign:'right',alignSelf:'flex-end'}}>Rs. {route.params.PricePerHour}/Hr</Text>
         
         <Text style={{ fontWeight:"bold", fontSize:15, color:'#ffffff',paddingBottom:10, alignSelf:'flex-start'}}>Choose your Date of Booking : </Text>
        
        
         <DateTimePicker style={styles.datepicker}
         minDate={new Date()}
         mode='date'
         display="spinner"
         value={BookingDate}
         onChange={onChange}
         textColor="#ffffff"
         
         />
          

          <Text style={{ fontWeight:"bold", fontSize:15, color:'#ffffff',paddingBottom:10, alignSelf:'flex-start'}}>Time Slots Already booked:</Text>
          
          {Slotarray.map(({BookingStartTime,BookingEndTime }) => (
            
            <View style = {styles.showtext} >
             <Text style={slots.push(BookingStartTime)}>{BookingStartTime}-{BookingEndTime}</Text>
             
            </View>
            
          ))}
          
          <Text style={{ fontWeight:"bold", fontSize:15, color:'#ffffff',paddingBottom:10, alignSelf:'flex-start'}}>Time Slots Available:</Text>
           <ScrollView >
           
           <View>
          <MultiSelect
          style={styles.input}
          data={availableslots}
          labelField="label"
          valueField="value"
          placeholder="Select Time Slot"
          value={selected}
          textColor="#ffffff"
          onChange={item => {
          setSelected(item);
              console.log('selected', item);
          }}
          
          />
          </View>
           
          {timeSlots.map((item,index) => (
            <View >
             {slots.includes(timeSlots[index])!= true ?<Text style={ availableslots.push(
               {label: timeSlots[index]+'-'+timeSlots[index+1],
               value: timeSlots[index]+'-'+timeSlots[index+1]
              },
              )
            }></Text> :null}
            </View>

          ))}
          
          </ScrollView> 
          <Text style={{  fontSize:23, color:'#ffffff',paddingBottom:20, alignSelf:'center'}}>------------------------------</Text>
           <Text style={{ fontSize:20, color:'#9ceb4d',fontWeight:'bold'}}>Grand Total = {selected.length * route.params.PricePerHour}</Text>
          <Button title="Pay Now" color={'#9ceb4d'} onPress={submit}/>
          
          </View>
          </ScrollView>
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

    showtext: {
      padding:10,
      flex: 1,
      backgroundColor:'#3b3b3b',
      borderRadius : 80,
      flexDirection:'row',
      alignItems:"center",
      marginBottom:8,
      alignSelf:'flex-start',
    
    },
     
   showavailabletimeslots: {
      padding:10,
      flex: 1,
      backgroundColor:'#9ceb4d',
      borderRadius : 80,
      alignItems:"center",
      marginBottom:8,
  
    },

    formcontainer: {
      padding:10,
      backgroundColor:'#212121',
      width:350,
      borderRadius: 20,
      marginBottom:30,
      marginTop:10,
      alignItems:'center'
    },
    
    
    input: {
      
      alignSelf:'flex-start',
      borderRadius : 10,
      paddingLeft:15,
       marginTop:10,
       marginBottom:10,
       backgroundColor:'#ffffff', 
       fontSize:18,
       height:45,
       width:250,
       borderColor: '#9ceb4d',
       borderWidth: 3,
      },

      datepicker: {
      
        alignSelf:'flex-start',
        borderRadius : 10,
        paddingLeft:15,
         marginTop:10,
         marginBottom:10,
         backgroundColor:'#212121', 
         fontSize:18,
         height:100,
         width:250,
         borderColor: '#9ceb4d',
         borderWidth: 3,
        },
     heading:{
      fontSize:20, 
      color:'#ffffff',
      
      alignSelf:'flex-start',
      
     },
     
     iconmenu:{
      paddingLeft:5,
      paddingBottom:10,
      alignSelf:"flex-start", 
      flexDirection:'row'
  },
  
  buttoncontainer:{
    
    padding:5,
    alignSelf:"flex-start", 
    flexDirection:'row',
    backgroundColor:'#74ba29',
    borderRadius:10,
    justifyContent:'center'
},

 map: {
    flex: 1
  },
   
  });




