const jwt = require("jsonwebtoken");
module.exports = {
  generateAccessToken: (data) => {
    return jwt.sign(data, process.env.TOKEN_SECRET, { expiresIn: '7889232s' });
  },
  verifyAccessToken:(token)=>{
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET , (err, user) => {
        if (err) return 0
        return user;
      })
  }
};
