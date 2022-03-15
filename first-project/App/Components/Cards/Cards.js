import React from 'react'
import {Button, Text,View} from "react-native"
import { styles } from './styles' 


const Cards = ({ID,name,address,phone,price,navigation,route}) => {
    
    

    return (
        <View style={styles.Cards}>
           <Text style={{ fontWeight:"bold", fontSize:30, color:'#9ceb4d',paddingBottom:10}}>#{ID}) {name}</Text>
           <Text style={{ fontWeight:"bold", paddingBottom:5 ,fontSize:20, color:'white',paddingBottom:10}}>  {address}</Text>
           <Text style={{ fontSize:17, color:'white'}}>  {phone}</Text>
           <Text style={{ fontSize:17, color:'#9ceb4d',fontWeight:'bold',textAlign:'right'}}>Rs. {price}</Text>
           <Button title="Book Now" onPress={()=>navigation.navigate("BookingDetailsScreen")} color={'#9ceb4d'}/>
        </View>
    )
}

export default Cards