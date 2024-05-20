import { Router } from "express";
import { createInitiative, deleteInitiative, getInitiative, getInitiatives, getInitiativesByCreator, getInitiativesByIds, joinInitiative, updateInitiative } from "../controllers/initiative.controllers.js";
import { verifyJwt } from "../middlewares/user.middlewares.js";
import { upload } from "../middlewares/multer.middlwares.js";

const router = Router();

router.post('/initiatives', verifyJwt, upload.fields([
    {
        name: "photos",
        maxCount: 10
    },
]), createInitiative);
router.get('/initiatives', getInitiatives);
router.get('/initiatives/user', verifyJwt, getInitiativesByCreator);
router.get('/initiatives/:id', getInitiative);
router.post('/initiatives/ids', verifyJwt, getInitiativesByIds);
router.put('/initiatives/:id', verifyJwt, upload.fields(
    [
        {
            name: "photos",
            maxCount: 10
        }
    ]
), updateInitiative);
router.delete('/initiatives/:id', verifyJwt, deleteInitiative);
router.put('/initiatives/:id/join', verifyJwt, joinInitiative);

export {router as initiativesRouter};