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