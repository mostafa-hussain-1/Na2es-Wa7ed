import express from 'express';
import dotenv from 'dotenv';
import {connectDB} from './config/db.js';
import {usersRouter} from './routes/users.router.js';
import { projectsRouter } from './routes/projects.router.js';
import { teamsRouter } from './routes/team.router.js';

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());

app.use('/users', usersRouter);
app.use('/projects', projectsRouter)
app.use('/teams', teamsRouter)

dotenv.config();

connectDB().then(() => {
    app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    })
})
