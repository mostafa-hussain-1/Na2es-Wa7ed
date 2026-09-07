import Router from "express";
import { createUser, getAllUsers, getUserById , changePassword, updateUser, login } from "../controllers/users.controller.js";
import { verifyToken } from '../middlewares/auth.middleware.js';
import { verifyOwnership } from '../middlewares/auth.middleware.js'
import { userDataValidation, userPasswordValidation } from '../middlewares/users.middleware.js'
import { User } from "../models/user.model.js";

export const usersRouter = Router();


usersRouter.get("/", getAllUsers);
usersRouter.get("/:id", verifyToken, getUserById);


usersRouter.post("/", userDataValidation, userPasswordValidation, createUser);
usersRouter.patch("/:id", verifyToken, verifyOwnership(User, '_id', 'team', true), userPasswordValidation, changePassword);
usersRouter.put("/:id", verifyToken, verifyOwnership(User, '_id', 'team', true), userDataValidation, updateUser);

usersRouter.post('/login', login);