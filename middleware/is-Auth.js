const service = require('../service/token')

exports.isAuth = (req,res,next) =>{
    const authHeader = req.get('Authorization');
    if(req.path != '/auth/'){
        if (!authHeader) {
            const error = new Error('Not authenticated.');
            error.statusCode = 401;
            throw error;
        }

        const token = authHeader.split(' ')[1] // Authorization header has 2 parts, 'bearer' is the first and the token is the 2nd ( with a " " in the middle )
        
        service.decodeToken(token)
            .then(response=>{
                req.user = response, // Stores the decoded token to req.user so you can use it later in your app
                next()
            })
            .catch(response=>{
                res.status(response.status)
            })
    }else{
    next()
    }
}


