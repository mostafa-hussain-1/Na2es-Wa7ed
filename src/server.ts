import express from 'express';
import dotenv from 'dotenv';
import {connectDB} from './config/db.js';
import {usersRouter} from './routes/users.router.js';
import { projectsRouter } from './routes/projects.router.js';
import { teamsRouter } from './routes/team.router.js';
import { scheduleCodeforcesUpdate } from './helpers/codeforces.js'
import { setupSwagger } from './config/swagger.js';

export const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());

app.use('/users', usersRouter);
app.use('/projects', projectsRouter)
app.use('/teams', teamsRouter)

dotenv.config();

setupSwagger(app);

connectDB().then(() => {
    scheduleCodeforcesUpdate();
    app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    })
})
