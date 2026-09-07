import { Request, Response, NextFunction } from "express"
import validator from "validator"
import { fetchCodeforcesData } from "../helpers/codeforces.js"



export const userDataValidation = async (req: Request, res: Response, next: NextFunction) => {

    const {
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
        } = req.body

    if (!avatarIndex || typeof avatarIndex !== 'number' || avatarIndex > 2 || avatarIndex < -1) {
        return res.status(400).json({message: "Invalid avatar index"})
    }
    
    if (!name || typeof name !== 'string' || name.trim() === '') {
        return res.status(400).json({message: "Name must be a valid string"})
    }

    if (tracks) {
        if (!Array.isArray(tracks) || !tracks.every(item => typeof item === 'string')) {
            return res.status(400).json({ message: "Tracks must be strings only" });
        }
    }

    if (!validator.isEmail(email)) {
        return res.status(400).json({ message: "Invalid Email" });
    }

    if (whatsappNumber) {
        if (!validator.isMobilePhone(whatsappNumber, 'any')) { 
            return res.status(400).json({ message: "Invalid Phone Number" });
        }
    }

    if (githubLink) {
        if (typeof githubLink !== 'string') {
            return res.status(400).json({ message: "Invalid Link" });
        }
        
        try {
            new URL(githubLink); 
        } catch (error) {
            return res.status(400).json({ message: "Invalid Link" });
        }
    }

    if (bio)
        if (typeof bio !== 'string' || bio.trim() === '') {
        return res.status(400).json({message: "Bio must be a valid string"})
    }

    if (linkedinLink) {
        if (typeof linkedinLink !== 'string') {
            return res.status(400).json({ message: "Invalid Link" });
        }
        
        try {
            new URL(linkedinLink); 
        } catch (error) {
            return res.status(400).json({ message: "Invalid Link" });
        }
    }

    if (discordUsername) {
        const discordRegex = /^[a-z0-9_.]{2,32}$/i;
        if (!discordRegex.test(discordUsername)) {
            return res.status(400).json({ message: "Invalid discord username" });
        }
    }

    if (codeforcesHandle) {
        const cfRegex = /^[a-zA-Z0-9_]{3,24}$/;
        if (!cfRegex.test(codeforcesHandle)) {
            return res.status(400).json({ message: "Invalid Handle" });
        }

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


export const userPasswordValidation = (req: Request, res: Response, next: NextFunction) => {

    const { password } = req.body;

    if (!password) {
        return res.status(400).json({ message: "كلمة المرور مطلوبة" });
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&._-])[A-Za-z\d@$!%*?&._-]{8,}$/;


    if (!passwordRegex.test(password)) {
        return res.status(400).json({ 
            message: "Week password, Password must contain at least 8 characters, capital letter, small letter, numbers, special letters" 
        });
    }

    next();
}