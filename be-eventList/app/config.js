const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  // urlDb: process.env.URL_MONGODB_DEV,
  urlDb: process.env.URL_MONGODB,
  jwtSecret: process.env.JWT_SECRET,
  jwtRefreshTokenSecret: process.env.JWT_SECRET_REFRESH_TOKEN,
  jwtExpiration: "72h",
  jwtRefreshTokenExpiration: "24h",
  gmail: process.env.GMAIL,
  password: process.env.PASSWORD,
};