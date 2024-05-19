import { Router } from "express";
import { verifyJwt } from "../middlewares/user.middlewares.js";
import { deleteAction, getActions, logAction, updateAction } from "../controllers/action.controllers.js";

const router = Router();

router.post('/actions', verifyJwt, logAction);
router.get('/actions', verifyJwt, getActions);
router.put('/actions/:id', verifyJwt, updateAction);
router.delete('/actions/:id', verifyJwt, deleteAction);

export {router as actionsRouter};