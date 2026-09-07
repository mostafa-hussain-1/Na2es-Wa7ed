import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware.js";
import { Team } from "../models/team.model.js";

export const teamDataValidation = (req: Request, res: Response, next: NextFunction) => {

    const { post, numOfRequiredMembers } = req.body

    if (numOfRequiredMembers < 1 || typeof numOfRequiredMembers != 'number') {
        return res.status(400).json({message: "Number of required members must be positive number"})
    }

    if (post === '' || typeof post !== 'string') {
        return res.status(400).json({message: "Post must be a string"})
    }

    next()
}

export const preventDuplicateCourseTeam = async (req: AuthRequest, res: Response, next: NextFunction) => {

    try {
        const userId = req.user?.id as string
        let {course} = req.body

        if (!course) {
            const teamId = req.params.id;
            const targetTeam = await Team.findById(teamId);
            
            if (!targetTeam) {
                return res.status(404).json({ message: "Team not found" });
            }
            
            course = targetTeam.course; 
        }

        const existingTeam = await Team.findOne({ 
            course: course,
            $or: [
                { leaderId: userId },
                { membersList: userId } 
            ]
        });

        if (existingTeam) {
            return res.status(400).json({ message: "You 're leader or member in another team for this course before" });
        }
        next()
    } 
    catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
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
        if (numOfRequiredMembers < 1 || typeof numOfRequiredMembers != 'number' || numOfRequiredMembers < team.membersList.length) {
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

    if (team.membersList.includes(applicantID as any)) {

        return res.status(400).json({message: "User already exist"})
    }

    if (team.pendingList.includes(applicantID as any)) {
        return res.status(400).json({message: "User already applied"})
    }

    if (team.blockList.includes(applicantID as any)) {
        return res.status(400).json({message: "User has been blocked"})
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
    const {memberId} = req.params

    const team = req.team

    if (!team) {
        return res.status(404).json({message: "Team not found"})
    }

    if (team.membersList.includes(memberId as any)) {

        return res.status(400).json({message: "User already exist"})
    }

    if (!team.pendingList.includes(memberId as any)) {
        return res.status(404).json({message: "User not found"})
    }

    if (team.numOfRequiredMembers === team.membersList.length){
        return res.status(400).json({message: "Member List is Fully Completed"})
    }

    next()
}

export const rejectingValidation = (req: AuthRequest, res: Response, next: NextFunction) => {
    const {memberId} = req.params

    const team = req.team


    if (!team) {
        return res.status(404).json({message: "Team not found"})
    }

    if (!team.pendingList.includes(memberId as any)) {

        return res.status(404).json({message: "User not found"})
    }

    next()
}

export const kickValidation = (req: AuthRequest, res: Response, next: NextFunction) => {
    const {memberId} = req.params

    const team = req.team

    if (!team) {
        return res.status(404).json({message: "Team not found"})
    }

    if (!team.membersList.includes(memberId as any)) {

        return res.status(404).json({message: "User not found"})
    }
    next()
}
