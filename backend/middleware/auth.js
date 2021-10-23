const jwt = require('jsonwebtoken');

//Verifying token
module.exports = (req, res, next) => {
    let token = null;
    if(req.headers.authorization)
        token = req.headers.authorization.split(' ')[1]; //'Authorization: 'Bearer token' token structure
    if(!token) return res.status(401).json({ "error": "Login First"});
    try {
        const decoded = jwt.verify(token, process.env.JWTSCERET);
        req.user = decoded.user; //decoded.user is { id: userId }
        next();
    } catch (e) {
        res.status(401).json({ "error": "Login First"});
    }
}
