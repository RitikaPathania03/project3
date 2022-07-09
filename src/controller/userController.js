const userModel=require("../model/userModel");
//const bookModel=require("../model/bookModel");
const validator=require("email-validator")
const jwt=require("jsonwebtoken")



const userRegistartion=async function(req,res){
    try{
    let userData=req.body
    let{title,name,phone,email,password,address,street,city,pincode,...rest}=req.body
  //check if the data in request body is present or not ?
  if(!Object.keys(userData).length) return res.status(400).send({status:false,message:"Please Enter the Data in Request Body"})
  //check if any unwanted keys present or not
  //if(Object.keys(rest).length>0) return res.status(400).send({status:false,message:"Please Enter the Valid Attribute Field "})
  //check  title is present or not
  if(!title) return res.status(400).send({status:false,message:" Please Enter titile"})
  //check  name is present or not
  if(!name) return res.status(400).send({status:false,message:" Please Enter name"})
   //check phone is present or not
   if(!phone) return res.status(400).send({status:false,message:" Please Enter phone"})
   //check email is present or not
   if(!email) return res.status(400).send({status:false,message:" Please Enter email"})
   // check password is present or not
   if(!password) return res.status(400).send({status:false, message:"please Enter password"})
   // check title is valid or not
    if (!(["Mr","Mrs","Miss"].includes(title))) return res.status(400).send({status:false, message:"title is invalid"})
    
    // check name is valid or not
    // var regName = /^[a-zA-Z]+$/;
    var regName=/^[a-zA-Z ]{2,30}$/
    if(!regName.test(name)) return res.status(400).send({status:false, message:"name is invalid"})

    // check phone is valid indian number or not
    var regPhone=/^[6789]\d{9}$/; 
    if(!regPhone.test(phone)) return res.status(400).send({status:false, message:"phone is invalid"})

    //check email is valid or not
    if(!(validator.validate(email))) return res.status(400).send({status:false, message:"email is invalid"}) 

    //check password is valid or not
    var passwordReg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,10}$/;
    if (!passwordReg.test(password)) return res.status(400).send({status:false, message:"password is invalid"})

    //chech phone is unique or not
    let uniquePhone=await userModel.findOne({phone:phone})
    if(uniquePhone) return res.status(400).send({status:false, message:"phone is already present in DB"})

     //check the email is unique 
     let uniqueEmail = await userModel.findOne({ email: email })
     if ( uniqueEmail) return res.status(400).send({ status: false, msg: "E-mail is Already Present in DB" })
     
    // add user in data
    let data = await userModel.create(userData) 
    return res.status(201).send({status:true, message:"success",data:data})
    }
 catch(error){
         return res.status(500).send({ status: false, msg: error.message })
     }
}


const userLogin=async function(req,res){
    try{
    let data=req.body;
    if(Object.keys(data).length == 0){res.status(400).send({ msg: 'request body cant be empty' })}
    let userMail= req.body.email; 
    if(!userMail){ res.status(400).send({ msg: 'please enter email' })};

    let userPassword= req.body.password;
    if(!userPassword){res.status(400).send({ msg: 'please enter password' })};

    let findUser = await userModel.findOne({email: userMail, password: userPassword  });
 
    if(!findUser){ res.status(404).send({status: false,msg: 'no such author exists, invalid email or password '})};
     
    let token = jwt.sign(
    {
    userId: findUser._id.toString(),
    iat:Math.floor(Date.now() /1000),
    exp:Math.floor(Date.now()/1000)+10*60*60,
    userName:findUser.name
    },
    "group30-radon"
    );
    res.setHeader("x-api-key", token);
    res.status(201).send({ status: true, msg:"Success", data:{ token }});
    }catch (err){res.status(500).send({msg:"error",error:err.message});
    }
}




module.exports. userRegistartion= userRegistartion
module.exports.userLogin=userLogin;
