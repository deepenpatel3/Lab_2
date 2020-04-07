"use strict";
const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const { secret } = require('../../Utils/config');
const kafka = require("../../../kafka/client");
const { auth } = require("../../Utils/passport");
const Students = require("../../Models/studentModel")
auth();

router.post("/signIn", (req, res) => {
    console.log('inside student sign IN');
    console.log('req body', req.body);
    let body = {
        email: req.body.email,
        password: req.body.password
    }
    kafka.make_request('login', { "path": "student_login", "body": body }, function (err, result) {
        console.log('in student login result');
        if (err) {
            console.log('error', err)
            res.send({
                signinSuccess: false
            })
        } else {
            console.log("result", result);
            if (result.signInSuccess) {
                var payload = {
                    signInSuccess: result.signInSuccess,
                    SID: result.SID,
                    name: result.name
                }
            }
            else {
                var payload = { signInSuccess: result.signInSuccess }
            }
            var token = jwt.sign(payload, secret, {
                expiresIn: 1008000 // in seconds
            });
            res.end(JSON.stringify({ token: "JWT " + token }))
        }
    });
});

router.post("/signUp", function (req, res) {
    console.log('inside student sign up');
    console.log("email", req.body.email);
    let password = req.body.password;
    let hash = bcrypt.hashSync(password, salt);

    var newStudent = new Students({
        name: req.body.name,
        password: hash,
        email: req.body.email,
        city: req.body.city,
        school: req.body.school
    });
    Students.findOne({ email: req.body.email }, (error, student) => {
        if (error) {
            console.log('error', error)
            res.writeHead(500, {
                'Content-Type': 'text/plain'
            })
            res.end();
        }
        if (student) {
            console.log('student found', student)
            // res.writeHead(400, {
            //     'Content-Type': 'text/plain'
            // })
            res.end(JSON.stringify({ signUpSuccess: false }))
        }
        else {
            newStudent.save((error, student) => {
                if (error) {
                    console.log('error', error)
                    res.writeHead(500, {
                        'Content-Type': 'text/plain'
                    })
                    res.end();
                }
                else {
                    console.log('student entered', student)
                    // res.writeHead(200, {
                    //     'Content-Type': 'text/plain'
                    // })
                    res.end(JSON.stringify({ SID: student._id, name: student.name, signUpSuccess: true }));
                }
            });
        }
    });
})

module.exports = router;