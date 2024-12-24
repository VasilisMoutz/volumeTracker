import path from 'path';

export function auth(req, res, next) {
  const __dirname = path.resolve();
  const authHeader = req.cookies["authToken"];
  if (!authHeader) {
    return res.redirect('/auth/login')
  }
  next();
}