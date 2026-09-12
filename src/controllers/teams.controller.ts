import { Request, Response } from "express";
import { Team } from "../models/team.model.js";
import { AuthRequest } from '../middlewares/auth.middleware.js'
import { User } from "../models/user.model.js";
import { calculateAndUpdateProfileScore } from "../helpers/scoreCalculator.js";

export const getAllTeams = async (req: Request, res: Response) => {

    const search = req.query.search as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    try {
        const filterQuery: any = {};
        if (search) {
            filterQuery.$or = [
                { course: { $regex: search, $options: 'i' } }
            ];
        }

        const [teams, totalTeams] = await Promise.all([
        Team.find(filterQuery)
            .populate('leaderId', 'name avatarIndex')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),
        Team.countDocuments(filterQuery)
        ]);

        const totalPages = Math.ceil(totalTeams / limit);
        if (teams.length === 0) {
            return res.status(404).json({message: "Teams not found"})
        }

        return res.status(200).json({teams, 
            pagination: {
                totalTeams,
                currentPage: page,
                totalPages,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
            }
        })
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
            .populate('leaderId', 'name bio avatarIndex')
            .populate('pendingList', 'name bio avatarIndex')
            .populate('membersList', 'name bio avatarIndex')
            .populate('blockList', 'name bio avatarIndex');
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

        await Team.updateMany(
            { course: course }, 
            { $pull: { pendingList: leaderId } }
        );

        await newTeam.save();
        
        const user: any = await User.findById(leaderId);
        if (!user) {
            return res.status(404).json({message: "user not found"})
        }
        user.acceptedCourses.addToSet(course);
        
        await user.save();
        
        calculateAndUpdateProfileScore(leaderId as string)
        
        res.status(201).json(newTeam)
    }
    catch (error) {
        console.error("Error creating team:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const editTeam = async (req: AuthRequest, res: Response) => {

    const { post, course, numOfRequiredMembers } = req.body
    const team: any = req.team

    try {
        team.post = post;
        team.course = course;

        if (numOfRequiredMembers > team.numOfRequiredMembers) {
            team.isCompleted = false;
        }

        team.numOfRequiredMembers = numOfRequiredMembers;
        await team.save();

        res.status(200).json(team)
    }
    catch (error) {
        console.error("Error edit team:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const deleteTeam = async (req: AuthRequest, res: Response) => {
    const leaderId = req.user?.id
    try {
        const team: any = req.team

        if (team.membersList && team.membersList.length > 0) {
            return res.status(400).json({ 
                message: "Cannot delete a team with active members." 
            });
        }

        await team.deleteOne();

        const user: any = await User.findById(leaderId);

        user.acceptedCourses.pull(team.course);
        await user.save();

        calculateAndUpdateProfileScore(leaderId as string)

        res.status(200).json({message: "Team deleted successfully"})
    }
    catch (error) {
        console.error("Error delete team:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const applyToTeam = async (req: AuthRequest, res: Response) => {

    const applicantId = req.user?.id
    const team: any = req.team
    try {
        
        team.pendingList.addToSet(applicantId); 

        await team.save();
        
        res.status(200).json({message: "Applied Successfully", team: team})
    }
    catch (error) {
        console.error("Error apply team:", error);
        return res.status(500).json({ message: "Internal server error", details: error });
    }
}

export const cancelApply = async (req: AuthRequest, res: Response) => {

    const applicantId = req.user?.id
    const team: any = req.team
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
    const team: any = req.team
    try {
        team.membersList.pull(applicantId); 

        const user: any = await User.findById(applicantId);
        user.acceptedCourses.pull(team.course);
        await user.save();

        if (team.membersList.length !== team.numOfRequiredMembers) {
            team.isCompleted = false
        }

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
    const team: any = req.team
    try {
        team.membersList.addToSet(memberId);

        team.pendingList.pull(memberId);

        if (team.membersList.length === team.numOfRequiredMembers) {
            team.isCompleted = true
        }
        await team.save();

        const user: any = await User.findById(memberId)
        user.acceptedCourses.addToSet(team.course)
        await user.save();

        calculateAndUpdateProfileScore(memberId as string)

        res.status(200).json({message: "Accept Successfully", team: team})
    }
    catch (error) {
        console.error("Error accept team:", error);
        return res.status(500).json({ message: "Internal server error" });   
    }
}

export const rejectMember = async (req: AuthRequest, res: Response) => {

    const { memberId } = req.params;
    const team: any = req.team
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
    const team: any = req.team
    try {
        team.membersList.pull(memberId);
        
        team.blockList.addToSet(memberId);

        if (team.membersList.length !== team.numOfRequiredMembers) {
            team.isCompleted = false
        }
        await team.save();

        const user: any = await User.findById(memberId);
        user.acceptedCourses.pull(team.course);
        await user.save();

        calculateAndUpdateProfileScore(memberId as string)

        res.status(200).json({message: "Kicked Successfully", team: team})
    }
    catch (error) {
        console.error("Error kick team:", error);
        return res.status(500).json({ message: "Internal server error" });   
    }
}