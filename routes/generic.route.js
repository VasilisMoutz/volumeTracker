import express from 'express';
import path from 'path';
import { auth } from '../middlewares/auth.js';

const router = express.Router();
const __dirname = path.resolve();

router.get('/', auth, function( req, res ) {
  res.sendFile(path.join(__dirname, '/public', 'index.html'));
});

router.get('*', (req, res) => {
  res.redirect('/');
})

export default router;