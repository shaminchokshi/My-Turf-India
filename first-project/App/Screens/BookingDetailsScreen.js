
import React, {useState,useEffect} from 'react';
import { StyleSheet, Text,ScrollView, View , Button, Alert,Linking,ImageBackground,TouchableOpacity, Platform} from 'react-native';
import axios from "axios";
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { MultiSelect } from 'react-native-element-dropdown';
import Icon from "react-native-vector-icons/Entypo";
import  AsyncStorage from '@react-native-async-storage/async-storage';
import {ip} from "../../constants";


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
  const [asyncstoragetoken,setasyncstoragetoken] =useState('');
  const [PaymentOrderID,setPaymentOrderID]=useState("");
  const [pickervisible,setpickervisible]=useState(false);
  var PaymentOrderIDs;
  var BookingArray=[];
  var TimingArray=[];

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
  

 

//on submit function
  const submit=async()=>{
    if(selected.length * route.params.PricePerHour<route.params.PricePerHour){
     Alert.alert("Please select a timeslot for booking !!")
    }
    else{
      
      const addbookings=async()=>{

        for (let i = 0; i < selected.length; i++){
         const addDataToBookings=await axios({

          url: `http://${ip}:3000/AddBookingDetails`,
          method: "post",
          headers:{
            Authorization: asyncstoragetoken,
          },
         data:{
          UserID: route.params.UserID,
          TurfID:route.params.TurfID,
          DateOfBooking: stringdate,
          BookingStartTime:selected[i].substring(0,8),
          BookingEndTime:selected[i].substring(9,17),
          PaymentStatus: "No",
           
         }

         });
         console.log(addDataToBookings.data);
         if(addDataToBookings.data=="error"){
          var result= arrayRemove(selected, selected[i]);
          console.log(result);
          setSelected(result);
          console.log(selected);
          Alert.alert(`Time Slot ${selected[i]} has already been booked for the chosen date`);
         
         }
         else{
          BookingArray.push(addDataToBookings.data["insertId"]);
          TimingArray.push(selected[i]);
         }
         
        }

        const GetOrderId = await axios({
          url: `http://${ip}:3000/create/userorderId`,
          method: "post",
          headers:{
            Authorization: asyncstoragetoken,
          },
         data:{
           amount: ( BookingArray.length * route.params.PricePerHour * 100),
           receipt: `${route.params.TurfName},${stringdate}`,
           mtfcommission:(BookingArray.length*100*100),
         }
        });
        PaymentOrderIDs =GetOrderId.data.orderId;
        console.log(PaymentOrderIDs);
         

        setTimeout(function() { navigatetopaymentscreen(); } , 1000);


        
       
      }
      await addbookings();

       //api to get order id for payment by user
      //  const getorderid = async () => {
      
        
      //   const GetOrderId = await axios({
      //     url: `http://${ip}:3000/create/userorderId`,
      //     method: "post",
      //     headers:{
      //       Authorization: asyncstoragetoken,
      //     },
      //    data:{
      //      amount: ( selected.length * route.params.PricePerHour * 100),
      //      receipt: `${route.params.TurfName},${stringdate}`,
      //      mtfcommission:(selected.length*100*100),
      //    }
      //   });
      //   PaymentOrderIDs =GetOrderId.data.orderId;
      //   console.log(PaymentOrderIDs);
       
      // };
      //  await getorderid();
      

     console.log(BookingArray);

     function arrayRemove(arr, value) { 
    
      return arr.filter(function(ele){ 
          return ele != value; 
      });
  }

  

      //Linking.openURL(`https://mticheckout.000webhostapp.com/?orderid=${PaymentOrderIDs}`);
      const navigatetopaymentscreen = async() => {
       navigation.navigate("PaymentScreen",
           {
            UserID: route.params.UserID,
            TurfID:route.params.TurfID,
            Turfname:route.params.TurfName,
            DateOfBooking: stringdate,
            BookingStartTime:selected,
            PaymentStatus: BookingArray.length * route.params.PricePerHour,
            orderid:PaymentOrderIDs,
            BookingArray:BookingArray,
            TimingArray:TimingArray,
           });
            setSelected([]);
          }
      
      
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
  const onChange = async (event, selectedDate) => {
    const currentDate = selectedDate || BookingDate;
    
    setBookingDate(selectedDate);
    
    var d = new Date(selectedDate),
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
    setpickervisible(false);
    };



//API to get all the booked slots of a turf on a  particular date details
  function getsbookedslots(Entrydate){
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
  
 const goback=()=>{
  navigation.goBack()
 }
  

  return(
        <>
        <View style={styles.container} >
         
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
         <ScrollView style={{width:"100%"}}>
           
         <View style={styles.formcontainer} >
         <ImageBackground
         source={require("../Assets/Images/soccershoes.png")}
         style={{ opacity:0.9,width:"100%",height:400, position: 'absolute', top: 440, left: -80, right: 0, bottom: 0}}
         ></ImageBackground>
         <Text style={{ fontWeight:"bold", fontSize:27, color:'#9ceb4d',paddingBottom:10, alignSelf:'flex-start'}}>{route.params.TurfName}</Text> 
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
         <View style={styles.iconmenu}>
         <Icon
            name="direction"
            color="#9ceb4d"
            alignSelf='flex-start'
            size={30}
            onPress={() => Linking.openURL(`http://maps.google.com/maps?q=${route.params.latitude},${route.params.longitude}`)}
          ></Icon>
          <Button
            title="Get Directions"
            color="#9ceb4d"
            alignSelf='flex-start'
            onPress={() => Linking.openURL(`http://maps.google.com/maps?q=${route.params.latitude},${route.params.longitude}`)}
          />
          </View>
         <Text style={{ paddingLeft:10 ,fontSize:20, color:'#9ceb4d',paddingBottom:10,textAlign:'right',alignSelf:'flex-start'}}> ₹ {route.params.PricePerHour}/Hr</Text>
         
         <Text style={{ fontWeight:"bold", fontSize:15, color:'#ffffff',paddingBottom:10, alignSelf:'flex-start'}}>Choose your Date of Booking : </Text>
         <View style={styles.iconmenu}>
         <>
         <Icon
            name="calendar"
            color="#9ceb4d"
            alignSelf='flex-start'
            size={30}
            onPress={()=>setpickervisible(true)}
            ></Icon>
            <Button
         title='Select Date'
         color="#9ceb4d"
         onPress={()=>{setpickervisible(true)}}
         />
         </>

         </View> 

         {pickervisible &&
          
          <DateTimePicker style={styles.datepicker}
          minDate={new Date()}
          mode='date'
          display="default"
          value={BookingDate}
          onChange={onChange}
          textColor="#ffffff"
          fontSize={12}
          
          />
          }

         <View style={{alignSelf:'flex-start'}}>
          <Text style={{fontWeight:"bold", paddingBottom:"2%",fontSize:15, color:'#9ceb4d'}}>Selected Date : {stringdate}</Text>
          </View>
          <Text style={{ fontWeight:"bold", fontSize:15, color:'#ffffff',paddingBottom:10, alignSelf:'flex-start'}}>Time Slots Already booked:</Text>
          
         { Slotarray.length==[] ?<View style = {styles.showtext} >
            <Text >None</Text>
            
           </View>:Slotarray.map(({BookingStartTime,BookingEndTime }) => (
            
            <View style = {styles.showtext} >
             <Text style={slots.push(BookingStartTime)}>{BookingStartTime}-{BookingEndTime}</Text>
            </View> 
            
            ))}
            
          
          <Text style={{ fontWeight:"bold", fontSize:15, color:'#ffffff',paddingBottom:10, alignSelf:'flex-start'}}>Time Slots Available:</Text>
           <ScrollView style={{width:"100%"}}>
           
           <View>
          <MultiSelect
          title="slotselect"
          style={styles.input}
          data={availableslots}
          labelField="label"
          valueField="value"
          placeholder="Select Time Slot"
          value={selected}
          textColor="#ffffff"
          activeColor="#9ceb4d"
          renderSelectedItem={(item, unSelect) => (
            <TouchableOpacity onPress={() => unSelect && unSelect(item)}>
              <View style={styles.selectedStyle}>
                <Text style={styles.textSelectedStyle}>{item.label}</Text>
                <Icon color="white" name="circle-with-cross" size={15} />
              </View>
            </TouchableOpacity>
          )}
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
           <Text style={{ fontSize:20, color:'#cbff1f',fontWeight:'bold',paddingBottom:20}}>Grand Total = {selected.length * route.params.PricePerHour}</Text>
          <View style={styles.buttoncontainer}>
          <Button title="Pay Now" color={'#cbff1f'} onPress={submit}/>
          </View>
          </View>
          </ScrollView>
    </View>
    
        </>
    );
}
const styles = StyleSheet.create({
    container: {
      
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
      alignSelf:"center",
      paddingLeft:10,
      paddingTop:10,
      backgroundColor:'#212121',
      width:"85%",
      borderRadius: 20,
      marginBottom:30,
      alignItems:'center',
      opacity:0.9,
    },
    
    
    input: {
      
      
      borderRadius : 10,
      paddingLeft:15,
       marginTop:10,
       marginBottom:10,
       backgroundColor:'#ffffff', 
       fontSize:18,
       height:45,
       width:"60%",
       borderColor: '#9ceb4d',
       borderWidth: 3,
      },

      datepicker: {
      
        alignSelf:'flex-start',
        //borderRadius : 10,
        paddingLeft:5,
         marginLeft:10,
         marginBottom:5,
         //backgroundColor:'#212121', 
         fontSize:18,
         height:50,
         width:"80%",
         //borderColor: '#9ceb4d',
         //borderWidth: 3,
        },

     heading:{
      fontSize:18, 
      color:'#ffffff',
      
      alignSelf:'flex-start',
      
     },
     
     iconmenu:{
      paddingLeft:5,
      paddingBottom:"1%",
      alignSelf:"flex-start", 
      flexDirection:'row'
  },

  backbutton:{
    alignSelf:"flex-start",
    backgroundColor:"#469c2c",
    borderRadius:17,
    marginLeft:"4%",
    marginTop:"2%",
    marginBottom:2,


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
        paddingBottom:"2%"
      },
      default: {
        backgroundColor: '#212121'
      }
    })
  },

  selectedStyle: {
    
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
    backgroundColor: '#9cdb25',
    marginTop: 8,
    marginRight: 5,
    paddingHorizontal: 8,
    paddingVertical: 8,
    
  },

  textSelectedStyle: {
    marginRight: 5,
    fontSize: 13,
    fontWeight:"bold",
    color:"white"
  },

 map: {
    flex: 1
  },
   
  });




