import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { getAllTeams, getTeamByID, getTeamsByLeaderId,
         createTeam, editTeam, deleteTeam, 
         applyToTeam, cancelApply, leaveTeam, 
         acceptMember, rejectMember, kickMember
        } from '../controllers/teams.controller.js'

import { mustSameUser, mustAnotherUser } from '../middlewares/auth.middleware.js'
import { teamDataValidation, editTeamDataValidation,
         applyingValidation, cancelingValidation, leaveValidation,
         acceptingValidation, rejectingValidation, kickValidation
        } from '../middlewares/teams.middleware.js'


export const teamsRouter = Router()

teamsRouter.get('/', getAllTeams)
teamsRouter.get('/:id', getTeamByID)
teamsRouter.get('/leader/:leaderId', verifyToken, getTeamsByLeaderId)


teamsRouter.post('/', verifyToken, teamDataValidation, createTeam)
teamsRouter.put('/:id', verifyToken, mustSameUser, editTeamDataValidation, editTeam)
teamsRouter.delete('/:id', verifyToken, mustSameUser, deleteTeam)


teamsRouter.patch('/:id/apply', verifyToken, mustAnotherUser, applyingValidation, applyToTeam)
teamsRouter.patch('/:id/cancel', verifyToken, mustAnotherUser, cancelingValidation, cancelApply)
teamsRouter.patch('/:id/leave', verifyToken, mustAnotherUser, leaveValidation, leaveTeam)


teamsRouter.patch('/:id/accept/:memberId', verifyToken, mustSameUser, acceptingValidation, acceptMember)
teamsRouter.patch('/:id/reject/:memberId', verifyToken, mustSameUser, rejectingValidation, rejectMember)
teamsRouter.patch('/:id/kick/:memberId', verifyToken, mustSameUser, kickValidation, kickMember)