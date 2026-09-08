import { Request, Response } from "express";
import { Project } from "../models/project.model.js";
import { calculateAndUpdateProfileScore } from '../helpers/scoreCalculator.js'
import { AuthRequest } from "../middlewares/auth.middleware.js";
import { User } from "../models/user.model.js";

export const getProjectsByOwnerId = async (req: Request, res: Response)=>{
    const {ownerId} = req.params
    
    if (!ownerId || typeof ownerId !== 'string') {
        return res.status(400).json({ message: "Invalid or missing owner ID" });
    }

    try {
        const projects = await Project.find({ ownerId });

        if (projects.length === 0) {
            return res.status(404).json({message: "No Projects Found"})
        }

        return res.status(200).json(projects);

    } catch (error) {
        console.error("Error fetching projects by owner: ", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const getProjectById = async (req: Request, res: Response)=>{
    const {id} = req.params

    try {
        const project = await Project.findById(id);

        if (!project) {
            return res.status(404).json({message: "Invalid Project Id"})
        }

        return res.status(200).json(project)
    }
    catch(error) {
        console.error("Error fetching project by id: ", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}


export const createProject = async (req: AuthRequest, res: Response)=>{
    const ownerId = req.user?.id

    const { title, description, githubLink, demoLink } = req.body

    try {
        const newProject = new Project({
            ownerId,
            title,
            description,
            githubLink,
            demoLink
        })

        await newProject.save()
        calculateAndUpdateProfileScore(ownerId as string);
        return res.status(201).json(newProject)
    }
    catch (error) {
        console.error("Error creating project: ", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}


export const editProject = async (req: Request, res: Response)=>{

    const { id } = req.params

    const { title, description, githubLink, demoLink } = req.body

    try {
        const updateProject = await Project.findByIdAndUpdate(id, {
            title,
            description,
            githubLink,
            demoLink
        }, { returnDocument: 'after' })

        if (!updateProject) {
            return res.status(404).json({message: "Project not found"})
        }

        return res.status(200).json({updateProject})
    }
    catch (error) {
        console.error("Error updating project: ", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}


export const deleteProject = async (req: AuthRequest, res: Response)=>{
    const ownerId = req.user?.id
    try {
        const project: any = req.project
        
        await project.deleteOne();

        calculateAndUpdateProfileScore(ownerId as string);

        return res.status(200).json({message: "Project deleted successfully"})
    }
    catch (error) {
        console.error("Error deleting project: ", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}