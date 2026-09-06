import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { getAllTeams, getTeamByID, getTeamsByLeaderId,
         createTeam, editTeam, deleteTeam, 
         applyToTeam, cancelApply, leaveTeam, 
         acceptMember, rejectMember, kickMember} from '../controllers/teams.controller.js'

import { mustSameUser, mustAnotherUser } from '../middlewares/auth.middleware.js'


export const teamsRouter = Router()

teamsRouter.get('/', getAllTeams)
teamsRouter.get('/:id', getTeamByID)
teamsRouter.get('/leader/:leaderId', verifyToken, getTeamsByLeaderId)


teamsRouter.post('/', verifyToken, createTeam)
teamsRouter.put('/:id', verifyToken, mustSameUser, editTeam)
teamsRouter.delete('/:id', verifyToken, mustSameUser, deleteTeam)



teamsRouter.patch('/:id/apply', verifyToken, mustAnotherUser, applyToTeam)
teamsRouter.patch('/:id/cancel', verifyToken, mustAnotherUser, cancelApply)
teamsRouter.patch('/:id/leave', verifyToken, mustAnotherUser, leaveTeam)


teamsRouter.patch('/:id/accept/:memberId', verifyToken, mustSameUser, acceptMember)
teamsRouter.patch('/:id/reject/:memberId', verifyToken, mustSameUser, rejectMember)
teamsRouter.patch('/:id/kick/:memberId', verifyToken, mustSameUser, kickMember)