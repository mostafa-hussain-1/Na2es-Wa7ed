import Router from "express"
import { getProjectsByOwnerId, getProjectById, createProject, editProject, deleteProject } from '../controllers/project.controller.js'
import { verifyToken } from "../middlewares/auth.middleware.js";
import { validateProjectInfo } from '../middlewares/projects.middleware.js'
import { verifyOwnership } from '../middlewares/auth.middleware.js'
import { Project } from "../models/project.model.js";


export const projectsRouter = Router();


/**
 * @openapi
 * tags:
 *   name: Projects
 *   description: Project management operations
 */

/**
 * @openapi
 * /projects/user/{ownerId}:
 *   get:
 *     summary: Get all projects for a specific user
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: ownerId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user (owner)
 *     responses:
 *       200:
 *         description: List of user projects
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User or projects not found
 *       500:
 *         description: Server error
 */
projectsRouter.get('/user/:ownerId', getProjectsByOwnerId);

/**
 * @openapi
 * /projects/{id}:
 *   get:
 *     summary: Get a project by ID
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The project ID
 *     responses:
 *       200:
 *         description: Project found successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Project not found
 *       500:
 *         description: Server error
 */
projectsRouter.get('/:id', getProjectById);

/**
 * @openapi
 * /projects:
 *   post:
 *     summary: Create a new project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - githubLink
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               githubLink:
 *                 type: string
 *               demoLink:
 *                 type: string
 *     responses:
 *       201:
 *         description: Project created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
projectsRouter.post('/', verifyToken, validateProjectInfo, createProject);

/**
 * @openapi
 * /projects/{id}:
 *   put:
 *     summary: Edit an existing project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The project ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               githubLink:
 *                 type: string
 *               demoLink:
 *                 type: string
 *     responses:
 *       200:
 *         description: Project updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Not the owner)
 *       404:
 *         description: Project not found
 *       500:
 *         description: Server error
 */
projectsRouter.put('/:id', verifyToken, verifyOwnership(Project, 'ownerId', 'project', true), validateProjectInfo, editProject);

/**
 * @openapi
 * /projects/{id}:
 *   delete:
 *     summary: Delete a project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The project ID
 *     responses:
 *       200:
 *         description: Project deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Not the owner)
 *       404:
 *         description: Project not found
 *       500:
 *         description: Server error
 */
projectsRouter.delete('/:id', verifyToken, verifyOwnership(Project, 'ownerId', 'project', true), deleteProject);