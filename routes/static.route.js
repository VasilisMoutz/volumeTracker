import express from 'express';
import { auth } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', (req, res) => {
  return res.redirect('/');
})

router.use(auth, express.static('public'))

export default router;