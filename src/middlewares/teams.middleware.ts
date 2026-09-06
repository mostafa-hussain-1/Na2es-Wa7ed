import { Request, Response, NextFunction } from "express";


export const teamDataValidation = (req: Request, res: Response, next: NextFunction) => {

    const { post, course, numOfRequiredMembers } = req.body


}


export const editTeamDataValidation = (req: Request, res: Response, next: NextFunction) => {

    const { post, course, numOfRequiredMembers } = req.body


}

export const applyingValidation = () => {

}

export const cancelingValidation = () => {
    
}

export const leaveValidation = () => {
    
}

export const acceptingValidation = () => {
    
}

export const rejectingValidation = () => {
    
}

export const kickValidation = () => {
    
}
