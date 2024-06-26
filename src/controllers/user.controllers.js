import User from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const register = asyncHandler(async (req, res, next) => {
    const { name, email, password } = req.body;

    if ([name, email, password].some(field => !field || field.trim() === '')) {
        throw new ApiError(400, "All fields are required!");
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new ApiError(409, "User already exists"); // 409 for conflict
    }

    console.log(req.body);
    const createdUser = await User.create(req.body);

    console.log(createdUser);

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while creating the user!");
    }

    const user = await User.findById(createdUser._id).select('-password');

    if (!user) {
        throw new ApiError(500, "Something went wrong while retrieving the user!");
    }

    return res.status(201).json(new ApiResponse(201, user, "User created successfully!")); // 201 for created
});

const generateAccessToken = async (userId) => {
    try{
        const user = await User.findById(userId);

        const accessToken = await user.generateAccessToken();

        await user.save({validateBeforeSave: false});

        return accessToken;
    }
    catch(error){
        throw new ApiError(500, "Something went wrong while generating the tokens");
    }
}

const login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    // Check if fields are not empty
    if ([email, password].some(field => !field || field.trim() === '')) {
        throw new ApiError(400, "All fields are required");
    }

    const user = await User.findOne({ email });
    
    if (!user) {
        throw new ApiError(400, "User not found");
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password);

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Password is not correct");
    }

    const accessToken = await generateAccessToken(user._id);

    const loggedInUser = await User.findById(user._id).select('-password');

    if (!loggedInUser) {
        throw new ApiError(500, "Something went wrong while retrieving the user");
    }

    res.status(200).json(new ApiResponse(
        200,
        { user: loggedInUser, accessToken },
        `${loggedInUser.name} has logged in successfully!`
    ));
});

const logout = asyncHandler(async(req, res) => {
    const user = req.user;

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "User logged out successfully!"));
});

const getUser = asyncHandler(async(req, res) => {
    const user = req.user;

    res
    .status(200)
    .json(new ApiResponse(200, user, `${user.name}'s profile!`));
});

const updateUser = asyncHandler(async(req, res) => {
    const user = req.user;
    
    const updatedUser = await User.findByIdAndUpdate(user._id, req.body, {new: true}).select('-password');

    if(!updatedUser){
        throw new ApiError(401, "User profile unable to update");
    }

    res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "User Updated Successfully!"));
});

const joinInitiative = asyncHandler(async (req, res) => {
    const {id} = req.params;

    const user = req.user;

    if(!user.initiativesParticipated.includes(id)){
        user.initiativesParticipated.push(id);
        await user.save();
    }
    
    res
    .status(200)
    .json(new ApiResponse(200, user, `${user._id} updated with initiative`));
});

const joinChallenge = asyncHandler(async (req, res) => {
    const {id} = req.params;

    const user = req.user;
    console.log(user);

    if(!user.challengesParticipated.includes(id)){
        user.challengesParticipated.push(id);
        await user.save();
    }

    res
    .status(200)
    .json(new ApiResponse(200, user, `${user._id} updated with challenge`));
});

export {register, login, logout, getUser, updateUser, joinChallenge, joinInitiative};