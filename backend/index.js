const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const mysql = require("mysql");
const { response } = require('express');


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
app.post("/SignUp", (req, res) => {

const FirstName=req.body.firstName;
    const LastName=req.body.lastName;
    const MobileNo=req.body.mobileno;
    const Email=req.body.email;
    const Password=req.body.password;
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
   app.get("/CheckForOTP", (req, res) => {
    
    const Email=req.query.Email;
    console.log(Email);
  
     db.query("SELECT OTP from USER WHERE Email=?",[Email],  ( error,result) => {
         
        console.log(result);
        res.send(result)
                   
        });
        
    
     })
     // API TO UPDATE VERIFICATION STATUS OF USER
     app.put("/UpdateVerificationStatus", (req, res) => {

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
   app.get("/GetLoginDetails", (req, res) => {
    
    const Email=req.query.Email;
    
  
     db.query("SELECT UserID, FirstName, Email, Password from USER WHERE Email=?",[Email],  ( error,result) => {
        
        console.log(result);
        res.send(result)
                 
        });
        
    
     })  

       //API to to get Menu of turfs
   app.get("/GetTurfMenu", (req, res) => {
    
    db.query("SELECT * from Turf",  ( error,result) => {
        
        console.log(result);
        res.send(result)
                   
        });
        
    
     })

     //API to get occupied slots of a Particular Turf
     app.get("/GetAlreadyBookedSlots", (req, res) => {
        TurfID=req.query.turfid;
        DateOfBooking=req.query.DateOfBooking;
        db.query("SELECT BookingStartTime, BookingEndTime from Bookings where TurfID=? and DateOfBooking=?", [TurfID,DateOfBooking] ,( error,result) => {
            
            console.log(result);
            res.send(result)
                       
            });
            
        
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

app.listen(3000,()=>{
    console.log("listening on port 3000")
})