import Initiative from "../models/initiative.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createInitiative = asyncHandler(async(req, res) => {
    const {title, description, date, location} = req.body;

    if([title, description, date, location].some((field) => field.trim() === '')){
        return new ApiError(400, "All fields are required!");
    }

    const existingInitiative = await Initiative.findOne(
        {
            $or: [{title}, {description}]
        }
    );

    if(existingInitiative){
        return new ApiError(409, "Initiative already exists");
    }

    let initiativePhotosUrls = [];
    if (req.files && Array.isArray(req.files.photos) && req.files.photos.length > 0) {
        const initiativePhotosLocalPaths = req.files.photos.map(image => image.path);

        const initiativePhotos = await Promise.all(initiativePhotosLocalPaths.map(uploadOnCloudinary));

        if (initiativePhotos.length < 1) {
            return new ApiError(400, "Initiative photos not added");
        }

        initiativePhotosUrls = initiativePhotos.map(photo => photo.secure_url);
    }

    if(initiativePhotosUrls.length > 0){
        req.body.images = initiativePhotosUrls;
    }
    req.body.creator = req.user._id;

    const createdInitiative = await Initiative.create(req.body);

    if(!createdInitiative){
        return new ApiError(500, "Something went wrong while creating your initiative!");
    }

    res
    .status(200)
    .json(new ApiResponse(200, createdInitiative, "Initiative created successfully!"));
}); 

const getInitiatives = asyncHandler(async(req, res) => {
    const initiatives = await Initiative.find();

    if(!initiatives){
        return new ApiError(401, "No Initiatives found!");
    }

    res
    .status(200)
    .json(new ApiResponse(200, initiatives, "All Initiatives"));
});

const getInitiative = asyncHandler(async(req, res) => {

    const {id} = req.params;

    const initiative = await Initiative.findById(id);

    if(!initiative){
        return new ApiError(401, "No Initiatives found!");
    }

    res
    .status(200)
    .json(new ApiResponse(200, initiative, `Single Initiative`));
});

const getInitiativesByIds = asyncHandler(async(req, res) => {

    const {ids} = req.body;

    console.log(ids);

    if(!ids || !Array.isArray(ids) || ids.length === 0){
        return res
        .status(400)
        .json(new ApiError(400, "Invalid of missing ids array in request body"));
    }

    const initiatives = await Initiative.find({_id : {$in: ids}});

    if(!initiatives){
        return res
        .status(404)
        .json(new ApiError(404, "Initiatives not found!"));
    }

    res
    .status(200)
    .json(new ApiResponse(200, initiatives, `Initiatives by Id`));
});


const getInitiativesByCreator = asyncHandler(async(req, res) => {

    const user = req.user;

    const initiatives = await Initiative.find({creator: user._id});

    if(!initiatives){
        throw new ApiError(401, "No Initiatives found!");
    }

    res
    .status(200)
    .json(new ApiResponse(200, initiatives, "All Initiatives"));
});


const updateInitiative = asyncHandler(async(req, res) => {

    const {id} = req.params;

    let initiativePhotosUrls = [];
    if (req.files && Array.isArray(req.files.photos) && req.files.photos.length > 0) {
        const initiativePhotosLocalPaths = req.files.photos.map(image => image.path);

        const initiativePhotos = await Promise.all(initiativePhotosLocalPaths.map(uploadOnCloudinary));

        if (initiativePhotos.length < 1) {
            return new ApiError(400, "Initiative photos not added");
        }

        initiativePhotosUrls = initiativePhotos.map(photo => photo.secure_url);
    }

    if(initiativePhotosUrls.length > 0){
        req.body.images = initiativePhotosUrls;
    }

    const updatedInitiative = await Initiative.findByIdAndUpdate(id, req.body, {new: true});

    if(!updatedInitiative){
        return new ApiError(401, "Updates not applied for initiative");
    }

    res
    .status(200)
    .json(new ApiResponse(200, updatedInitiative, "Initiative updated successfully!"));

});

const deleteInitiative = asyncHandler(async(req, res) => {

    const {id} = req.params;

    await Initiative.findByIdAndDelete(id);

    res
    .status(200)
    .json(new ApiResponse(200, {}, "Initiative deleted successfully"));

});

const joinInitiative = asyncHandler(async(req, res) => {
    const {id} = req.params;

    const user = req.user;

    const initiative = await Initiative.findById(id);

    if(!initiative.participants.includes(user._id)){
        initiative.participants.push(user._id);
        await initiative.save();
    }

    res
    .status(200)
    .json(200, new ApiResponse(200, initiative, `${user._id} joined ${initiative.name}`));
});

export {createInitiative, getInitiatives, getInitiative, updateInitiative, deleteInitiative, joinInitiative, getInitiativesByCreator, getInitiativesByIds};