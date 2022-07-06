const userModel=require("../model/userModel");
const bookModel=require("../model/bookModel");
const jwt=require("jsonwebtoken")

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
    res.send({ status: true, msg:"Success", data:{ token }});
    }catch (err){res.status(500).send({msg:"error",error:err.message});
    }
}

module.exports.userLogin=userLogin;