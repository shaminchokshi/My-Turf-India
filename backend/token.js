const jwt=require("jsonwebtoken")

const create_token=()=>{
    var token = jwt.sign({ 
        name:"MyTurfIndia",
     }, 'topsecret'
     );
     return token
}
const verify=(req,res,next)=>{
    try {
        var decoded=jwt.verify(req.headers.authorization,"topsecret")
        req.decodedData=decoded
        next()
    } catch (error) {
        throw new Error(error)
    }
}

module.exports = {create_token,verify}
