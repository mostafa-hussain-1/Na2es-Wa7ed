import { Request, Response } from "express";
import { Team } from "../models/team.model.js";
import { AuthRequest } from '../middlewares/auth.middleware.js'


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

    const { id } = req.params
    try {
        const team = await Team.findById(id)

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

export const createTeam = async (req: AuthRequest, res: Response) => {
    
    const { post, course, numOfRequiredMembers } = req.body
    const leaderId = req.user?.id

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
    const { id } = req.params

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

    const { id } = req.params

    try {
        const team = await Team.findByIdAndDelete(id)

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

export const applyToTeam = async (req: AuthRequest, res: Response) => {

    const applicantId = req.user?.id
    const team = req.team
    try {
        team.pendingList.addToSet(applicantId); 

        await team.save();
        res.status(200).json({message: "Applied Successfully", team: team})
    }
    catch (error) {
        console.error("Error apply team:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const cancelApply = async (req: AuthRequest, res: Response) => {

    const applicantId = req.user?.id
    const team = req.team
    try {
        team.pendingList.pull(applicantId); 

        await team.save();
        res.status(200).json({message: "Cancelled Successfully", team: team})
    }
    catch (error) {
        console.error("Error cancel apply:", error);
        return res.status(500).json({ message: "Internal server error" });   
    }
}

export const leaveTeam = async (req: AuthRequest, res: Response) => {

    const applicantId = req.user?.id
    const team = req.team
    try {
        team.membersList.pull(applicantId); 

        await team.save();
        res.status(200).json({message: "Leaved Successfully", team: team})
    }
    catch (error) {
        console.error("Error leave team:", error);
        return res.status(500).json({ message: "Internal server error" });   
    }
}

export const acceptMember = async (req: AuthRequest, res: Response) => {

    const { memberId } = req.params;
    const team = req.team
    try {
        team.membersList.addToSet(memberId);

        team.pendingList.pull(memberId);

        await team.save();
        res.status(200).json({message: "Accept Successfully", team: team})
    }
    catch (error) {
        console.error("Error accept team:", error);
        return res.status(500).json({ message: "Internal server error" });   
    }
}

export const rejectMember = async (req: AuthRequest, res: Response) => {

    const { memberId } = req.params;
    const team = req.team
    try {
        team.pendingList.pull(memberId);

        await team.save();
        res.status(200).json({message: "Rejected Successfully", team: team})
    }
    catch (error) {
        console.error("Error reject team:", error);
        return res.status(500).json({ message: "Internal server error" });   
    }
}

export const kickMember = async (req: AuthRequest, res: Response) => {

    const { memberId } = req.params;
    const team = req.team
    try {
        team.membersList.pull(memberId);
        
        team.blockList.addToSet(memberId);

        await team.save();
        res.status(200).json({message: "Kicked Successfully", team: team})
    }
    catch (error) {
        console.error("Error kick team:", error);
        return res.status(500).json({ message: "Internal server error" });   
    }
}