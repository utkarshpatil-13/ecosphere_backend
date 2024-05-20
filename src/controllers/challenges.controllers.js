import Challenge from "../models/challenge.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const createChallenge = asyncHandler(async(req, res) => {
    const {title, description, startDate, endDate} = req.body;

    if([title, description, startDate, endDate].some((field) => field.trim() === '')){
        return new ApiError(400, "All fields are required!");
    }

    const existingChallenge = await Challenge.findOne(
        {
            $or: [{title}, {description}]
        }
    );

    if(existingChallenge){
        throw new ApiError(409, "Challenge already exists");
    }

    let challengePhotosUrls = [];
    if (req.files && Array.isArray(req.files.photos) && req.files.photos.length > 0) {
        const challengePhotosLocalPaths = req.files.photos.map(image => image.path);

        const challengePhotos = await Promise.all(challengePhotosLocalPaths.map(uploadOnCloudinary));

        if (challengePhotos.length < 1) {
            throw new ApiError(400, "Initiative photos not added");
        }

        challengePhotosUrls = challengePhotos.map(photo => photo.secure_url);
    }

    if(challengePhotosUrls.length > 0){
        req.body.images = challengePhotosUrls;
    }
    req.body.creator = req.user._id;

    const createdChallenge = await Challenge.create(req.body);

    if(!createdChallenge){
        throw new ApiError(500, "Something went wrong while creating your challenge!");
    }

    res
    .status(200)
    .json(new ApiResponse(200, createdChallenge, "Challenge created successfully!"));
}); 

const getChallenges = asyncHandler(async(req, res) => {
    const challenges = await Challenge.find();

    if(!challenges){
        return new ApiError(401, "No Challenges found!");
    }

    res
    .status(200)
    .json(new ApiResponse(200, challenges, "All Challenges"));
});

const getChallenge = asyncHandler(async(req, res) => {

    const {id} = req.params;

    const challenge = await Challenge.findById(id);

    if(!challenge){
        return new ApiError(401, "No Challenges found!");
    }

    res
    .status(200)
    .json(new ApiResponse(200, challenge, "Single Challenges"));
});


const getChallengesByCreator = asyncHandler(async(req, res) => {

    const user = req.user;
    console.log(req.user);

    if (!user) {
        return res.status(400).json({ error: 'User information is missing or invalid.' });
    }

    const challenges = await Challenge.find({creator: user._id});

    if(!challenges){
        throw new ApiError(401, "No Challenges found!");
    }

    res
    .status(200)
    .json(new ApiResponse(200, challenges, "All Challenges"));
});


const updateChallenge = asyncHandler(async(req, res) => {

    const {id} = req.params;

    let challengePhotosUrls = [];
    if (req.files && Array.isArray(req.files.photos) && req.files.photos.length > 0) {
        const challengePhotosLocalPaths = req.files.photos.map(image => image.path);

        const challengePhotos = await Promise.all(challengePhotosLocalPaths.map(uploadOnCloudinary));

        if (challengePhotos.length < 1) {
            return new ApiError(400, "Challenge photos not added");
        }

        challengePhotosUrls = challengePhotos.map(photo => photo.secure_url);
    }

    if(challengePhotosUrls.length > 0){
        req.body.images = challengePhotosUrls;
    }

    const updatedChallenge = await Challenge.findByIdAndUpdate(id, req.body, {new: true});

    if(!updatedChallenge){
        return new ApiError(401, "Updates not applied for your Challenge");
    }

    res
    .status(200)
    .json(new ApiResponse(200, updatedChallenge, "Challenge updated successfully!"));

});

const deleteChallenge = asyncHandler(async(req, res) => {

    const {id} = req.params;

    await Challenge.findByIdAndDelete(id);

    res
    .status(200)
    .json(new ApiResponse(200, {}, "Challenge deleted successfully"));

});

const joinChallenge = asyncHandler(async(req, res) => {
    const {id} = req.params;

    const user = req.user;

    const challenge = await Challenge.findById(id);

    if(!challenge.participants.includes(user._id)){
        challenge.participants.push(user._id);
        await challenge.save();
    }
    else{
        throw new ApiError(401, "Already participated the challenge");
    }

    res
    .status(200)
    .json(new ApiResponse(200, challenge, `${user.name} joined ${challenge.title}`));
});

export {createChallenge, getChallenges, getChallenge, updateChallenge, deleteChallenge, joinChallenge, getChallengesByCreator};