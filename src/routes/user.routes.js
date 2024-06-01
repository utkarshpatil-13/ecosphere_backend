import { Router } from "express";
import { getUser, joinChallenge, joinInitiative, login, logout, register, updateUser } from "../controllers/user.controllers.js";
import { verifyJwt } from "../middlewares/user.middlewares.js";
import { errorHandler } from "../middlewares/error.middlwares.js";

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', verifyJwt, logout);
router.get('/profile', verifyJwt, getUser);
router.put('/profile', verifyJwt, updateUser);
router.put('/join/challenge/:id', verifyJwt, joinChallenge);
router.put('/join/initiative/:id', verifyJwt, joinInitiative);

// using middleware for handling error msg
router.use(errorHandler);

export {router as userRouter};