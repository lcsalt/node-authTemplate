const jwt = require('jwt-simple');
const moment = require('moment');

exports.createToken = (user) => {
    const payload ={
        sub: user._id.toString(),
        role: user.role,
        iat: moment().unix(),
        exp: moment().add(14,'days').unix(),
    }
   return jwt.encode(payload, process.env.SECRET_TOKEN)
};

exports.decodeToken = (token) => {
    const decode = new Promise((resolve, reject) =>{
        try{
            const payload = jwt.decode(token, config.SECRET_TOKEN)
            if(payload.exp <= moment().unix()){
               reject({
                   status: 401,
                   message: 'Token expired.'
               })
            }

            resolve(payload.sub)
        
        }catch(err){
            reject({
                status:500,
                message: `Invalid Token.`
            })

        }
    });
    return decode
};