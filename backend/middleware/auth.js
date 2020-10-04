const jwt = require('jsonwebtoken');

//Verifying token
module.exports = (req, res, next) => {
    token = req.headers.authorization.split(' ')[1]; //'Authorization: 'Bearer token' token structure
    if(!token) return res.status(401).json({ msg: "No token, authorization denied!"});
    try {
        const decoded = jwt.verify(token, process.env.JWTSCERET);
        req.user = decoded.user;
        next();
    } catch (e) {
        res.status(401).json({ msg: "Token is not valid "});
    }
}
