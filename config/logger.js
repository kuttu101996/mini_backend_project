const winston = require("winston")
const expressWinston = require('express-winston');
const { format } = require("winston");
require("winston-mongodb")

const logger = expressWinston.logger({
    // level: "error",
    transports: [
      new winston.transports.MongoDB({
        db: process.env.mongoURL,
        level: "error",
        json: true,
        collection: "logger",
        format: format.combine(format.timestamp(), format.json())
      })
    ],
    // format: winston.format.json(),
    msg: "HTTP {{req.method}} {{req.url}}", // "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
    expressFormat: true,
    meta: false
    // ignoreRoute: function (req, res) { return false; }
})


module.exports = {
    logger
}