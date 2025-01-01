import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { auth } from './middlewares/auth.js';
import cookieParser from 'cookie-parser';

// routing imports
import generic from './routes/generic.route.js';
import users from './routes/user.route.js'
import staticFiles from './routes/static.route.js'

dotenv.config();
const app = express();
const uri = process.env.DB_URI;

try {
  mongoose.connect(uri);
} catch (err) {
  console.log(err);
}

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

//Load files && prevent user from direct url access to them.
app.use('/static', staticFiles);

// Only access authentication routes if not logged in
app.use('/auth/login', express.static('public/auth'));
app.use('/api', users);

// Authenticated users can access the rest of the page
app.use(generic);


let PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})