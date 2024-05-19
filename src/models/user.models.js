import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const UserSchema = mongoose.Schema({
    name : {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    location: {
        type: String,
    },
    profilePhoto: {
        type: String,
    },
    interests: [
        {
            type: String,
        },
    ]
});

UserSchema.pre('save', async function(next){
    if(!this.isModified('password')) return null;

    this.password = await bcrypt.hash(this.password, 10);
    next();
})

UserSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password);
}

UserSchema.methods.generateAccessToken = function (){
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

const User = mongoose.model('User', UserSchema);

export default User;