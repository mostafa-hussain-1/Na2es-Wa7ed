import { Request, Response, NextFunction } from "express"
import validator from "validator"
import { fetchCodeforcesData } from "../helpers/codeforces.js"
import bcrypt from "bcrypt"
import { User } from "../models/user.model.js"
import { AuthRequest } from "./auth.middleware.js"


export const userDataValidation = async (req: Request, res: Response, next: NextFunction) => {

    const {
            avatarIndex,
            name,
            whatsappNumber,
            discordUsername,
            codeforcesHandle,
            githubLink,
            linkedinLink,
            bio,
            tracks
        } = req.body

    if (typeof avatarIndex !== 'number' || avatarIndex > 2 || avatarIndex <= -1) {
        return res.status(400).json({message: "Invalid avatar index"})
    }
    
    if (!name || typeof name !== 'string' || name.trim() === '') {
        return res.status(400).json({message: "Name must be a valid string"})
    }

    if (tracks) {
        if (!Array.isArray(tracks) || !tracks.every(item => typeof item === 'string' && item !== '')) {
            return res.status(400).json({ message: "Tracks must be strings only" });
        }
    }

    if (!whatsappNumber) {
        return res.status(400).json({ message: "Enter Whatsapp Number" });
    }

    if (whatsappNumber) {
        if (!validator.isMobilePhone(whatsappNumber, 'any')) {
            return res.status(400).json({ message: "Invalid Phone Number" });
        }
    }

    if (githubLink) {
        if (typeof githubLink !== 'string') {
            return res.status(400).json({ message: "Invalid Github Link format" });
        }
        
        try {
            const urlObj = new URL(githubLink); 
           
            if (urlObj.protocol !== 'https:' && urlObj.protocol !== 'http:') {
                return res.status(400).json({ message: "Github link must start with https://" });
            }
            if (!urlObj.hostname.includes('github.com')) {
                return res.status(400).json({ message: "Link must be a valid github.com domain" });
            }
        } catch (error) {
            return res.status(400).json({ message: "Invalid Github Link structure" });
        }
    }

    if (bio)
        if (typeof bio !== 'string' || bio.trim() === '') {
        return res.status(400).json({message: "Bio must be a valid string"})
    }

    if (linkedinLink) {
        if (typeof linkedinLink !== 'string') {
            return res.status(400).json({ message: "Invalid Linkedin Link format" });
        }
        
        try {
            const urlObj = new URL(linkedinLink); 
            if (urlObj.protocol !== 'https:' && urlObj.protocol !== 'http:') {
                return res.status(400).json({ message: "Linkedin link must start with or https://" });
            }
            if (!urlObj.hostname.includes('linkedin.com')) {
                return res.status(400).json({ message: "Link must be a valid linkedin.com domain" });
            }
        } catch (error) {
            return res.status(400).json({ message: "Invalid Linkedin Link structure" });
        }
    }

    if (discordUsername) {
        const discordRegex = /^[a-z0-9_.]{2,32}$/i;
        if (!discordRegex.test(discordUsername)) {
            return res.status(400).json({ message: "Invalid discord username" });
        }
    }

    if (codeforcesHandle) {
        const cfData = await fetchCodeforcesData(codeforcesHandle);
        
        if (!cfData.isValid) {
            return res.status(400).json({ message: cfData.message });
        }

        req.body.codeforcesHandle = codeforcesHandle;
        req.body.codeforcesRating = cfData.rating;
        req.body.codeforcesRank = cfData.rank;
    }

    next()
}

export const userEmailValidation = async (req: Request, res: Response, next: NextFunction) => {

    const { email } = req.body;

    if (!email) {
        res.status(400).json({message: "Enter your email"})
    }

    const isExist = await User.exists({email})

    if (isExist) {
        return res.status(400).json({ message: "This Email is already exist. Try Sign in" });
    }

    if (!validator.isEmail(email)) {
        return res.status(400).json({ message: "Invalid Email" });
    }
}

export const userPasswordValidation = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { password } = req.body

    if (!password) {
        return res.status(400).json({ message: "Password is required" });
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&._-])[A-Za-z\d@$!%*?&._-]{8,}$/;

    if (!passwordRegex.test(password)) {
        return res.status(400).json({ 
            message: "Week password, Password must contain at least 8 characters, capital letter, small letter, numbers, special letters" 
        });
    }

    try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(password, salt);
    } catch (error) {
        return res.status(500).json({message: "Internal Server Error"})
    }

    next();
}

export const isCorrectPassword = async (req: AuthRequest, res: Response, next: NextFunction) => {

    let { oldPassword } = req.body;
    const id = req.user?.id
    
    const user: any = await User.findById(id)
    
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password)
    
    if (!isPasswordValid) {
        return res.status(400).json({message: "Old password is incorrect"})
    }

    next()
}
