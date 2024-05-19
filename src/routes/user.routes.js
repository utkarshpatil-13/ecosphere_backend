import { Router } from "express";
import { getUser, login, logout, register, updateUser } from "../controllers/user.controllers.js";
import { verifyJwt } from "../middlewares/user.middlewares.js";

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', verifyJwt, logout);
router.get('/profile', verifyJwt, getUser);
router.put('/profile', verifyJwt, updateUser);

export {router as userRouter};