import Router from "express"
import { getProjectsByOwnerId, getProjectById, createProject, editProject, deleteProject } from '../controllers/project.controller.js'
import { verifyToken } from "../middlewares/auth.middleware.js";
import { validateProjectInfo } from '../middlewares/projects.middleware.js'
import { verifyOwnership } from '../middlewares/auth.middleware.js'
import { Project } from "../models/project.model.js";


export const projectsRouter = Router();


projectsRouter.get('/user/:ownerId', verifyToken, getProjectsByOwnerId)
projectsRouter.get('/:id', verifyToken, getProjectById)


projectsRouter.post('/', verifyToken, validateProjectInfo, createProject)
projectsRouter.put('/:id', verifyToken, verifyOwnership(Project, 'ownerId', 'project', true), validateProjectInfo, editProject)

projectsRouter.delete('/:id', verifyToken, verifyOwnership(Project, 'ownerId', 'project', true), deleteProject)
