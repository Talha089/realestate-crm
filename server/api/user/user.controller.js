
"use strict";

const { createJWT } = require("../../auth/helper");
const User = require("./user.model");
const { sendResponse, errReturned } = require("../../config/dto");
const { SUCCESS, BADREQUEST, NOTFOUND } = require("../../config/ResponseCodes");
const { emailValidator } = require('../../config/environment/const');

/**
    * USER SIGN UP
 */
exports.signUp = async (req, res) => {
    try {
        const { email, password, name } = req['body'];
        let required = ['email', 'password', 'name'];
        for (const field of required) {
            if (!req.body[field]) return sendResponse(res, BADREQUEST, `Please provide ${field}`, []);
        }

        let valid = emailValidator.test(email);
        if (!valid) return sendResponse(res, BADREQUEST, "Please enter valid Email", valid);


        if (await User.findOne({ email })) return sendResponse(res, BADREQUEST, "User already registered");

        let newUser = new User({
            email,
            password,
            name
        })

        await newUser.save();

        if (!newUser) return sendResponse(res, BADREQUEST, "Something went wrong, can't signUp");

        let { token } = await createJWT(newUser)
        return sendResponse(res, SUCCESS, 'Welcome to Weam Elnaggar Real Estate', { token, newUser });

    } catch (error) { errReturned(res, error) }
};

/**
    * USER SIGN IN 
 */

exports.signIn = async (req, res) => {
    try {
        let { email, password } = req['body'];
        let required = ['email', 'password'];
        for (const field of required) {
            if (!req.body[field])
                return sendResponse(res, BADREQUEST, `Please provide ${field}`, []);
        }
        let user = await User.findOne({ email }).exec();
        if (!user) return sendResponse(res, BADREQUEST, 'No user found', []);
        if (!user.authenticate(password)) return sendResponse(res, BADREQUEST, "Incorrect password")

        let { token } = await createJWT(user)
        return sendResponse(res, SUCCESS, 'Login Successful', { token, user });

    } catch (error) { errReturned(res, error) }
}