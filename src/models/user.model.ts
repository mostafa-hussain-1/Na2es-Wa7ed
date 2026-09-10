import { Schema, model } from "mongoose";

function arrayLimit(val: string[]) {
    return val.length <= 7;
};


export const User = model("User", new Schema({
    avatarIndex: {
        type: Number,
        required: true,
        
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    whatsappNumber: {
        type: String,
        required: true,
    },
    discordUsername: {
        type: String,
        required: false,
    },
    codeforcesHandle: {
        type: String,
        required: false,
    },
    codeforcesRating: {
        type: Number,
        required: false
    },
    codeforcesRank: {
        type: String,
        required: false
    },
    githubLink: {
        type: String,
        required: false,
    },
    linkedinLink: {
        type: String,
        required: false,
    },
    bio: {
        type: String,
        required: false,
    },
    tracks: {
        type: [String],
        required: false,
        validate: [arrayLimit, 'Max length is 7']
    },
    profileScore: {
        type: Number,
        default: 0,
    },
    acceptedCourses: { 
        type: [String], 
        default: [] 
    },
}))