"use strict";
const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);
const Students = require('../../Models/studentModel');
const jwt = require('jsonwebtoken');
const { secret } = require('../../Utils/config');
const { auth } = require("../../Utils/passport");
auth();

router.post("/signIn", (req, res) => {
    console.log('inside student sign IN');
    console.log('req body', req.body);
    let password = req.body.password;

    Students.findOne({ email: req.body.email })
        .then(student => {
            if (student) {
                if (bcrypt.compareSync(password, student.password)) {
                    const payload = { SID: student._id, name: student.name };
                    const token = jwt.sign(payload, secret, {
                        expiresIn: 1008000
                    });
                    console.log('sending jwt token')
                    res.status(200).end(JSON.stringify({ token: "JWT " + token, signInSuccess: true }))
                    // res.end("JWT " + token);
                }
                else {
                    console.log('wrong password')
                    res.status(401).end(JSON.stringify({ signInSuccess: false }))
                }
            }
            else {
                console.log('wrong email')
                res.status(401).end(JSON.stringify({ signInSuccess: false }))
            }
        })
        .catch(error => {
            console.log('student login error', error)
        })
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