import Router from "express";
import { createUser, getAllUsers, getUserById , changePassword, updateUser, login } from "../controllers/users.controller.js";
import { verifyToken } from '../middlewares/auth.middleware.js';
import { verifyOwnership } from '../middlewares/auth.middleware.js'
import { userDataValidation, userEmailValidation, userPasswordValidation, isCorrectPassword } from '../middlewares/users.middleware.js'
import { User } from "../models/user.model.js";

export const usersRouter = Router();


/**
 * @openapi
 * tags:
 *   name: Users
 *   description: User management and authentication operations
 */

/**
 * @openapi
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of all users
 *       404:
 *         description: Users Not Found
 *       500:
 *         description: Server error
 */
usersRouter.get("/", getAllUsers);

/**
 * @openapi
 * /users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User found successfully
 *       401:
 *         description: Unauthorized (Token missing or invalid)
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */
usersRouter.get("/:id", verifyToken, getUserById);

/**
 * @openapi
 * /users:
 *   post:
 *     summary: Create a new user (Register)
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - avatarIndex
 *               - name
 *               - email
 *               - password
 *             properties:
 *               avatarIndex:
 *                 type: number
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               whatsappNumber:
 *                 type: string
 *               discordUsername:
 *                 type: string
 *               codeforcesHandle:
 *                 type: string
 *               githubLink:
 *                 type: string
 *               linkedinLink:
 *                 type: string
 *               bio:
 *                 type: string
 *               tracks:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal Server Error
 */
usersRouter.post("/", userEmailValidation, userDataValidation, userPasswordValidation, createUser);

/**
 * @openapi
 * /users/{id}:
 *   patch:
 *     summary: Change user password
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - newPassword
 *             properties:
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       400:
 *         description: Incorrect old password
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Not the owner)
 *       404:
 *         description: User Not Found
 *       500:
 *         description: Internal Server Error
 */
usersRouter.patch("/:id", verifyToken, verifyOwnership(User, '_id', 'team', true), isCorrectPassword, userPasswordValidation, changePassword);

/**
 * @openapi
 * /users/{id}:
 *   put:
 *     summary: Update user data
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               avatarIndex:
 *                 type: number
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               whatsappNumber:
 *                 type: string
 *               discordUsername:
 *                 type: string
 *               codeforcesHandle:
 *                 type: string
 *               githubLink:
 *                 type: string
 *               linkedinLink:
 *                 type: string
 *               bio:
 *                 type: string
 *               tracks:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Not the owner)
 *       404:
 *         description: User Not Found
 *       500:
 *         description: Internal Server Error
 */
usersRouter.put("/:id", verifyToken, verifyOwnership(User, '_id', 'team', true), userDataValidation, updateUser);

/**
 * @openapi
 * /users/login:
 *   post:
 *     summary: Login user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful, returns token
 *       400:
 *         description: Invalid credentials
 *       500:
 *         description: Internal Server Error
 */
usersRouter.post('/login', login);