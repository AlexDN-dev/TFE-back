const jwt = require('jsonwebtoken');
const checkToken = (req, res, next) => {
    const request = req.body
    const token = Object.keys(request)[0];
    try {
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
            if (err) {
                return res.status(400).json({error: "invalid token"})
            } else {
                return res.json({token: decodedToken})
            }
        });
    }catch(err) {
        next(err)
    }
}

module.exports = {
    checkToken
}