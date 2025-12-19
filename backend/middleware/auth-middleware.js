import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer'))
    {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decodedToken = jwt.verify(token, process.env.API_KEY);
            req.user = decodedToken;
            next();
        } catch (error) {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }
    }
    else{
        return res.status(401).json({ message: 'Unauthorised access' });
    }
}