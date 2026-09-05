import { Schema, model } from "mongoose"

export const Team = model("Team", new Schema({
    leaderId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    post: {
        type: String,
        required: true,
    },
    course: {
        type: String,
        required: true,
    },
    pendingList: [{
        type: Schema.Types.ObjectId, 
        ref: 'User' 
    }],
    membersList: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'User' 
    }],
    blockList: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'User' 
    }],
    isCompleted: {
        type: Boolean,
        default: false,
    },
    numOfRequiredMembers: {
        type: Number,
        required: true,
    }
}, {timestamps: true}))
