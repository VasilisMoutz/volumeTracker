import express from 'express';

const router = express.Router();

router.use('/login', express.static('public/auth/login'));
router.use('/signup', express.static('public/auth/signup'));

export default router;
