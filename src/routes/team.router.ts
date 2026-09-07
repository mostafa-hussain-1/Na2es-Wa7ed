import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { getAllTeams, getTeamByID, getTeamsByLeaderId,
         createTeam, editTeam, deleteTeam, 
         applyToTeam, cancelApply, leaveTeam, 
         acceptMember, rejectMember, kickMember
        } from '../controllers/teams.controller.js'

import { verifyOwnership } from '../middlewares/auth.middleware.js'
import { teamDataValidation, preventDuplicateCourseTeam, editTeamDataValidation,
         applyingValidation, cancelingValidation, leaveValidation,
         acceptingValidation, rejectingValidation, kickValidation
        } from '../middlewares/teams.middleware.js'

import { Team } from "../models/team.model.js";


export const teamsRouter = Router()

teamsRouter.get('/', getAllTeams)
teamsRouter.get('/:id', getTeamByID)
teamsRouter.get('/leader/:leaderId', verifyToken, getTeamsByLeaderId)


teamsRouter.post('/', verifyToken, preventDuplicateCourseTeam, teamDataValidation, createTeam)
teamsRouter.put('/:id', verifyToken, verifyOwnership(Team, 'leaderId', 'team', true), editTeamDataValidation, editTeam)
teamsRouter.delete('/:id', verifyToken, verifyOwnership(Team, 'leaderId', 'team', true), deleteTeam)


teamsRouter.patch('/:id/apply', verifyToken, verifyOwnership(Team, 'leaderId', 'team', false), preventDuplicateCourseTeam, applyingValidation, applyToTeam)
teamsRouter.patch('/:id/cancel', verifyToken, verifyOwnership(Team, 'leaderId', 'team', false), cancelingValidation, cancelApply)
teamsRouter.patch('/:id/leave', verifyToken, verifyOwnership(Team, 'leaderId', 'team', false), leaveValidation, leaveTeam)


teamsRouter.patch('/:id/accept/:memberId', verifyToken, verifyOwnership(Team, 'leaderId', 'team', true), acceptingValidation, acceptMember)
teamsRouter.patch('/:id/reject/:memberId', verifyToken, verifyOwnership(Team, 'leaderId', 'team', true), rejectingValidation, rejectMember)
teamsRouter.patch('/:id/kick/:memberId', verifyToken, verifyOwnership(Team, 'leaderId', 'team', true), kickValidation, kickMember)