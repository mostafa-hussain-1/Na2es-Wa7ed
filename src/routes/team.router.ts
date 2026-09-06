import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { getAllTeams, getTeamByID, getTeamsByLeaderId,
         createTeam, editTeam, deleteTeam, 
         applyToTeam, cancelApply, leaveTeam, 
         acceptMember, rejectMember, kickMember} from '../controllers/teams.controller.js'

export const teamsRouter = Router()

teamsRouter.get('/', getAllTeams)
teamsRouter.get('/:id', getTeamByID)
teamsRouter.get('/leader/:leaderId', verifyToken, getTeamsByLeaderId)


teamsRouter.post('/', verifyToken, createTeam)
teamsRouter.put('/:id', verifyToken, editTeam)
teamsRouter.delete('/:id', verifyToken, deleteTeam)



teamsRouter.patch('/:id/apply', verifyToken, applyToTeam)
teamsRouter.patch('/:id/cancel', verifyToken, cancelApply)
teamsRouter.patch('/:id/leave', verifyToken, leaveTeam)


teamsRouter.patch('/:id/accept/:memberId', verifyToken, acceptMember)
teamsRouter.patch('/:id/reject/:memberId', verifyToken, rejectMember)
teamsRouter.patch('/:id/kick/:memberId', verifyToken, kickMember)