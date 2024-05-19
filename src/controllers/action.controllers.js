import Action from "../models/action.models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const logAction = asyncHandler(async(req, res) => {
    const { title, description } = req.body;

    if ([title, description].some((field) => field.trim() === '')) {
        throw new ApiError(400, "All fields are required!");
    }

    req.body.user = req.user._id;

    const loggedAction = await Action.create(req.body);

    res.status(200).json(new ApiResponse(200, loggedAction, "New Action Created Successfully!"));
});



const getActions = asyncHandler(async (req, res) => {
    const actions = await Action.find({ user: req.user._id });

    if (!actions || actions.length === 0) {
        throw new ApiError(404, "No actions found for the user");
    }

    res.status(200).json(new ApiResponse(200, actions, `${req.user.name}'s Actions`));
});

const updateAction = asyncHandler(async(req, res) => {
    
    const {id} = req.params;
    const updates = req.body;

    if(!updates) {
        throw new ApiError(401, "Nothing to update");
    }

    const updatedAction = await Action.findByIdAndUpdate(id, updates, {new: true});

    if(!updatedAction){
        throw new ApiError(400, "Error occured while updating the action");
    }

    res.status(200).json(new ApiResponse(200, updatedAction, "Action updated successfully!"));

});

const deleteAction = asyncHandler(async(req, res)=> {
    const {id} = req.params;

    await Action.findByIdAndDelete(id);

    res
    .status(200)
    .json(new ApiResponse(200, {}, "Action deleted successfully"));

});

export {logAction, getActions, updateAction, deleteAction};