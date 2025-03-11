import jwt from 'jsonwebtoken'
import { logout } from '../controllers/user.controller.js';
import NodeCache from 'node-cache';
const userCache = new NodeCache( { stdTTL: 100, checkperiod: 120 } );

export async function auth(req, res, next) {

  const token = req.cookies?.authToken;

  if (!token) {
    return res.redirect('/auth/login');
  }

  if (token) {
    const user = userCache.get(token);

    if (!user) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userCache.set(token, decoded);
      } catch (error) {
        console.log('JWT Verification failed', error);
        await logout(req, res);
      }
    }
  }

  next();
}

