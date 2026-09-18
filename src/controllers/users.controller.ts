import { Request, Response } from 'express';
import { User } from '../models/user.model.js';
import { calculateAndUpdateProfileScore, calculateProfileScore } from '../helpers/scoreCalculator.js'
import { AuthRequest } from '../middlewares/auth.middleware.js';
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"


export const createUser = async (req: Request, res: Response) => {
    const { avatarIndex, name, email, password, whatsappNumber, discordUsername, codeforcesHandle, codeforcesRating,
            codeforcesRank, githubLink, linkedinLink, bio, tracks } = req.body;

    try {
        const newUser = new User({
            avatarIndex,
            name,
            email,
            password,
            whatsappNumber,
            discordUsername,
            codeforcesHandle,
            codeforcesRating,
            codeforcesRank,
            githubLink,
            linkedinLink,
            bio,
            tracks
        });

        const newScore = calculateProfileScore(newUser, 0);
        newUser.profileScore = newScore;

        await newUser.save();

        const token = jwt.sign(
            { id: newUser._id }, 
            process.env.JWT_SECRET as string, 
            { expiresIn: '30d' }
        );

        return res.status(201).json({
            message: "Created Successfully",
            token,
            user: newUser
        });

    } catch (error) {
        console.error("Error creating user:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


export const getAllUsers = async (req: Request, res: Response) => {

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    try {
        const [users, totalUsers] = await Promise.all([
            User.find().sort({ profileScore: -1 }).skip(skip).limit(limit),
            User.countDocuments()
        ]);
    
        if (users.length === 0) {
            return res.status(404).json({ message: "No users found" });
        }
        const totalPages = Math.ceil(totalUsers / limit);

        // بنرجع الداتا متغلفة صح عشان الفرونت إند يفهمها
        return res.status(200).json({
            users,
            pagination: {
                totalUsers,
                currentPage: page,
                totalPages
            }
        });
    
    }catch (error) {
        console.error("Error fetching user:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


export const getUserById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json(user);
        
    } catch (error) {
        console.error("Error fetching user:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


export const changePassword = async (req: AuthRequest, res: Response) => {
    
    const id = req.user?.id;
    const { password } = req.body;
    
    try {
        const updatedUser = await User.findByIdAndUpdate(id, { password: password }, { returnDocument: 'after' });

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        console.error("Error updating password:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


export const updateUser = async (req: AuthRequest, res: Response) => {
    const id = req.user?.id;
    const { avatarIndex, name, whatsappNumber, discordUsername, codeforcesHandle, codeforcesRating, codeforcesRank, githubLink, linkedinLink, bio, tracks } = req.body;

    try {
        const updatedUser = await User.findByIdAndUpdate(id, {
            avatarIndex,
            name,
            whatsappNumber,
            discordUsername,
            codeforcesHandle,
            codeforcesRating,
            codeforcesRank,
            githubLink,
            linkedinLink,
            bio,
            tracks
        }, { returnDocument: 'after', runValidators: true});

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        await updatedUser.save()
        calculateAndUpdateProfileScore(id as string)

        return res.status(200).json(updatedUser);
    } catch (error) {
        console.error("Error updating user:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


export const login = async (req: Request, res: Response) => {

    try {

        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({message: "Please enter email and password"})
        }

        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(400).json({message: "Email or password is incorrect"})
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
            return res.status(400).json({message: "Email or password is incorrect"})
        }

        const token = jwt.sign(
            { id: user._id }, 
            process.env.JWT_SECRET as string, 
            { expiresIn: '30d' }
        );

        user.password = ""

        return res.status(200).json({
            message: "Log in successfuly",
            token,
            user: user
        });

    }
    catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }

}