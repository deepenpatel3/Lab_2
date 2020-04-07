"use strict";
var JwtStrategy = require("passport-jwt").Strategy;
var ExtractJwt = require("passport-jwt").ExtractJwt;
const passport = require("passport");
var { secret } = require("./config");
const Students = require("../Models/studentModel");

// Setup work and export for the JWT passport strategy
function auth() {
    var opts = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("jwt"),
        secretOrKey: secret
    };
    // console.log("inside passport")
    passport.use("student", new JwtStrategy(opts, (jwt_payload, callback) => {
        // console.log("jwt payload", jwt_payload);
        const SID = jwt_payload.SID;
        Students.findById(SID, (err, results) => {
            if (err) {
                return callback(err, false);
            }
            if (results) {
                // console.log('results', results);
                callback(null, results);
            }
            else {
                callback(null, false);
            }
        });
    }))
    passport.use("company", new JwtStrategy(opts, (jwt_payload, callback) => {
        console.log("jwt payload", jwt_payload);
        const user_id = jwt_payload._id;
        Company.findById(user_id, (err, results) => {
            if (err) {
                return callback(err, false);
            }
            if (results) {
                callback(null, results);
            }
            else {
                callback(null, false);
            }
        });
    }))
}

exports.auth = auth;
exports.checkStudentAuth = passport.authenticate("student", { session: false });
exports.checkCompanyAuth = passport.authenticate("company", { session: false });


