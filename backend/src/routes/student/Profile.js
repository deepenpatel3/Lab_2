const express = require("express");
const router = express.Router();
const Students = require('../../Models/studentModel');
const { checkStudentAuth } = require("../../Utils/passport");
const { auth } = require("../../Utils/passport");
const { secret } = require('../../Utils/config');
const jwt = require('jsonwebtoken')
auth();


router.get('/getBasicDetails', checkStudentAuth, function (req, res) {
    // console.log('inside get basic details');
    Students.findOne({ _id: req.query.SID })
        .then(student => {
            if (student) {
                const payload = { name: student.name, city: student.city, school: student.school };
                const token = jwt.sign(payload, secret, {
                    expiresIn: 1008000
                });
                // console.log('sending jwt token')
                res.status(200).end(JSON.stringify({ token: "JWT " + token }))
            }
            else {
                console.log('wrong student id')
                res.status(401).end("wrong student id")
            }
        })
        .catch(error => {
            console.log('get basics details error', error)
        })
})

router.post('/updateBasicDetails', checkStudentAuth, function (req, res) {
    console.log('inside update basic details');
    console.log('req.body', req.body)

    Students.findByIdAndUpdate({ _id: req.body.SID }, {
        name: req.body.name,
        school: req.body.school,
        city: req.body.city
    }, { new: true })
        .then(student => {
            if (student) {
                console.log("student", student)
                console.log('updated successfully')
                const payload = { name: student.name, city: student.city, school: student.school };
                const token = jwt.sign(payload, secret, {
                    expiresIn: 1008000
                });
                res.status(200).end(JSON.stringify({ token: "JWT " + token }))
            }
            else {
                console.log('wrong student id')
                res.status(401).end("wrong student id")
            }
        })
        .catch(error => {
            console.log('get basics details error', error)
        })
})



module.exports = router;