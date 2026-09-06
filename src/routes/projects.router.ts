import Router from "express"
import { getProjectsByOwnerId, getProjectById, createProject, editProject, deleteProject } from '../controllers/project.controller.js'
import { verifyToken } from "../middlewares/auth.middleware.js";
import { validateProjectInfo } from '../middlewares/projects.middleware.js'
import { mustSameUser } from '../middlewares/auth.middleware.js'

export const projectsRouter = Router();


projectsRouter.get('/user/:ownerId', verifyToken, getProjectsByOwnerId)
projectsRouter.get('/:id', verifyToken, getProjectById)


projectsRouter.post('/', verifyToken, validateProjectInfo, createProject)
projectsRouter.put('/:id', verifyToken, mustSameUser, validateProjectInfo, editProject)

projectsRouter.delete('/:id', verifyToken, mustSameUser, deleteProject)
