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

//Load files && prevent user from direct url access to them.
app.get('/static', (req, res) => {
  return res.redirect('/');
})
app.use('/static', auth, express.static('public'))

// Only access authentication routes if not logged in
app.use('/auth/login', express.static('public/auth'));
app.use('/api', users);

// Authenticated users can access the rest of the page
app.get('/', auth, function(req,res) {
  console.log(JSON.parse((req.cookies["userDetails"])));
  res.sendFile(path.join(__dirname, '/public', 'index.html'));
});


let PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})