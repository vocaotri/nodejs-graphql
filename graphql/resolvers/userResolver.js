const User = require("../../models/user");
const bcrypt = require("bcrypt");
const authJWT = require("../../utils/JWTToken");
const user = require("../../models/user");
const saltRounds = 11;
module.exports = {
    register: async(args) => {
        try {
            const { name, email, password } = args.register;
            const emailExpression = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

            const isValidEmail = emailExpression.test(String(email).toLowerCase());
            if (!isValidEmail) throw new Error("email not in proper format");

            if (name.length > 15)
                throw new Error("Name should be less than 15 characters");

            if (password.length < 8)
                throw new Error("password should be minimum 8 characters");

            const user = new User({
                name,
                email,
                password,
            });
            const newUser = await user.save();
            dataToken = {
                id: newUser._doc._id,
                email: newUser._doc.email,
            };
            const token = authJWT.generateAccessToken(dataToken);
            const result = newUser._doc;
            result.access_token = token;
            bcrypt.hash(password, saltRounds).then(function(password) {
                newUser.password = password;
                newUser.save();
            });
            return {...result, _id: newUser._doc._id };
        } catch (error) {
            throw error;
        }
    },
    login: async(args) => {
        const { email, password } = args.login;
        const checkEmail = await user.findOne({ email: email });
        const checkPass = bcrypt
            .compare(password, checkEmail.password)
            .then(function(result) {
                return result;
            });
        const data = await Promise.all([checkEmail, checkPass]);
        const userData = data[0];
        const checkPassData = data[1];
        if (checkPassData) {
            dataToken = {
                id: userData._id,
                email: userData.email,
            };
            const token = authJWT.generateAccessToken(dataToken);
            userData._doc.access_token = token;
            return {...userData._doc, _id: userData._doc._id };
        }
    }
};