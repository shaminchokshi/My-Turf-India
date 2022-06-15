const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const mysql = require("mysql");
const { response } = require('express');
const bcrypt = require ('bcrypt');
const Razorpay = require('razorpay');
const {create_token,verify}=require("./token")
var cron = require('node-cron');
const axios = require('axios').default;
const ip="192.168.68.115";

var timecount = 0;

const app=express()
app.use(express.json())
app.use(cors());

var instance = new Razorpay({
    key_id: 'rzp_test_JpSlgZfavi3Cwn',
    key_secret: '9Z37sUwVRU3d9OGgRWVfsFvQ',
  });


const transporter = nodemailer.createTransport({
    service: 'Gmail',
    port: 465,
    secure: false,
    auth: {
        user: "shaminchokshi2000@gmail.com",
        pass: "keadqiyqlgaoidyn",
    },
});

const db = mysql.createConnection({
    // host: "localhost",
    // user: "root",
    // port: 3306, 
    // password: "imindian",
    // database: "MyTurfIndia"



    host: "sql5.freemysqlhosting.net",
    user: "sql5471415",
    port: 3306, 
    password: "ZzV7KZFqIz",
    database: "sql5471415"
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

    db.query("INSERT INTO User (FirstName, LastName, MobileNo, Email, Password, UserRole, VerificationStatus, OTP, TNCStatus) VALUES (?,?,?,?,?,?,?,?,?)", [FirstName, LastName, MobileNo, Email, Password, UserRole, VerificationStatus, OTP, TNCStatus], (error, result) => {
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
  
     db.query("SELECT OTP from User WHERE Email=?",[Email],  ( error,result) => {
         
        console.log(result);
        res.send(result)
                   
        });
        
    
     })
     // API TO UPDATE VERIFICATION STATUS OF USER
     app.put("/UpdateVerificationStatus", async (req, res) => {

        const Email=req.body.email;
        const OTP= req.body.otp;
        
            db.query("UPDATE User SET VerificationStatus = 'Yes' WHERE Email=? AND OTP=?;", [Email, OTP], (error, result) => {
                if(error){
                    res.status(406).send(error.message)
                    return
                }
                res.status(200).send("User Verified")
            })
            
            
        })



    // API TO UPDATE Password
    app.put("/UpdatePassword", async (req, res) => {

        const Email=req.body.Email;
        const Password=await bcrypt.hash(req.body.Password,5);
        console.log(Email);
        console.log(Password);
            db.query("UPDATE User SET Password = ? WHERE Email=?;", [Password,Email], (error, result) => {
                if(error){
                    res.status(406).send(error.message)
                    return
                }
                res.status(200).send("Password Updated")
            })
            
            
        })


      // API TO UPDATE Email
    app.put("/UpdateEmail",verify, async (req, res) => {

        const Email=req.body.Email;
        const UserID=req.body.UserID
        console.log(Email);
        console.log(UserID);
            db.query("UPDATE User SET Email = ? WHERE UserID=?;", [Email,UserID], (error, result) => {
                if(error){
                    res.status(406).send(error.message)
                    return
                }
                res.status(200).send("Email Updated")
            })
            
            
        })


         // API TO UPDATE PaymentStatus after payment success
    app.put("/UpdatePaymentStatus", async (req, res) => {

        const BookingID=req.body.BookingID
        
        console.log(BookingID);
            db.query("UPDATE Bookings SET PaymentStatus = 'Done' WHERE BookingID=?;", [BookingID], (error, result) => {
                if(error){
                    res.status(406).send(error.message)
                    return
                }
                res.status(200).send("Payment Successful")
            })
            
            
        })



      //API to to get login details of a user
   app.post("/GetLoginDetails", async (req, res) => {
    
    const Email=req.body.Email;
    const Password=req.body.Password;
  
     db.query("SELECT UserID, FirstName, Email, Password, UserRole from User WHERE Email=?",[Email], async ( error,result) => {
        
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
                 Email:result[0].Email,
                 UserRole:result[0].UserRole,})
         }      
        });
        
    
     })  


          //API to to get CHECK IF EMAIL EXISTS
   app.get("/GetEmail", async (req, res) => {
    
    const Email=req.query.Email;
    
  
     db.query("SELECT Email from User WHERE Email=?",[Email], async ( error,result) => {
        
        console.log(result); 
         res.send(result);
               
        });
      })



//API to to add values in booking table with "NO" in payment status for concurrency
   app.post("/AddBookingDetails",verify, async (req, res) => {
     
    const UserID= req.body.UserID;
    const TurfID=req.body.TurfID;
    const DateOfBooking= req.body.DateOfBooking;
    const BookingStartTime=req.body.BookingStartTime;
    const BookingEndTime=req.body.BookingEndTime;
    const PaymentStatus= req.body.PaymentStatus;
    const TC= timecount;
    
  
     db.query("INSERT INTO Bookings (UserID, TurfID, DateOfBooking , BookingStartTime, BookingEndTime , PaymentStatus,timecount) VALUES (?,?,?,?,?,?,?)",[UserID, TurfID, DateOfBooking , BookingStartTime, BookingEndTime , PaymentStatus, TC], async ( error,result) => {
        
        if(error){
            res.send("error");
        } 
        else{
            console.log(result); 
             res.send(result);
            }    
        });
      })



       //API to to get Menu of turfs
   app.get("/GetTurfMenu", async (req, res) => {
    
    db.query("SELECT * from TURF",  ( error,result) => {
        try {
            console.log(result);
        res.send(result)
        } catch (error) {
            res.status(406,{error:error.message})
        }
                   
        });
       
     })

   
     
         //API to delete unpaid entries on pressing back button from payments screen for concurrency
   app.delete("/DeleteUnpaidBookingsOnBack",verify, async (req, res) => {
     const BookingID=req.body.BookingID;

    db.query("delete from Bookings where BookingID=? and PaymentStatus='No'",[BookingID],  async ( error,result) => {
        try {
            console.log(result);
        res.send(result)
        } catch (error) {
            res.status(406,{error:error.message})
        }
                   
        });
       
     })



     //api to get booking timings by bookingID 
     app.get("/GetBookingTimings", async (req, res) => {
     
        const BookingID = req.query.BookingID;
        
        db.query("SELECT BookingStartTime, BookingEndTime from Bookings  WHERE BookingID =?",[BookingID],  ( error,result) => {
            try {
                console.log(result);
            res.send(result)
            } catch (error) {
                res.status(406,{error:error.message})
            }
                       
            });
           
         })





        //API to to get Menu of turfs
   app.get("/GetUserBookings",verify, async (req, res) => {
     
    const UserID = req.query.UserID;
    console.log(UserID);
    db.query("SELECT Bookings.BookingID, Bookings.DateOfBooking , Bookings.BookingStartTime, Bookings.BookingEndTime , TURF.TurfName from Bookings INNER JOIN TURF ON Bookings.TurfID= TURF.TurfID WHERE Bookings.UserID =? and PaymentStatus='Done'",[UserID],  ( error,result) => {
        try {
            console.log(result);
        res.send(result)
        } catch (error) {
            res.status(406,{error:error.message})
        }
                   
        });
       //SELECT BookingStartTime, BookingEndTime from Bookings  where TurfID=? and DateOfBooking=?
     })


      

     //API to get turf ID from turf owner key
     app.get("/GetTurfID",verify, async (req, res) => {
        const TurfOwnwerKey = req.query.TurfOwnerKey;
        console.log(TurfOwnwerKey);
        db.query("SELECT * from TURF WHERE TurfOwnerKey =?", [TurfOwnwerKey], ( error,result) => {
            try {
                console.log(result);
            res.send(result)
                
            } catch (error) {
                res.status(406,{error:error.message})
            }
                       
            });
         })




         //API to get self booking price for turf owner 
     app.get("/Getselfbookingprice",verify, async (req, res) => {
        
        db.query("SELECT KeyValue from MTIconfigtable WHERE KeyName ='SelfBookingPricePerHour'", ( error,result) => {
            try {
                
            res.send(result)
                
            } catch (error) {
                res.status(406,{error:error.message})
            }
                
            
                       
            });
           
         })


        // api to delete all unpaid bookings after 9 minutes of not paying
         app.delete("/DeleteUnpaidBookingsafterninemins", async (req, res) => {
            const tc=timecount-9;
       
           db.query("delete from Bookings where PaymentStatus='No' and timecount<=?",[tc],  async ( error,result) => {
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
            db.query("SELECT BookingStartTime, BookingEndTime from Bookings  where TurfID=? and DateOfBooking=?", [TurfID,DateOfBooking] ,( error,result) => {
                            
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


//API to generate order id for payments for user
app.post("/create/userorderId",verify,(req,res)=>{
 const mtfcommission=req.body.mtfcommission;
 
    var options = {
        amount: req.body.amount,  // amount in the smallest currency unit (paise)
        currency: "INR",
        transfers: [
            {
              account: "acc_JQ1OL6Nbbn5slh",
              amount: mtfcommission,
              currency: "INR",
              on_hold: 0,
              
            },
            {
            
              account: "acc_JQ1OL6Nbbn5slh",
              amount: req.body.amount-mtfcommission,
              currency: "INR",
              on_hold: 1
            }
          ],

        receipt: req.body.receipt,
      };
      instance.orders.create(options, function(err, order) {
        console.log(order);
        res.send({orderId: order.id});
      });

})


//API to generate order id for payments for turf owner
app.post("/create/turfownerorderId",verify,(req,res)=>{
    
    
       var options = {
           amount: req.body.amount,  // amount in the smallest currency unit (paise)
           currency: "INR",
           receipt: req.body.receipt,
         };
         instance.orders.create(options, function(err, order) {
           console.log(order);
           res.send({orderId: order.id});
         });
   
   })



   cron.schedule("* * * * *", function() {
    console.log("running a task every 1 minute");
    timecount=timecount+1;
    console.log(timecount);
   

    const deleteDatafromBookings=axios({

        url: `http://${ip}:3000/DeleteUnpaidBookingsafterninemins`,
        method: "delete",
       

       });
       console.log(deleteDatafromBookings.data);


  }); 
  

app.listen(3000,()=>{
    console.log("listening on port 3000")
})