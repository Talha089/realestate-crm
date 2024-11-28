const { readFileSync } = require("fs");

const config = require("./environment");
const { SUCCESS } = require('./ResponseCodes');

const sendResponse = (res, code, message, body = []) => {
	let response = {
		code,
		message,
		body,
	};
	return res.status(code).json(response);
};
exports.sendResponse = sendResponse;

const errReturned = (res, err) => {
	console.error(err);
	res.status(400).json({ code: 400, message: err.message || err });
}
exports.errReturned = errReturned;

