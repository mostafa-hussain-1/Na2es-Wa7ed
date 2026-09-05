import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { getAllTeams, getTeamByID, getTeamsByLeaderId, createTeam, } from '../controllers/teams.controller.js'

export const teamsRouter = Router()

teamsRouter.get('/', getAllTeams)
teamsRouter.get('/:id', getTeamByID)
teamsRouter.get('/leader/:leaderId', verifyToken, getTeamsByLeaderId)


teamsRouter.post('/', verifyToken, createTeam)
teamsRouter.put('/:id', verifyToken, )
teamsRouter.delete('/:id', verifyToken, )



teamsRouter.patch('/:id/apply', verifyToken, )
teamsRouter.patch('/:id/cancel', verifyToken, )
teamsRouter.patch('/:id/leave', verifyToken, )


teamsRouter.patch('/:id/accept', verifyToken, )
teamsRouter.patch('/:id/reject', verifyToken, )
teamsRouter.patch('/:id/kick', verifyToken, )