const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = (req, res, next) => {
    // console.log('in middleware auth');
    //Get the token from header
    let token = req.header('x-auth-token');
    // console.log(token);
    if(!token) {
        // console.log('token form auth middleware ' + localStorage.getItem('token'))
        // token = localStorage.getItem('token');
        token = req.headers.authorization.split(' ')[1]; //'Authorization: 'Bearer token'
        // console.log('token get ' + token);
    }
    // console.log(token);
    // console.log('after token ' + token)
    if(!token) return res.status(401).json({ msg: "No token, authorization denied!"});

    //Verify the token
    try {
        const decoded = jwt.verify(token, config.get('jwtSecret'));
        // console.log('/////////////////////////////////////////////////////////////////////////////////');
        // console.log(decoded);
        req.user = decoded.user;
        // console.log('userId=');
        // console.log(decoded.user);
        next();
    } catch (e) {
        res.status(401).json({ msg: "Token is not valid "});
    }
}
