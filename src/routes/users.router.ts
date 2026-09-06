import Router from "express";
import { createUser, getAllUsers, getUserById , changePassword, updateUser } from "../controllers/users.controller.js";
import { verifyToken } from '../middlewares/auth.middleware.js';
import { mustSameUser } from '../middlewares/auth.middleware.js'
import { userDataValidation, userPasswordValidation } from '../middlewares/users.middleware.js'

export const usersRouter = Router();


usersRouter.get("/", getAllUsers);
usersRouter.get("/:id", verifyToken, getUserById);


usersRouter.post("/", userDataValidation, userPasswordValidation, createUser);
usersRouter.patch("/:id", verifyToken, mustSameUser, userPasswordValidation, changePassword);
usersRouter.put("/:id", verifyToken, mustSameUser, userDataValidation, updateUser);

