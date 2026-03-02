import jwt from 'jsonwebtoken';

const ADMIN_EMAIL = "admin@cyepro.com";
const ADMIN_PASSWORD = "password123"; // Direct string for demo reliability

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validate Email
    if (email !== ADMIN_EMAIL) {
      return res.status(401).json({ 
        success: false, 
        message: "Access Denied: Invalid Credentials" 
      });
    }

    // 2. Validate Password (Direct Match)
    if (password !== ADMIN_PASSWORD) {
      return res.status(401).json({ 
        success: false, 
        message: "Access Denied: Invalid Credentials" 
      });
    }

    // 3. Generate Secure JWT
    const token = jwt.sign(
      { email: ADMIN_EMAIL, role: 'admin' },
      process.env.JWT_SECRET || 'cyepro_secret_2026',
      { expiresIn: '24h' }
    );

    // 4. Send Success Response
    res.json({
      success: true,
      token,
      message: "Authentication Successful"
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Intelligence Error" });
  }
};