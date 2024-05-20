import { Router } from "express";
import { verifyJwt } from "../middlewares/user.middlewares.js";
import { createChallenge, deleteChallenge, getChallenge, getChallenges, getChallengesByCreator, joinChallenge, updateChallenge } from "../controllers/challenges.controllers.js";
import { upload } from "../middlewares/multer.middlwares.js";

const router = Router();

router.post('/challenges', verifyJwt, upload.fields([
    {
        name: "photos",
        maxCount: 10
    },
]), createChallenge);
router.get('/challenges', getChallenges);
router.get('/challenges/user', verifyJwt, getChallengesByCreator);
router.get('/challenges/:id', getChallenge);
router.put('/challenges/:id', verifyJwt, upload.fields([
    {
        name: "photos",
        maxCount: 10
    },
]), updateChallenge);
router.delete('/challenges/:id', verifyJwt, deleteChallenge);
router.put('/challenges/:id/join', verifyJwt, joinChallenge);

export {router as challengesRouter};