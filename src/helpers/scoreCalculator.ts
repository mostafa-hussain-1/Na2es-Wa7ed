import { Project } from "../models/project.model.js";
import { User } from "../models/user.model.js";


export const calculateProfileScore = (user: any, projectsCount: number): number => {

    let score: number = 0

    if (user.tracks && user.tracks.length > 0) {
        score += user.tracks.length * 10;
    }

    if (user.githubLink) score += 10;
    if (user.linkedinLink) score += 10;
    if (user.codeforcesHandle) score += 10;
    if (user.bio) score += 10;
    if (user.discordUsername) score += 10;

    score += (projectsCount * 20);

    if (user.acceptedCourses && user.acceptedCourses.length > 0) {
        score += (user.acceptedCourses.length * 50); 
    }

    return score
}

export const calculateAndUpdateProfileScore = async (id: string) => {

    const user: any = await User.findById(id)
    const projectsCount = await Project.countDocuments({ ownerId: id});
    const newScore = calculateProfileScore(user, projectsCount);
    user.profileScore = newScore;
    await user.save()
}