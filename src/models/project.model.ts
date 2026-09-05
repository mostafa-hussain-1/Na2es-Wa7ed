import { model, Schema } from "mongoose";


export const Project = model("Project", new Schema({
    ownerId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    githubLink: {
        type: String,
        required: true,
    },
    demoLink: {
        type: String,
        required: false,
    },
}))