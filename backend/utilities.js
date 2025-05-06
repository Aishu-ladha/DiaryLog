const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const accessToken = req.headers['authorization']?.split(' ')[1];
    console.log(accessToken);
    console.log("Auth Header:", req.headers['authorization']);

    if (!accessToken) return res.sendStatus(401); // Unauthorized

    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403); // Forbidden
        req.user = user;
        next();
    });
}

// module.exports = authenticateToken;
module.exports = {
    authenticateToken
};