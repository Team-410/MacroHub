import jwt from 'jsonwebtoken';

// Secret key for signing JWT tokens
const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

// Middleware to authenticate user requests
export const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ message: "Access Denied. No token provided." });
    }

    jwt.verify(token.split(" ")[1], SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Invalid Token" });
        }
        req.user = user;
        next();
    });
};

// Function to generate JWT token for a user
export const generateToken = (user) => {
    return jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });
};
