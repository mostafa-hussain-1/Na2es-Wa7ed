import {User} from '../models/user.model.js'
import {Project} from '../models/project.model.js'


export const calculateAndUpdateProfileScore = async (userId: string)=>{

    try {
        const user = await User.findById(userId)

        if (!user) return

        let score = 0

        if (user.tracks && user.tracks.length > 0) {
            score += user.tracks.length * 1;
        }

        if (user.githubLink) score += 1;
        if (user.linkedinLink) score += 1;
        if (user.codeforcesHandle) score += 1;
        if (user.bio) score += 1;

        const projectsCount = await Project.countDocuments({ ownerId: userId });
        score += (projectsCount * 2);

        await User.findByIdAndUpdate(userId, { profileScore: score })
    }
    catch (error) {
        console.error("Error calculating profile score:", error);
    }
}