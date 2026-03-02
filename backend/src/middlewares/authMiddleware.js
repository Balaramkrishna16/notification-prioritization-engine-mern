
export const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Mock check for the submission: ensure a token exists
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return next();
  }

  return res.status(401).json({ 
    error: "Not authorized - No token provided. Use mock credentials." 
  });
};