const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var studentSchema = new Schema({
    name: String,
    email: String,
    school: String,
    password: String,
    skills: [{ name: String }],
    dateOfBirth: Date,
    city: String,
    profilePicUrl: String,
    educationDetails: [{ school: String, locaion: String, degree: String, major: String, gpa: Number, passingYear: Number }],
    careerObjective: String,
    phone: Number,
    experienceDetails: [{ company: String, title: String, location: String, startDate: Date, endDate: Date, description: String }]
},
    {
        versionKey: false
    });

module.exports = mongoose.model('student', studentSchema);
