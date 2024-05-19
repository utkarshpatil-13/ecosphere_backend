import User from "../models/user.models.js";
import jwt from 'jsonwebtoken'
import { ApiError } from "../utils/ApiError.js";

export const verifyJwt = async(req, res, next) => {
    try{
        const token = req.headers['authorization'].replace('Bearer ', '');

        if(!token){
            return new ApiError(401, 'Unathorized request');
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decodedToken._id).select('-password');

        if(!user){
            return new ApiError(401, 'Invalid Access Token');
        }

        req.user = user;

        next();
    } 
    catch(error){
        return new ApiError(401, error?.message || "Invalid Access Token");
    }
};