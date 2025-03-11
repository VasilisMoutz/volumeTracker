export async function redirect(req, res, next) {
  console.log(req.cookies?.authToken)
  const token = req.cookies?.authToken;
  
  if (token) {
    return res.redirect('/');
  }
  
  next();
}