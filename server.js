import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { scheduleProjectsJob } from './jobs/processProjectsVolume.js'

import generic from './routes/generic.route.js';
import users from './routes/user.route.js'
import projects from './routes/project.route.js'
import staticFiles from './routes/static.route.js'
import authPages from './routes/authPages.route.js'


const app = express();
const uri = process.env.DB_URI;

try {
  mongoose.connect(uri);
  console.log('successfull connection to database')
} catch (err) {
  console.log(err);
}

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

app.use('/api', projects);
app.use('/static', staticFiles);
app.use('/auth', authPages);
app.use('/api', users);
app.use(generic);

scheduleProjectsJob()

let PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})