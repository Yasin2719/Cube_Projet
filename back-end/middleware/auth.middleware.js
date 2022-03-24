const jwt = require('jsonwebtoken')
const User = require('./../models/Users');

module.exports.checkUser = (req, res, next) => {
    
    const token = req.cookies.jwt;
    //console.log('token : ' +token);
    //console.log(res.locals.user);
    if (token){
        jwt.verify(token, process.env.JWT_SIGN_SECRET, async(err, user)=>{
            if (err){
                //console.log('res '+ res._id);
               // console.log(res.locals.user);
               res.sendStatus(401)
                res.cookie('jwt', '', {maxAge:1})
                next()
            }
            else{
                //console.log(user.userId);
                //console.log('decoded token ' + decodedToken.id );
                let userData = await User.findById(user._id);
                res.locals.user=userData
                //console.log(res.locals.userData);
                // res.locals.user = user
                // console.log("je suis "+ res.locals.user);
                next()
            }
        })
    }
    else {
        res.sendStatus(401)
    }
}

module.exports.requireAuth= (req, res, next)=> {
    // console.log(res);
    

    const token = req.cookies.jwt
        if (token){
            jwt.verify(token, process.env.JWT_SIGN_SECRET, async (err, decodedToken)=>{
                // console.log(decodedToken);
                //console.log('user : ' + user);
                if (err){
                    console.log(err);
                }else {
                    // console.log(res)
                    // console.log('salut');
                    res.locals._id = decodedToken.data._id;
                    console.log(res.locals._id = decodedToken.data._id);
                    next();
                }
            })
        }
        else {
            console.log('no token');
        }
}