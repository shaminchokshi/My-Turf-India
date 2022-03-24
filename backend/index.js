const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const mysql = require("mysql");
const { response } = require('express');
const bcrypt = require ('bcrypt');
const {create_token,verify}=require("./token")


const app=express()
app.use(express.json())
app.use(cors());

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    port: 465,
    secure: true,
    auth: {
        user: "shaminchokshi2000@gmail.com",
        pass: "imindian",
    },
});

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    port: 3306, 
    password: "imindian",
    database: "MyTurfIndia"
})

db.connect(err => {
    if(err){
        return err;
    }
})


//API to add entry in User table after signup
app.post("/SignUp", async (req, res) => {

const FirstName=req.body.firstName;
    const LastName=req.body.lastName;
    const MobileNo=req.body.mobileno;
    const Email=req.body.email;
    const Password=await bcrypt.hash(req.body.password, 5);
    const UserRole="Booker";
    const VerificationStatus="No";
    const OTP=req.body.sentOTP;
    const TNCStatus="Yes";

    db.query("INSERT INTO user (FirstName, LastName, MobileNo, Email, Password, UserRole, VerificationStatus, OTP, TNCStatus) VALUES (?,?,?,?,?,?,?,?,?)", [FirstName, LastName, MobileNo, Email, Password, UserRole, VerificationStatus, OTP, TNCStatus], (error, result) => {
        if(error){
            res.status(406).send(error.message)
            return
        }
        res.status(200).send("entered")
    })
    
    
})
//API to Verify User with otp
   app.get("/CheckForOTP", async (req, res) => {
    
    const Email=req.query.Email;
    console.log(Email);
  
     db.query("SELECT OTP from USER WHERE Email=?",[Email],  ( error,result) => {
         
        console.log(result);
        res.send(result)
                   
        });
        
    
     })
     // API TO UPDATE VERIFICATION STATUS OF USER
     app.put("/UpdateVerificationStatus", async (req, res) => {

        const Email=req.body.email;
        const OTP= req.body.otp;
        
            db.query("UPDATE user SET VerificationStatus = 'Yes' WHERE Email=? AND OTP=?;", [Email, OTP], (error, result) => {
                if(error){
                    res.status(406).send(error.message)
                    return
                }
                res.status(200).send("User Verified")
            })
            
            
        })

      //API to to get login details of a user
   app.post("/GetLoginDetails", async (req, res) => {
    
    const Email=req.body.Email;
    const Password=req.body.Password;
  
     db.query("SELECT UserID, FirstName, Email, Password from USER WHERE Email=?",[Email], async ( error,result) => {
        
        console.log(result); 
        const validPassword = await bcrypt.compare(req.body.Password, result[0].Password);
        console.log(validPassword);
        if (!validPassword) 
         {res.send({message:'Invalid Email or Password'});
         }
         else{
             res.send({
                 message:"Login Success",
                 FirstName:result[0].FirstName,
                 UserID:result[0].UserID,
                 Email:result[0].Email})
         }      
        });
        
    
     })  

       //API to to get Menu of turfs
   app.get("/GetTurfMenu", async (req, res) => {
    
    db.query("SELECT * from Turf",  ( error,result) => {
        try {
            console.log(result);
        res.send(result)
        } catch (error) {
            res.status(406,{error:error.message})
        }
                   
        });
       
     })

     //API to get occupied slots of a Particular Turf
     app.get("/GetAlreadyBookedSlots",verify, async (req, res) => {
         try {
            TurfID=req.query.turfid;
            DateOfBooking=req.query.DateOfBooking;
            db.query("SELECT BookingStartTime, BookingEndTime from Bookings where TurfID=? and DateOfBooking=?", [TurfID,DateOfBooking] ,( error,result) => {
                
                console.log(result);
                res.send(result)
                           
                });
         } catch (error) {
            res.status(406,{error:error.message})
         }
        
            
        
         })

app.post("/" ,(req,res) => {
    let mailOptions = {
        from: 'shaminchokshi2000@gmail.com',
        to: req.body.email ,
        subject: "OTP for My Turf India",
        text: "Your OTP for My Turf India is "+ req.body.otp,
    }

    transporter.sendMail(mailOptions, (error, response) => {
        if (error) {
            console.log(error);
            throw error;
        }
        console.log('Email Response ', response);
        return true;
    });  
    res.send("sent")
})

app.get("/token",(req,res)=>{
    const token=create_token()
    res.send({token:token})
})

app.get("/hello",verify,(req,res)=>{
    try {      
        console.log(req.decodedData)
         res.send({data:req.decodedData})
    } catch (error) {
        res.status(406,{error:error.message})
    }
})

app.listen(3000,()=>{
    console.log("listening on port 3000")
})