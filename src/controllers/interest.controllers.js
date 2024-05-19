import Interest from "../models/interests.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

const addData = asyncHandler(async (req, res) => {
    let interestPhotoUrl = '';

    if (req.files && req.files.photo) {
        const interestPhotoLocalPath = req.files.photo[0].path;

        const interestPhoto = await uploadOnCloudinary(interestPhotoLocalPath);

        if (!interestPhoto) {
            throw new ApiError(400, "Interest photo not added");
        }

        interestPhotoUrl = interestPhoto.secure_url;
    }

    if (interestPhotoUrl) {
        req.body.image = interestPhotoUrl;
    }

    const data = await Interest.create(req.body);

    res
        .status(200)
        .json(new ApiResponse(200, data, "Data Inserted successfully"));
});

const getInterests = asyncHandler(async(req, res) => {
    const interests = await Interest.find();

    if(!interests){
        throw new ApiError(404, "No interests found");
    }

    res
    .status(200)
    .json(new ApiResponse(200, interests, "All Interests"));
});

export {addData, getInterests};