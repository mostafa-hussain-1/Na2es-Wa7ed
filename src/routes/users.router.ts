import Router from "express";
import { createUser, getAllUsers, getUserById , changePassword, updateUser } from "../controllers/users.controller.js";
import { verifyToken } from '../middlewares/auth.middleware.js';
import { mustSameUser } from '../middlewares/auth.middleware.js'

export const usersRouter = Router();

usersRouter.post("/", createUser);


usersRouter.get("/", getAllUsers);
usersRouter.get("/:id", verifyToken, getUserById);


usersRouter.patch("/:id", verifyToken, mustSameUser, changePassword);
usersRouter.put("/:id", verifyToken, mustSameUser, updateUser);

