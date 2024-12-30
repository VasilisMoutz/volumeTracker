import express from 'express';
import path from 'path';
import { auth } from '../middlewares/auth.js';

const router = express.Router();
const __dirname = path.resolve();


router.get("*", auth, (req, res) => {
  res.redirect('/home');
})

export default router;