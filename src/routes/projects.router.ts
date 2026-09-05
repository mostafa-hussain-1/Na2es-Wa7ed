import Router from "express"
import { getProjectsByOwnerId, getProjectById, createProject, editProject, deleteProject } from '../controllers/project.controller.js'
import { verifyToken } from "../middlewares/auth.middleware.js";


export const projectsRouter = Router();


projectsRouter.get('/user/:ownerId', verifyToken, getProjectsByOwnerId)
projectsRouter.get('/:id', verifyToken, getProjectById)


projectsRouter.post('/user/:ownerId', verifyToken, createProject)
projectsRouter.put('/:id', verifyToken, editProject)

projectsRouter.delete('/:id', verifyToken, deleteProject)
