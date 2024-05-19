import { Router } from "express";
import { upload } from "../middlewares/multer.middlwares.js";
import { addData } from "../controllers/interest.controllers.js";

const router = Router();

router.post('/interests', upload.fields(
    [
        {
            name: "photo",
            maxCount : 1
        }
    ]
), addData);

export {router as interestRouter};