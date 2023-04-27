const jwt = require('jsonwebtoken');
const checkToken = (req, res, next) => {
    const request = req.body
    const token = Object.keys(request)[0];
    console.log(token)
    try {
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
            if (err) {
                return res.json({message: "false"})
            } else {
                return res.json({message: 'true'})
            }
        });
    }catch(err) {
        next(err)
    }
}

module.exports = {
    checkToken
}