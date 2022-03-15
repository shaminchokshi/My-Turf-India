import { StatusBar } from "expo-status-bar";
import React, { useState, createRef, Component, useEffect } from "react";
import {TextInput, StyleSheet, Text,View,Image,ScrollView,Button,TouchableOpacity} from "react-native";
import axios from "axios";
import {PaymentIcon} from 'react-native-payment-icons'
import Icon from "react-native-vector-icons/Entypo";


export default function PaymentScreen({ navigation, route }) {


  

function creditCardValidation(creditCradNum)
{
  var mastercard = /^5[1-5][0-9]{14}$|^2(?:2(?:2[1-9]|[3-9][0-9])|[3-6][0-9][0-9]|7(?:[01][0-9]|20))[0-9]{12}$/;
  var amex =/^3[47][0-9]{13}$/;
  var visa = /^4[0-9]{12}(?:[0-9]{3})?$/;
  var discover =/^65[4-9][0-9]{13}|64[4-9][0-9]{13}|6011[0-9]{12}|(622(?:12[6-9]|1[3-9][0-9]|[2-8][0-9][0-9]|9[01][0-9]|92[0-5])[0-9]{10})$/;
  var maestro =/^(5018|5081|5044|5020|5038|603845|6304|6759|676[1-3]|6799|6220|504834|504817|504645)[0-9]{8,15}$/;
  var jcb=/^(?:2131|1800|35[0-9]{3})[0-9]{11}$/;
  var dinersclub=/^3(?:0[0-5]|[68][0-9])[0-9]{11}$/;

   if(creditCradNum.match(mastercard))
     {
      return 'master';
     }
     if(creditCradNum.match(amex))
     {
      return 'amex';
     }
     if(creditCradNum.match(visa))
     {
      return 'visa';
     }
     if(creditCradNum.match(discover))
     {
      return 'discover';
     }
     if(creditCradNum.match(maestro))
     {
      return 'maestro';
     }
     if(creditCradNum.match(jcb))
     {
      return 'jcb';
     }
     if(creditCradNum.match(dinersclub))
     {
      return 'diners';
     }
  //  else
  //    {
  //    setCardNumberError(true)
  //    }
}


  const [CreditCardRender,SetCreditCardRender]=useState(false);
  const [CardNo, setCardNo] = useState('');  
  const [CardExpiry, setCardExpiry] = useState('');
  const [CardName, setCardName] = useState('');
  const [CardCVV, setCardCVV] = useState('');
  const [CardNumberError,setCardNumberError]=useState(false)
  return(

    <>
    <View style={styles.container}>
    <View style={styles.formcontainer}>
    
    <Text style={{ fontWeight:"bold", fontSize:30, color:'#9ceb4d',paddingBottom:10, alignSelf:'flex-start'}}>#{route.params.TurfID}) {route.params.Turfname}</Text>
    <Text style={styles.heading}>Booking Date :</Text>
    <Text style={styles.subheading}>{route.params.DateOfBooking}</Text>
    <Text style={styles.heading}>Booking Time slots:</Text>
    
    {route.params.BookingStartTime.map((item,index) => (
    <Text style={styles.subheading}>{route.params.BookingStartTime[index]}</Text> 
      ))}
    <Text style={styles.heading}>Total Amount :  </Text>
    <Text style={styles.subheading}>Rs. {route.params.PaymentStatus}  </Text>

    <Text style={styles.heading}>Select Payment Method : </Text>
   
    <View style={{alignContent:"flex-start",flexDirection:'row'}}>
  <Icon 
    name="credit-card"
    color="#5c5c5c"
    paddingRight={10}
    size={40}
    onPress={()=>SetCreditCardRender(true)}
  ></Icon>
  
      <TouchableOpacity style={{padding:10,paddingLeft:30}}
      onPress={()=>{alert("you clicked me"),SetCreditCardRender(false)}}>
          <Image
          style={{width: 65, height: 18}}
           source={require("../Assets/Images/upi.png")}/>
        </TouchableOpacity>
      </View>
      
    
    {CreditCardRender &&
         <View style={styles.CreditCard}>
         <PaymentIcon style={{alignSelf:'flex-end'}}
         type={creditCardValidation(CardNo)} 
         ></PaymentIcon>
         <View style={styles.sidebyside}>  
         <TextInput style={styles.input}
        placeholder='Name On Card'
        placeholderTextColor='#212121'
        PL
        title=' CardName'
        onChangeText={(value)=>setCardName(value)}
        value={CardName}
         />
         </View>
         <View style={styles.sidebyside}>
         <TextInput style={styles.input}
        placeholder='Card Number'
        placeholderTextColor='#212121'
        title='Card Number'
        keyboardType="numeric"
        returnKeyType='done'
        onChangeText={(value)=>setCardNo(value)}
        value={CardNo}
         />
         {CardNumberError &&
         <View>
         <Text style={{color:"#ff2929"}}>Enter a valid Card Number</Text>
          </View>}
         </View>
         <View style={styles.sidebyside}>
         <TextInput style={styles.input}
        placeholder='Expiry'
        placeholderTextColor='#212121'
        title=' Card Expiry'
        onChangeText={(value)=>setCardExpiry(value)}
        value={CardExpiry}
         />
         <TextInput style={styles.input}
        placeholder='CVV'
        placeholderTextColor='#212121'
        title=' CVV'
        keyboardType="numeric"
        returnKeyType='done'
        onChangeText={(value)=>setCardCVV(value)}
        value={CardCVV}
         />
         </View>
         
         
          </View>
         }

    </View>

   
    </View>
    
    </>
    );

}
const styles = StyleSheet.create({
   
    container: {
      padding:10,
      flex: 1,
      backgroundColor:'#141414',
      alignItems:'center',
      
      },
    
     

    formcontainer: {
        padding:10,
        backgroundColor:'#212121',
        width:350,
        borderRadius: 20,
        marginBottom:30,
        marginTop:10,
        //marginHorizontal:20,
        alignItems:'center'
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

    CreditCard:{
        
        padding:8,
        backgroundColor:'#a9ffa6',
        width:300,
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
    })