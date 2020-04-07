const Students = require('../Models/studentModel');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

exports.serve = function serve(msg, callback) {
    console.log('inside kafka backend login service');
    console.log("msg", msg);
    console.log("In Service path:", msg.path);
    switch (msg.path) {
        case "student_login":
            student_login(msg, callback);
            break;
    }
}

function student_login(msg, callback) {
    console.log('student email- ', msg.body.email);
    console.log('student password- ', msg.body.password);
    // Students.find({}, (err, result) => {
    //     if (err) {
    //         console.log("error", err)
    //     }
    //     else {
    //         console.log("student found-", result);
    //     }
    // })

    let password = msg.body.password;
    Students.findOne({ email: msg.body.email })
        .then(student => {
            if (student) {
                console.log("student found-", student)
                if (bcrypt.compareSync(password, student.password)) {
                    console.log('student match')
                    callback(null, { signInSuccess: true, SID: student._id, name: student.name })
                }
                else {
                    console.log('wrong password')
                    callback(null, { signInSuccess: false, message: "wrong password" })
                }
            }
            else {
                console.log('wrong email')
                callback(null, { signInSuccess: false, message: "wrong email" })
            }
        })
        .catch(error => {
            console.log('student login error', error)
        })
}