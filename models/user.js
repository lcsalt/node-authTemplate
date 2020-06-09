const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    username: { type: String, required: true, unique: true, lowercase: true },
    // role:  { type: String, enum:['role1','role2'], required: true}
});

//Hashing password before saving
UserSchema.pre('save', function(next) {
    let user = this
    if (!user.isModified('password')) return next()
 
    bcrypt.genSalt(10, (err, salt)=>{
        if(err) return next()
 
        bcrypt.hash(user.password, salt, null, (err,hash) =>{
            if(err) return next(err)
 
            user.password = String(hash)
            next()
        })
    })
 });

module.exports = ('User', userSchema);