const userModel = require('../models/user');
const jwt = require("jsonwebtoken");
module.exports = {
    generateAccessToken: (data) => {
        return jwt.sign(data, process.env.TOKEN_SECRET, { expiresIn: '7889232s' });
    },
    verifyAccessToken: async(token) => {
        let user = await jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
            if (err) return null;
            return user;
        })
        if (user === null)
            return {};
        user = await userModel.findById(user.id);
        return {...user };
    }
};