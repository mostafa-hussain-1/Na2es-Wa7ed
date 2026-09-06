import { Request, Response } from "express";
import { Team } from "../models/team.model.js";



export const getAllTeams = async (req: Request, res: Response) => {

    try {
        const teams = await Team.find()

        if (teams.length === 0) {
            return res.status(404).json({message: "Teams not found"})
        }

        return res.status(200).json(teams)
    }
    catch (error) {
        console.error("Error fetching all teams:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const getTeamByID = async (req: Request, res: Response) => {

    const { id } = req.body

    try {

        const team = Team.findOne({ id })

        if (!team) {
            return res.status(404).json({message: "Team not found"})
        }

        return res.status(200).json(team)
    }
    catch (error) {
        console.error("Error fetch team by id:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const getTeamsByLeaderId = async (req: Request, res: Response) => {

    try {
        const { leaderId } = req.params

        const teams = await Team.find({leaderId: leaderId as any}) 

        if (!teams) {
            return res.status(404).json({message: "Teams not found"})
        }

        return res.status(200).json(teams)
    }
    catch (error){

        console.error("Error fetching teams by leader id:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const createTeam = async (req: Request, res: Response) => {
    
    const { leaderId, post, course, numOfRequiredMembers } = req.body

    try {

        const newTeam = new Team({
            leaderId,
            post,
            course,
            numOfRequiredMembers
        })

        await newTeam.save();
        res.status(201).json(newTeam)
    }
    catch (error) {
        console.error("Error creating team:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const editTeam = async (req: Request, res: Response) => {

    const { post, course, numOfRequiredMembers } = req.body
    const id = req.params

    try {
        const team = await Team.findByIdAndUpdate(id, {
            post, course, numOfRequiredMembers
        }, { new: true })

        if (!team) {
            return res.status(404).json({message: "Team not found"})
        }

        res.status(200).json(team)
    }
    catch (error) {
        console.error("Error edit team:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const deleteTeam = async (req: Request, res: Response) => {

    const id = req.params

    try {
        const team = Team.findByIdAndDelete(id)

        if (!team) {

            return res.status(404).json({message: "Team not found"})
        }

        res.status(200).json({message: "Team deleted successfully"})

    }
    catch (error) {
        console.error("Error delete team:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}