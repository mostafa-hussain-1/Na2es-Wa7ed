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

/**
 * @openapi
 * tags:
 *   name: Teams
 *   description: Team creation, management, and membership operations
 */

/**
 * @openapi
 * /teams:
 *   get:
 *     summary: Get all teams
 *     tags: [Teams]
 *     responses:
 *       200:
 *         description: List of all teams
 *       500:
 *         description: Server error
 */
teamsRouter.get('/', getAllTeams);

/**
 * @openapi
 * /teams/{id}:
 *   get:
 *     summary: Get a team by ID
 *     tags: [Teams]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The team ID
 *     responses:
 *       200:
 *         description: Team found successfully
 *       404:
 *         description: Team not found
 *       500:
 *         description: Server error
 */
teamsRouter.get('/:id', getTeamByID);

/**
 * @openapi
 * /teams/leader/{leaderId}:
 *   get:
 *     summary: Get all teams created by a specific leader
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: leaderId
 *         required: true
 *         schema:
 *           type: string
 *         description: The leader's user ID
 *     responses:
 *       200:
 *         description: List of leader's teams
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Leader or teams not found
 *       500:
 *         description: Server error
 */
teamsRouter.get('/leader/:leaderId', verifyToken, getTeamsByLeaderId);

/**
 * @openapi
 * /teams:
 *   post:
 *     summary: Create a new team
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - post
 *               - course
 *               - numOfRequiredMembers
 *             properties:
 *               post:
 *                 type: string
 *               course:
 *                 type: string
 *               numOfRequiredMembers:
 *                 type: number
 *     responses:
 *       201:
 *         description: Team created successfully
 *       400:
 *         description: Validation error or Duplicate course team
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
teamsRouter.post('/', verifyToken, preventDuplicateCourseTeam, teamDataValidation, createTeam);

/**
 * @openapi
 * /teams/{id}:
 *   put:
 *     summary: Edit team details
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               post:
 *                 type: string
 *               course:
 *                 type: string
 *               numOfRequiredMembers:
 *                 type: number
 *               isCompleted:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Team updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Not the leader)
 *       404:
 *         description: Team not found
 *       500:
 *         description: Server error
 */
teamsRouter.put('/:id', verifyToken, verifyOwnership(Team, 'leaderId', 'team', true), editTeamDataValidation, editTeam);

/**
 * @openapi
 * /teams/{id}:
 *   delete:
 *     summary: Delete a team
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Team deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Not the leader)
 *       404:
 *         description: Team not found
 *       500:
 *         description: Server error
 */
teamsRouter.delete('/:id', verifyToken, verifyOwnership(Team, 'leaderId', 'team', true), deleteTeam);

/**
 * @openapi
 * /teams/{id}/apply:
 *   patch:
 *     summary: Apply to join a team
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Applied successfully
 *       400:
 *         description: Validation error or Already applied/in team
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Leader cannot apply to their own team)
 *       404:
 *         description: Team not found
 *       500:
 *         description: Server error
 */
teamsRouter.patch('/:id/apply', verifyToken, verifyOwnership(Team, 'leaderId', 'team', false), preventDuplicateCourseTeam, applyingValidation, applyToTeam);

/**
 * @openapi
 * /teams/{id}/cancel:
 *   patch:
 *     summary: Cancel application to a team
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Application cancelled successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Team not found
 *       500:
 *         description: Server error
 */
teamsRouter.patch('/:id/cancel', verifyToken, verifyOwnership(Team, 'leaderId', 'team', false), cancelingValidation, cancelApply);

/**
 * @openapi
 * /teams/{id}/leave:
 *   patch:
 *     summary: Leave a team
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Left team successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Team not found
 *       500:
 *         description: Server error
 */
teamsRouter.patch('/:id/leave', verifyToken, verifyOwnership(Team, 'leaderId', 'team', false), leaveValidation, leaveTeam);

/**
 * @openapi
 * /teams/{id}/accept/{memberId}:
 *   patch:
 *     summary: Accept a member into the team
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The team ID
 *       - in: path
 *         name: memberId
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID to accept
 *     responses:
 *       200:
 *         description: Member accepted successfully
 *       400:
 *         description: Validation error or Team is full
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Only leader can accept)
 *       404:
 *         description: Team or User not found
 *       500:
 *         description: Server error
 */
teamsRouter.patch('/:id/accept/:memberId', verifyToken, verifyOwnership(Team, 'leaderId', 'team', true), acceptingValidation, acceptMember);

/**
 * @openapi
 * /teams/{id}/reject/{memberId}:
 *   patch:
 *     summary: Reject a member's application
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: memberId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Member rejected successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Only leader can reject)
 *       404:
 *         description: Team or User not found
 *       500:
 *         description: Server error
 */
teamsRouter.patch('/:id/reject/:memberId', verifyToken, verifyOwnership(Team, 'leaderId', 'team', true), rejectingValidation, rejectMember);

/**
 * @openapi
 * /teams/{id}/kick/{memberId}:
 *   patch:
 *     summary: Kick a member out of the team
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: memberId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Member kicked successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Only leader can kick)
 *       404:
 *         description: Team or User not found
 *       500:
 *         description: Server error
 */
teamsRouter.patch('/:id/kick/:memberId', verifyToken, verifyOwnership(Team, 'leaderId', 'team', true), kickValidation, kickMember);