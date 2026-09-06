import { Request, Response, NextFunction} from 'express'

export const validateProjectInfo = (req: Request, res: Response, next: NextFunction) => {

    const { title, description, githubLink, demoLink } = req.body

    if (!title || typeof title !== 'string' || title.trim() === '') {
        return res.status(400).json({message: "Title must be a valid string"})
    }

    if (!description || typeof description !== 'string' || description.trim() === '') {
        return res.status(400).json({message: "Description must be a valid string"})
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

    if (demoLink) {
        if (typeof demoLink !== 'string') {
            return res.status(400).json({ message: "Invalid Link" });
        }
        
        try {
            new URL(demoLink); 
        } catch (error) {
            return res.status(400).json({ message: "Invalid Link" });
        }
    }

    next();
}