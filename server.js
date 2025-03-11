import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { scheduleProjectsJob } from './jobs/processProjectsVolume.js'
import { auth } from './middlewares/auth.js';
import users from './routes/user.route.js'
import projects from './routes/project.route.js'
import { redirect } from './middlewares/redirect.js';

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

app.use('/api', users);
app.use('/api', projects);
app.use('/auth', redirect, express.static('public/auth'))
app.use(auth, express.static('public/main'));
app.get('*', auth, (req, res) => {
  res.redirect('/');
})


scheduleProjectsJob()

let PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => { 
  console.log(`Server is running on port ${PORT}`);
});