const jwt = require('jsonwebtoken');
const JWT_SIGN_SECRET = "95d10919b23dc75ce2cbaebc7936a5d832f67b65cd7fe98990de8ef640e17128"
module.exports = {

    generateTokenUser: function(data){ 
       // console.log(pseudo, userId)
        return jwt.sign({
            userId : data[0]._id,
            pseudo : data[0].userPseudo
            
        },
        JWT_SIGN_SECRET,
        {
            expiresIn:"12h"
        })
       
    }
}