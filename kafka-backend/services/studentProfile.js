const Students = require('../Models/studentModel');

exports.serve = function serve(msg, callback) {
    console.log('inside kafka backend student_profile service');
    console.log("msg", msg);
    console.log("In Service path:", msg.path);
    switch (msg.path) {
        case "get_basic_details":
            get_basic_details(msg, callback);
            break;
        case "update_basic_details":
            // console.log(("inside update basic details"))
            update_basic_details(msg, callback);
            break;
        case "get_contact_info":
            get_contact_info(msg, callback);
            break;
        case "update_contact_info":
            update_contact_info(msg, callback);
            break;
        case "get_career_objective":
            get_career_objective(msg, callback);
            break;
        case "update_career_objective":
            update_career_objective(msg, callback);
            break;
        case "get_skills":
            get_skills(msg, callback);
            break;
    }
}

function get_basic_details(msg, callback) {
    // console.log('student Id- ', msg.body);
    Students.findOne({ _id: msg.body.SID }, (err, student) => {
        if (err) {
            console.log('get basic details kafka error- ', err)
            callback(null, { success: false })
        }
        else {
            callback(null, { success: true, name: student.name, school: student.school, city: student.city });
        }
    })
}

function update_basic_details(msg, callback) {
    console.log("student id- ", msg.body);

    Students.findByIdAndUpdate({ _id: msg.body.SID }, {
        name: msg.body.name,
        school: msg.body.school,
        city: msg.body.city
    }, { new: true }, (err, student) => {
        if (err) {
            console.log("error", err)
            callback(null, null);
        }
        else {
            console.log('updated successfully');
            console.log("student", student)
            callback(null, { name: student.name, city: student.city, school: student.school });
        }
    })
}

function get_contact_info(msg, callback) {
    Students.findOne({ _id: msg.body.SID }, (err, student) => {
        if (err) {
            console.log('get basic details kafka error- ', err)
            callback(null, { success: false })
        }
        else {
            callback(null, { success: true, phone: student.phone, email: student.email });
        }
    })
}

function update_contact_info(msg, callback) {
    Students.findByIdAndUpdate({ _id: msg.body.SID }, {
        email: msg.body.email,
        phone: msg.body.phone
    }, { new: true }, (err, student) => {
        if (err) {
            console.log("error", err)
            callback(null, null);
        }
        else {
            // console.log('updated successfully');
            // console.log("student", student)
            callback(null, { email: student.email, phone: student.phone });
        }
    })
}

function get_career_objective(msg, callback) {
    Students.findOne({ _id: msg.body.SID }, (err, student) => {
        if (err) {
            console.log('get basic details kafka error- ', err)
            callback(null, { success: false })
        }
        else {
            callback(null, { careerObjective: student.careerObjective });
        }
    })
}

function update_career_objective(msg, callback) {
    Students.findByIdAndUpdate({ _id: msg.body.SID }, { careerObjective: msg.body.careerObjective }, { new: true }, (err, student) => {
        if (err) {
            console.log("error", err)
            callback(null, null);
        }
        else {
            // console.log('updated successfully');
            // console.log("student", student)
            callback(null, { careerObjective: student.careerObjective });
        }
    })
}

function get_skills(msg, callback) {
    Students.findOne({ _id: msg.body.SID }, (err, student) => {
        if (err) {
            console.log('get skills kafka error- ', err)
            callback(null, { success: false })
        }
        else {
            callback(null, { skills: student.skills });
        }
    })
}