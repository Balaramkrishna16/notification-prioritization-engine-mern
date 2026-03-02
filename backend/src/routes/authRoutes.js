import express from 'express';
const router = express.Router();

// This MUST match the path: /api/auth/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  // Using the credentials from your index.js
  if (email === "admin@cyepro.com" && password === "password123") {
    return res.json({ 
      token: "secure_mock_token_2026", 
      message: "Login Successful" 
    });
  }

  return res.status(401).json({ message: "Invalid Credentials" });
});

export default router;