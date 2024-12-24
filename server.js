import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import path from 'path';
import { auth } from './middlewares/auth.js';
import cookieParser from 'cookie-parser';

// routing imports
import generic from './routes/generic.route.js';
import users from './routes/user.route.js'


 
dotenv.config();
const app = express();
const jsonParser = bodyParser.json();
const uri = process.env.DB_URI;
const __dirname = path.resolve();
const router = express.Router();

try {
  mongoose.connect(uri);
} catch (err) {
  console.log(err);
}

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use('/auth/login', express.static('public/auth'));
app.use('/api', users);
app.use(auth);
app.use(express.static('public'))
app.use('/app', generic);


let PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})