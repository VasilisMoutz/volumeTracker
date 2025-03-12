export async function redirect(req, res, next) {
  const token = req.cookies?.authToken;
  
  if (token) {
    return res.redirect('/');
  }
  
  next();
}