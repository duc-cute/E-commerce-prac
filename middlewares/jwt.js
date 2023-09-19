/** @format */

const jwt = require("jsonwebtoken");
const generateAccessToken = (uid, role) => {
  return jwt.sign({ _id: uid, role }, process.env.ACCESSTOKEN_KEY, {
    expiresIn: process.env.ACCESSTOKEN_EXPIRE,
  });
};

const generateFrefreshToken = (uid) => {
  return jwt.sign({ _id: uid }, process.env.REFRESHTOKEN_KEY, {
    expiresIn: process.env.REFRESHTOKEN_EXPIRE,
  });
};

module.exports = { generateAccessToken, generateFrefreshToken };
