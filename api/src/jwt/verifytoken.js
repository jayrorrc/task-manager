import jwt from 'jsonwebtoken'

const KEY = process.env.AUTH_CONFIG_KEY
const SECURITY_HEADER = process.env.AUTH_CONFIG_KEY_SECURITY_HEADER

export default (req, res, next) => {
    const token = req.headers[SECURITY_HEADER];
    if (token) {
        jwt.verify(token, KEY, (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    message: 'Authorization failed',
                });
            } else {
                req.userAuth = decoded;
                next();
            }
        });
    } else {
        return res.status(401).json({
            message: 'Authorization failed',
        });
    }
}