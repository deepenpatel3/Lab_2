const express = require("express");
const router = express.Router();
const { auth } = require("../../Utils/passport");
const { secret } = require('../../Utils/config');
var kafka = require('../../../kafka/client');
const { checkStudentAuth } = require("../../Utils/passport");
const jwt = require('jsonwebtoken')
auth();


router.get('/getBasicDetails', checkStudentAuth, function (req, res) {
    console.log('inside get basic details api');
    console.log('req', req.query)

    kafka.make_request('student_profile', { "path": "get_basic_details", "body": req.query }, function (err, result) {
        console.log("got back from get_basic_details kafka");
        if (err) {
            console.log('error', err)
            res.end();
        } else {
            console.log("result", result);
            var payload = {
                name: result.name,
                school: result.school,
                city: result.city
            }
            var token = jwt.sign(payload, secret, {
                expiresIn: 1008000 // in seconds
            });
            res.end(JSON.stringify({ token: "JWT " + token }))
        }
    });

})

router.post('/updateBasicDetails', checkStudentAuth, function (req, res) {
    console.log('inside update basic details');
    console.log('req.body', req.body)

    kafka.make_request('student_profile', { "path": "update_basic_details", "body": req.body }, function (err, result) {
        console.log("got back from update_basic_details kafka");
        if (err) {
            console.log('error', err)
            res.end();
        } else {
            console.log("result", result);
            var payload = {
                name: result.name,
                school: result.school,
                city: result.city
            }
            var token = jwt.sign(payload, secret, {
                expiresIn: 1008000 // in seconds
            });
            res.end(JSON.stringify({ token: "JWT " + token }))
        }
    });
})

router.get('/getContactInfo', checkStudentAuth, function (req, res) {
    console.log('inside get contact info');

    kafka.make_request('student_profile', { "path": "get_contact_info", "body": req.query }, function (err, result) {
        console.log("got back from get_contact_info kafka");
        if (err) {
            console.log('error', err)
            res.end();
        } else {
            console.log("result", result);
            var payload = {
                phone: result.phone,
                email: result.email
            }
            var token = jwt.sign(payload, secret, {
                expiresIn: 1008000 // in seconds
            });
            res.end(JSON.stringify({ token: "JWT " + token }))
        }
    });
})

router.post('/updateContactInfo', function (req, res) {
    console.log('inside update contact info');

    kafka.make_request('student_profile', { "path": "update_contact_info", "body": req.body }, function (err, result) {
        console.log("got back from update_contact_info kafka");
        if (err) {
            console.log('error', err)
            res.end();
        } else {
            console.log("result", result);
            var payload = {
                phone: result.phone,
                email: result.email
            }
            var token = jwt.sign(payload, secret, {
                expiresIn: 1008000 // in seconds
            });
            res.end(JSON.stringify({ token: "JWT " + token }))
        }
    });

})

router.get('/getCareerObjective', function (req, res) {
    console.log('inside get career objective api');

    kafka.make_request('student_profile', { "path": "get_career_objective", "body": req.query }, function (err, result) {
        console.log("got back from get_career_objective kafka");
        if (err) {
            console.log('error', err)
            res.end();
        } else {
            console.log("result", result);
            var payload = {
                careerObjective: result.careerObjective
            }
            var token = jwt.sign(payload, secret, {
                expiresIn: 1008000 // in seconds
            });
            res.end(JSON.stringify({ token: "JWT " + token }))
        }
    });
})

router.post('/updateCareerObjective', function (req, res) {
    console.log('inside update career objective api');

    kafka.make_request('student_profile', { "path": "update_career_objective", "body": req.body }, function (err, result) {
        console.log("got back from update_career_objective kafka");
        if (err) {
            console.log('error', err)
            res.end();
        } else {
            console.log("result", result);
            var payload = {
                careerObjective: result.careerObjective
            }
            var token = jwt.sign(payload, secret, {
                expiresIn: 1008000 // in seconds
            });
            res.end(JSON.stringify({ token: "JWT " + token }))
        }
    });

})

router.get('/getSkills', function (req, res) {
    console.log('inside get skills api');

    kafka.make_request('student_profile', { "path": "get_skills", "body": req.query }, function (err, result) {
        console.log("got back from get_skills kafka");
        if (err) {
            console.log('error', err)
            res.end();
        } else {
            console.log("result", result);
            var payload = {
                skills: result.skills
            }
            var token = jwt.sign(payload, secret, {
                expiresIn: 1008000 // in seconds
            });
            res.end(JSON.stringify({ token: "JWT " + token }))
        }
    });
})
module.exports = router;