const express = require("express");
const router = express.Router();
const Students = require('../../Models/studentModel');
const { checkStudentAuth } = require("../../Utils/passport");
const { auth } = require("../../Utils/passport");
const { secret } = require('../../Utils/config');
const jwt = require('jsonwebtoken')
auth();

router.get('/getBasicDetails', checkStudentAuth, function (req, res) {
    console.log('inside get basic details');
    Students.findOne({ _id: req.query.SID })
        .then(student => {
            if (student) {
                const payload = { name: student.name, city: student.city, school: student.school, profilePicURL: student.profilePicURL };
                const token = jwt.sign(payload, secret, {
                    expiresIn: 1008000
                });
                console.log('sending jwt token')
                res.status(200).end(JSON.stringify({ token: "JWT " + token }))
            }
            else {
                console.log('wrong student id')
                res.status(401).end(JSON.stringify({ signInSuccess: false }))
            }
        })
        .catch(error => {
            console.log('get basics details error', error)
        })
})

module.exports = router;