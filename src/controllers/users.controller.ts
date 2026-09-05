import { Request, Response } from 'express';
import { User } from '../models/user.model.js';
import { calculateAndUpdateProfileScore } from '../helpers/scoreCalculator.js'
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"


export const createUser = async (req: Request, res: Response) => {
    const { avatarIndex, name, email, password, whatsappNumber, discordUsername, codeforcesHandle, githubLink, linkedinLink, bio, tracks } = req.body;

    try {
        const newUser = new User({
            avatarIndex,
            name,
            email,
            password,
            whatsappNumber,
            discordUsername,
            codeforcesHandle,
            githubLink,
            linkedinLink,
            bio,
            tracks
        });

        await newUser.save();

        const token = jwt.sign(
            { id: newUser._id }, 
            process.env.JWT_SECRET as string, 
            { expiresIn: '30d' }
        );

        return res.status(200).json({
            message: "Log in successfuly",
            token,
            user: newUser
        });

    } catch (error) {
        console.error("Error creating user:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


export const getAllUsers = async (req: Request, res: Response) => {

    try {
        const users = await User.find();
    
        if (users.length === 0) {
            return res.status(404).json({ message: "No users found" });
        }
        return res.status(200).json(users);
    
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


export const changePassword = async (req: Request, res: Response) => {
    
    const { id } = req.params;
    const { password } = req.body;
    
    try {
        const updatedUser = await User.findByIdAndUpdate(id, { password: password }, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        console.error("Error updating password:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


export const updateUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { avatarIndex, name, email, whatsappNumber, discordUsername, codeforcesHandle, githubLink, linkedinLink, bio, tracks } = req.body;

    try {
        const updatedUser = await User.findByIdAndUpdate(id, {
            avatarIndex,
            name,
            email,
            whatsappNumber,
            discordUsername,
            codeforcesHandle,
            githubLink,
            linkedinLink,
            bio,
            tracks
        }, { new: true, runValidators: true});

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        await calculateAndUpdateProfileScore(id as string);

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

        const user = await User.findOne({ email })

        if (!user) {
            return res.status(404).json({message: "Email or password is incorrect"})
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