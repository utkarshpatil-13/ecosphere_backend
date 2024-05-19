import Interest from "../models/interests.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const addData = asyncHandler(async (req, res) => {
    let interestPhotoUrl = '';

    if (req.file) {
        const interestPhotoLocalPath = req.file.path;

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

export {addData};