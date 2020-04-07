const mongoose = require('mongoose');
// require('mongoose-type-url');
const Schema = mongoose.Schema;

var studentSchema = new Schema({
    name: String,
    email: String,
    school: String,
    password: String,
    skills: [String],
    dateOfBirth: Date,
    city: String,
    profilePic: String,
    educationDetails: [{ school: String, locaion: String, degree: String, major: String, gpa: Number, passingYear: Number }],
    careerObjective: String,
    phone: String,
    experienceDetails: [{ company: String, title: String, location: String, startDate: Date, endDate: Date, description: String }]
},
    {
        versionKey: false
    });

module.exports = mongoose.model('students', studentSchema);
