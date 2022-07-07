const jwt =require("jsonwebtoken");



const authentication = async function (req, res, next) {

    try {
        // check if token key is present in the header/cookies
        let token = req.headers["x-api-key"];
        // if (!token) token = req.headers["x-api-key"]; //convert key to small case because it will only accept smallcase
        if(!token){
            return res.status(400).send({ status: false, msg: "Token is Missing" });
        }
        
        // Checking if the token is creted using the secret key provided and decode it.
        let decodedToken = jwt.verify(token, "group30-radon");

        if (!decodedToken)
            return res.status(401).send({ status: false, msg: "Authentication Missing. Login is required. Token is invalid" }); 

        req.userId= decodedToken.userId
            next()
        
    }
    catch (err) {
        res.status(500).send({ msg: "Serverside Errors. Please try again later", error: err.message })
    }

}

const authorisation = async function (req, res, next) {

    try {
        // check if token key is present in the header/cookies
        let token = req.headers["x-Api-key"];
        if (!token) token = req.headers["x-api-key"]; //convert key to small case because it will only accept smallcase

        // Checking if the token is creted using the secret key provided and decode it.
        let decodedToken = jwt.verify(token, "group30-radon");

        if (!decodedToken)
            return res.status(401).send({ status: false, msg: "Authentication Missing. Login is required. Token is invalid" });

        // execute if req.body will contain authorID (When new Blog is Created)
        if (req.body.userId) {
            if (decodedToken.userId != (req.body.userId)) {
                return res.status(400).send({ status: false, msg: "Forbiden . You are not Authorised" })
            }
            return next()
        }
    }
    catch (err) {
        res.status(500).send({ msg: "Serverside Errors. Please try again later", error: err.message })
    }

}



module.exports.authentication = authentication
module.exports.authorisation = authorisation