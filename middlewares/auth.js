import path from 'path';
// import { checkToken } from '../controllers/user.controller';
import jsonwebtoken from 'jsonwebtoken'

export function auth(req, res, next) {
  const __dirname = path.resolve();
  const token = req.cookies["authToken"];

  if (!token && req.originalUrl !== '/auth/signup') {
    return res.redirect('/auth/login')
  }

  jsonwebtoken.verify(token, process.env.JWT_SECRET, (err) => {
    if(err){
        console.log('ERROR: Could not connect to the protected route');
        return res.redirect('/auth/login')
    } else {
        console.log('SUCCESS: Connected to protected route');
        next();
    }
  })
}

