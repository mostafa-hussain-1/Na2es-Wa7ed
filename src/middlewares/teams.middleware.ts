import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware.js";
import { User } from "../models/user.model.js";
import { Team } from "../models/team.model.js";

export const teamDataValidation = async (req: AuthRequest, res: Response, next: NextFunction) => {

    const { post, numOfRequiredMembers } = req.body

    if (numOfRequiredMembers < 1 || typeof numOfRequiredMembers != 'number') {
        return res.status(400).json({message: "Number of required members must be positive number"})
    }

    if (post === '' || typeof post !== 'string') {
        return res.status(400).json({message: "Post must be a string"})
    }


    try {
        const leaderId = req.user?.id as string
        const {course} = req.body

        const existingTeam = await Team.findOne({ leaderId, course });

        if (existingTeam) {
            return res.status(400).json({ message: "You 're creating team for this course before" });
        }
    } 
    catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }

    next()
}


export const editTeamDataValidation = (req: AuthRequest, res: Response, next: NextFunction) => {

    const { post, course, numOfRequiredMembers } = req.body

    const team: any = req.team

    if (course !== team.course) {

        if (team?.membersList.length > 0) {
            return res.status(400).json({message: "Must Kick Current Members"})
        }
        team.pendingList = []
        team.blockList = []
    }
    if (numOfRequiredMembers !== team.numOfRequiredMembers) {
        if (numOfRequiredMembers < 1 || typeof numOfRequiredMembers != 'number' || numOfRequiredMembers < team.memberList.length) {
            return res.status(400).json({message: "Number of required members must be positive number and greater than or equal num of members"})
        }
    }

    if (post !== team.post) {
        if (post === '' || typeof post !== 'string') {
            return res.status(400).json({message: "Post must be a string"})
        }
    }
    next()
}

export const applyingValidation = async (req: AuthRequest, res: Response, next: NextFunction) => {

    const applicantID = req.user?.id

    const team = req.team
     if (!team) {
        return res.status(404).json({message: "Team not found"})
    }

    if (team.membersList.includes(applicantID as any) || 
        team.pendingList.includes(applicantID as any) ||
        team.blockList.includes(applicantID as any)) {

            return res.status(400).json({message: "User already exist"})
    }

    const user: any = await User.findById(applicantID)
    if (user.acceptedCourses.includes(team.course)) {
        return res.status(400).json({message: "User already exist in another team"})
    }

    next()
}

export const cancelingValidation = (req: AuthRequest, res: Response, next: NextFunction) => {
    const applicantID = req.user?.id

    const team = req.team
    if (!team) {
        return res.status(404).json({message: "Team not found"})
    }

    if (!team.pendingList.includes(applicantID as any) ) {

        return res.status(400).json({message: "User doesn't exist"})
    }

    next()
}

export const leaveValidation = (req: AuthRequest, res: Response, next: NextFunction) => {
    const applicantID = req.user?.id

    const team = req.team

    if (!team) {
        return res.status(404).json({message: "Team not found"})
    }

    if (!team.membersList.includes(applicantID as any) ) {

        return res.status(400).json({message: "User doesn't exist"})
    }

    if (team.leaderId.toString() === applicantID) {
        return res.status(400).json({message: "Team leader can't leave the team"});
    }

    next()
}

export const acceptingValidation = (req: AuthRequest, res: Response, next: NextFunction) => {
    const applicantID = req.user?.id

    const team = req.team

    if (!team) {
        return res.status(404).json({message: "Team not found"})
    }

    if (team.membersList.includes(applicantID as any) || 
        !team.pendingList.includes(applicantID as any)) {

            return res.status(400).json({message: "User already exist"})
    }

    if (team.numOfRequiredMembers === team.membersList.length){
        return res.status(400).json({message: "Member List is Fully Completed"})
    }

    next()
}

export const rejectingValidation = (req: AuthRequest, res: Response, next: NextFunction) => {
    const applicantID = req.user?.id

    const team = req.team


    if (!team) {
        return res.status(404).json({message: "Team not found"})
    }

    if (!team.pendingList.includes(applicantID as any)) {

        return res.status(400).json({message: "User already exist"})
    }

    next()
}

export const kickValidation = (req: AuthRequest, res: Response, next: NextFunction) => {
    const applicantID = req.user?.id

    const team = req.team

    if (!team) {
        return res.status(404).json({message: "Team not found"})
    }

    if (!team.membersList.includes(applicantID as any)) {

        return res.status(400).json({message: "User already exist"})
    }
    next()
}
