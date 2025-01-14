import jwt from 'jsonwebtoken'
import { logout } from '../controllers/user.controller.js';

export async function auth(req, res, next) {
  const token = req.cookies["authToken"];

  if (!token && req.originalUrl !== '/auth/signup') {
    return res.redirect('/auth/login');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token Verified: ', decoded);
  } catch (error) {
    console.log('JWT Verification failed', error);
    await logout(req, res);
  }

  next()
  
}

