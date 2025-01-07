import jwt from 'jsonwebtoken'
import { logout } from '../controllers/user.controller.js';

export function auth(req, res, next) {
  const token = req.cookies["authToken"];

  if (!token && req.originalUrl !== '/auth/signup') {
    return res.redirect('/auth/login');
  }

  jwt.verify(token, process.env.JWT_SECRET, async function(err, decoded) {
    if (err) {
      await logout(req, res);
      return res.redirect('/auth/login');
    }
    next(); 
  }); 
}

