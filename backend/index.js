//import the require dependencies
const { mongoDB, frontendURL } = require("./src/Utils/config");
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var session = require("express-session");
var cookieParser = require("cookie-parser");
var cors = require("cors");
const bcrypt = require('bcrypt');
var kafka = require('./kafka/client');
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);
var multer = require('multer');
const mysql = require('mysql2/promise');
var path = require('path');
const Students = require("./src/Models/studentModel");

app.use(cors({ origin: frontendURL, credentials: true }));

app.use(cookieParser());
//use express session to maintain session data
app.use(
    session({
        secret: "cmpe273_handshake_clone",
        resave: false, // Forces the session to be saved back to the session store, even if the session was never modified during the request
        saveUninitialized: false, // Force to save uninitialized session to db. A session is uninitialized when it is new but not modified.
        duration: 60 * 60 * 1000, // Overall duration of Session : 30 minutes : 1800 seconds
        activeDuration: 5 * 60 * 1000
    })
);
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

const storage = multer.diskStorage({
    // destination: '/uploads/',
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, callback) {
        callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});

const upload = multer({
    storage: storage,
})
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

//Allow Access Control
app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", frontendURL);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET,HEAD,OPTIONS,POST,PUT,DELETE"
    );
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
    );
    res.setHeader("Cache-Control", "no-cache");
    next();
});

const mongoose = require('mongoose');

var options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    poolSize: 500,
    bufferMaxEntries: 0
};

mongoose.connect(mongoDB, options, (err) => {
    if (err) {
        console.log(err);
        console.log(`MongoDB Connection Failed`);
    } else {
        console.log(`MongoDB Connected`);
    }
});
var collections = mongoose.connections[0].collections;
var names = [];

Object.keys(collections).forEach(function (k) {
    names.push(k);
});

console.log("collections- ", names);
// Students.find({}, (err, student) => {
//     if (err) {
//         console.log("error")
//         // return callback(err, false);
//     }
//     if (student) {
//         console.log('results', student);
//         // callback(null, results);
//     }
//     else {
//         console.log("nothing")
//         // callback(null, false);
//     }
// });



const studentAccount = require("./src/routes/student/Account");
const companyAccount = require("./src/routes/company/Account");
const studentProfile = require("./src/routes/student/Profile");

app.use("/company/account", companyAccount);
app.use("/student/account", studentAccount);
app.use("/student/profile", studentProfile);

app.post('/updateProfilePic', upload.single('profilePic'), function (req, res) {
    console.log("Inside update profile picture");
    var host = req.hostname;
    console.log("Hostname", host)
    console.log("File", req.file)
    var imagepath = req.protocol + "://" + host + ':3001/' + req.file.path;
    // console.log('imagepath- ', imagepath, " & type of imagehath- ", typeof (imagepath));
    console.log('sid', req.body.SID)

    Students.findByIdAndUpdate({ _id: req.body.SID }, { profilePic: imagepath, name: imagepath }, { new: true })
        .then(student => {
            if (student) {
                console.log('profilePicURL: ', student.profilePic);
                res.redirect("http://localhost:3000/profile");
            }
            else {
                console.log('wrong student id')
                res.status(401).end("wrong student id")
            }
        })
        .catch(error => {
            console.log('update profile picture error', error)
        })
});
app.get('/getProfilePic', function (req, res) {
    // console.log('req body', req.query)
    Students.findById({ _id: req.query.SID })
        .then(student => {
            if (student) {
                res.status(200).end(student.profilePic);
            }
            else {
                console.log('wrong student id')
                res.status(401).end("wrong student id")
            }
        })
        .catch(error => {
            console.log('update profile picture error', error)
        })
});

app.get('/getEducationDetails', function (req, res) {
    console.log('inside get get education details');

    async function getData() {

        const connection = await mysql.createConnection({ host: 'handshakedb.clco8f6rhzmw.us-east-1.rds.amazonaws.com', user: 'admin', password: 'admin123', database: 'handshake_clone', port: 3306 });
        const [upadatedRows, fields1] = await connection.execute('SELECT `ID`,`school`,`schoolLocation`,`degree`,`major`,`passingYear`,`gpa` FROM `EducationDetails` WHERE `SID`=(?) ORDER BY `passingYear` DESC', [req.query.ID]);

        await connection.end();
        return upadatedRows;
    }

    data = getData()
    data.then((r) => {
        res.send(r);
    }).catch(e => {
        console.log(e)
        console.log('get educatio error', e)
    })
})

app.post('/updateEducationDetails', function (req, res) {
    console.log('inside post abcd update education details');
    console.log(req.body)
    let ID = req.body.ID;
    let school = req.body.school;
    let schoolLocation = req.body.schoolLocation;
    let degree = req.body.degree;
    let major = req.body.major;
    let passingYear = req.body.passingYear;
    let gpa = req.body.gpa;

    async function updateData1() {

        const connection = await mysql.createConnection({ host: 'handshakedb.clco8f6rhzmw.us-east-1.rds.amazonaws.com', user: 'admin', password: 'admin123', database: 'handshake_clone', port: 3306 });
        const [rows, fields] = await connection.execute('UPDATE `EducationDetails` SET `school`= (?), `schoolLocation`= (?), `degree` = (?), `major` = (?), `passingYear` = (?), `gpa`= (?) WHERE `SID` = (?) && `ID`=(?) ', [school, schoolLocation, degree, major, passingYear, gpa, req.query.SID, ID]);
        await connection.end();
    }

    updateData1()
        .then(() => {
            console.log("education updated successfully");
        }).catch(e => {
            console.log('update education error', e)
        })
})

app.post("/addEducationDetails", function (req, res) {
    console.log('inside post add education details');
    let ID = req.body.ID;
    let school = req.body.school;
    let schoolLocaiton = req.body.schoolLocation;
    let degree = req.body.degree;
    let major = req.body.major;
    let passingYear = req.body.passingYear;
    let gpa = req.body.gpa;

    async function storeData() {

        const connection = await mysql.createConnection({ host: 'handshakedb.clco8f6rhzmw.us-east-1.rds.amazonaws.com', user: 'admin', password: 'admin123', database: 'handshake_clone', port: 3306 });
        const [rows, fields] = await connection.execute('INSERT INTO `EducationDetails` (SID, school, schoolLocation, degree, major, passingYear, gpa) VALUES (?,?,?,?,?,?,?)', [ID, school, schoolLocaiton, degree, major, passingYear, gpa]);
        await connection.end();
    }

    storeData()
        .then(() => {
            console.log('education added successfully');
        }).catch(e => {
            console.log('add education error', e)
        })
})

app.post("/deleteEducationDetails", function (req, res) {
    console.log('inside post delete education details');
    let ID = req.body.ID;
    console.log("ID to be deleted", ID);

    async function deleteData() {

        const connection = await mysql.createConnection({ host: 'handshakedb.clco8f6rhzmw.us-east-1.rds.amazonaws.com', user: 'admin', password: 'admin123', database: 'handshake_clone', port: 3306 });
        const [rows, fields] = await connection.execute('DELETE FROM `EducationDetails` WHERE `ID`=?', [ID]);
        await connection.end();
    }

    deleteData()
        .then(() => {
            console.log('education deleted successfully');
            res.end();
        }).catch(e => {
            console.log(e)
            console.log('error aavi')
        })
})

app.post("/deleteExperience", function (req, res) {
    console.log('inside post delete experience');
    let ID = req.body.ID;
    console.log("ID to be deleted", ID);

    async function deleteData() {

        const connection = await mysql.createConnection({ host: 'handshakedb.clco8f6rhzmw.us-east-1.rds.amazonaws.com', user: 'admin', password: 'admin123', database: 'handshake_clone', port: 3306 });
        const [rows, fields] = await connection.execute('DELETE FROM `Experience` WHERE `ID`=?', [ID]);
        await connection.end();
    }

    deleteData()
        .then(() => {
            console.log('experience deleted successfully');
            res.end();
        }).catch(e => {
            console.log('delete experience error', e)
        })
})
app.get('/getExperience', function (req, res) {
    console.log('inside get get experience');
    // console.log(req.body);

    async function getData() {

        const connection = await mysql.createConnection({ host: 'handshakedb.clco8f6rhzmw.us-east-1.rds.amazonaws.com', user: 'admin', password: 'admin123', database: 'handshake_clone', port: 3306 });
        const [upadatedRows, fields1] = await connection.execute('select ID, companyName,title, location,startDate, endDate, description from Experience where SID = ?', [req.query.ID]);
        await connection.end();
        return upadatedRows;
    }

    data = getData()
    data.then((r) => {
        // console.log('experience details found', r);
        res.send(r);
    }).catch(e => {
        console.log(e)
        console.log('error aavi')
    })
})

app.post("/addExperience", function (req, res) {
    console.log('inside post add experience');
    let ID = req.body.ID;
    let companyName = req.body.companyName;
    let title = req.body.title;
    let location = req.body.location;
    let startDate = req.body.startDate;
    let endDate = req.body.endDate;
    let description = req.body.description;

    async function storeData() {

        const connection = await mysql.createConnection({ host: 'handshakedb.clco8f6rhzmw.us-east-1.rds.amazonaws.com', user: 'admin', password: 'admin123', database: 'handshake_clone', port: 3306 });
        const [rows, fields] = await connection.execute('INSERT INTO `Experience` (SID, companyName, title, location, startDate, endDate, description) VALUES (?,?,?,?,?,?,?)', [ID, companyName, title, location, startDate, endDate, description]);
        await connection.end();
    }

    storeData()
        .then(() => {
            console.log('experience added successfully');
        }).catch(e => {
            console.log('add experience error', e)
        })
})

app.post('/updateExperience', function (req, res) {
    console.log('inside post update experience');
    console.log(req.body)
    let ID = req.body.ID;
    let SID = req.body.SID;
    let companyName = req.body.companyName;
    let title = req.body.title;
    let location = req.body.location;
    let startDate = req.body.startDate;
    let endDate = req.body.endDate;
    let description = req.body.description;

    async function updateData1() {

        const connection = await mysql.createConnection({ host: 'handshakedb.clco8f6rhzmw.us-east-1.rds.amazonaws.com', user: 'admin', password: 'admin123', database: 'handshake_clone', port: 3306 });
        const [rows, fields] = await connection.execute('UPDATE Experience SET companyName=?, title=?, location=?, startDate=?, endDate=?, description=? WHERE SID = ? && ID=? ', [companyName, title, location, startDate, endDate, description, SID, ID]);
        await connection.end();
    }

    updateData1()
        .then(() => {
            console.log("experience updated successfully");
        }).catch(e => {
            console.log(e)
            console.log('error aavi')
        })
})

app.post("/addSkill", function (req, res) {
    console.log('inside post add skill');
    let SID = req.query.ID;
    let skill = req.body.skill;
    console.log('skill to be added', skill)
    async function storeData() {

        const connection = await mysql.createConnection({ host: 'handshakedb.clco8f6rhzmw.us-east-1.rds.amazonaws.com', user: 'admin', password: 'admin123', database: 'handshake_clone', port: 3306 });
        const [rows, fields] = await connection.execute('SELECT SkillID FROM Skill where skill = ? LIMIT 1;', [skill]);
        await connection.end();
        console.log('skill found', rows);
        if (Array.isArray(rows) && rows.length) {
            const [updatedrows, fields] = await connection.execute('INSERT INTO `Skill` (SkillID, SID, skill) VALUES (?,?,?)', [rows[0].SkillID, SID, skill]);
        }
        else {
            const [updatedrows, fields] = await connection.execute('INSERT INTO `Skill` (SID, skill) VALUES (?,?)', [SID, skill]);
        }
    }

    storeData()
        .then(() => {
            console.log('skill added successfully');
            res.end();
        }).catch(e => {
            console.log('skill add error:', e)

        })
})

app.post('/updateSkill', function (req, res) {
    console.log('inside post update skill');
    let ID = req.body.ID;
    let SID = req.body.SID;
    let skill = req.body.skill;
    console.log('skill to be updated', ID, skill, req.query.SID)
    async function updateData1() {

        const connection = await mysql.createConnection({ host: 'handshakedb.clco8f6rhzmw.us-east-1.rds.amazonaws.com', user: 'admin', password: 'admin123', database: 'handshake_clone', port: 3306 });
        const [rows, fields] = await connection.execute('UPDATE Skill SET skill=? WHERE SID = ? && SkillID=? ', [skill, SID, ID]);
        await connection.end();
    }

    updateData1()
        .then(() => {
            console.log("skill updated successfully");
        }).catch(e => {
            console.log(e)
            console.log('error aavi')
        })
})

app.post("/deleteSkill", function (req, res) {
    console.log('inside post delete skill');
    let ID = req.body.ID;
    let SID = req.body.SID;
    console.log("ID to be deleted", ID);

    async function deleteData() {

        const connection = await mysql.createConnection({ host: 'handshakedb.clco8f6rhzmw.us-east-1.rds.amazonaws.com', user: 'admin', password: 'admin123', database: 'handshake_clone', port: 3306 });
        const [rows, fields] = await connection.execute('DELETE FROM `Skill` WHERE `SkillID`=? && SID=?', [ID, SID]);
        await connection.end();
    }

    deleteData()
        .then(() => {
            console.log('skill deleted successfully');
            res.end();
        }).catch(e => {
            console.log(e)
            console.log('error aavi')
        })
})

app.post('/apply', upload.single('resume'), function (req, res) {
    console.log("apply job api")
    console.log('req body', req.body)
    let SID = req.body.SID;
    var host = req.hostname;
    console.log("Hostname", host)
    console.log("File", req.file)
    var imagepath = req.protocol + "://" + host + ':3001/' + req.file.path;
    let sql = 'Insert into JobRegistry (JID, SID, resume, status) values (?,?,?,?)';
    console.log('imagepath', imagepath);
    async function updateData() {

        const connection = await mysql.createConnection({ host: 'handshakedb.clco8f6rhzmw.us-east-1.rds.amazonaws.com', user: 'admin', password: 'admin123', database: 'handshake_clone', port: 3306 });
        const [rows, fields] = await connection.execute(sql, [req.body.ID, SID, imagepath, 'Pending']);
        await connection.end();
    }
    updateData()
        .then((r) => {
            console.log("uploaded resume successfully");
        }).catch(e => {
            console.log(e)
            console.log('error aavi')
        })
});

app.get('/getJobs', function (req, res) {
    console.log('inside get get jobs');

    async function getData() {

        const connection = await mysql.createConnection({ host: 'handshakedb.clco8f6rhzmw.us-east-1.rds.amazonaws.com', user: 'admin', password: 'admin123', database: 'handshake_clone', port: 3306 });
        const [upadatedRows, fields1] = await connection.execute('select * from Job left join JobRegistry on Job.ID = JobRegistry.JID');
        await connection.end();
        return upadatedRows;
    }

    data = getData()
    data.then((r) => {
        console.log('got the jobs', r);
        res.send(r);
    }).catch(e => {
        console.log('get job error', e);
    })
})


app.get('/getCompanyJobs', function (req, res) {
    console.log('inside get get company jobs');

    async function getData() {

        const connection = await mysql.createConnection({ host: 'handshakedb.clco8f6rhzmw.us-east-1.rds.amazonaws.com', user: 'admin', password: 'admin123', database: 'handshake_clone', port: 3306 });
        const [upadatedRows, fields1] = await connection.execute('select * from Job where companyID =?', [req.query.CID]);
        await connection.end();
        return upadatedRows;
    }

    data = getData()
    data.then((r) => {
        console.log('got the company jobs', r);
        res.send(r);
    }).catch(e => {
        console.log('get company job error', e);
    })
})

app.post("/changeAppStatus", function (req, res) {
    console.log('inside post change app status');

    async function register() {

        const connection = await mysql.createConnection({ host: 'handshakedb.clco8f6rhzmw.us-east-1.rds.amazonaws.com', user: 'admin', password: 'admin123', database: 'handshake_clone', port: 3306 });
        const [rows, fields] = await connection.execute('UPDATE JobRegistry SET status=? WHERE JID=? && SID=? ', [req.body.status, req.body.JID, req.body.SID]);
        await connection.end();
    }

    register()
        .then(() => {
            console.log('app status updated successfully');
            res.end();
        }).catch(e => {
            console.log(e)
            console.log('error aavi')
        })
})

app.get('/getEvents', function (req, res) {
    console.log('inside get get events');

    async function getData() {

        const connection = await mysql.createConnection({ host: 'handshakedb.clco8f6rhzmw.us-east-1.rds.amazonaws.com', user: 'admin', password: 'admin123', database: 'handshake_clone', port: 3306 });
        const [upadatedRows, fields1] = await connection.execute('select * from Event where ID NOT IN (select EID from EventRegistry where SID=?) ORDER BY date ASC', [req.query.ID]);
        await connection.end();
        return upadatedRows;
    }

    data = getData()
    data.then((r) => {
        console.log('got the events', r);
        res.send(r);
    }).catch(e => {
        console.log('get job error', e);
    })
})

app.post("/registerEvent", function (req, res) {
    console.log('inside post register event');
    console.log("req body", req.body);

    async function register() {

        const connection = await mysql.createConnection({ host: 'handshakedb.clco8f6rhzmw.us-east-1.rds.amazonaws.com', user: 'admin', password: 'admin123', database: 'handshake_clone', port: 3306 });
        const [rows, fields] = await connection.execute('INSERT INTO `EventRegistry` (EID, SID) VALUES (?,?)', [req.body.ID, req.query.SID]);
        await connection.end();
    }

    register()
        .then(() => {
            console.log('registered successfully');
            res.end();
        }).catch(e => {
            console.log(e)
            console.log('error aavi')
        })
})

app.post("/postJob", function (req, res) {
    console.log('inside post post job');

    async function register() {

        const connection = await mysql.createConnection({ host: 'handshakedb.clco8f6rhzmw.us-east-1.rds.amazonaws.com', user: 'admin', password: 'admin123', database: 'handshake_clone', port: 3306 });
        const [rows, fields] = await connection.execute('INSERT INTO `Job` (title, postingDate, deadline, location, description,salary, category, company, companyID) VALUES (?,?,?,?,?,?,?,?)', [req.body.title, req.body.postingDate, req.body.deadline, req.body.location, req.body.description, req.body.salary, req.body.category, req.body.companyName, req.body.CID]);
        await connection.end();
    }

    register()
        .then(() => {
            console.log('posted job successfully');
            res.end();
        }).catch(e => {
            console.log(e)
            console.log('error aavi')
        })
})

app.get('/getRegisteredEvents', function (req, res) {
    console.log('inside get get registered events');

    async function getData() {

        const connection = await mysql.createConnection({ host: 'handshakedb.clco8f6rhzmw.us-east-1.rds.amazonaws.com', user: 'admin', password: 'admin123', database: 'handshake_clone', port: 3306 });
        const [upadatedRows, fields1] = await connection.execute('SELECT Event.ID, Event.name, Event.description, Event.time, Event.date, Event.location, Event.company FROM Event inner join EventRegistry on Event.ID = EventRegistry.EID where EventRegistry.SID = ? ORDER BY Event.date ASC', [req.query.SID]);
        await connection.end();
        return upadatedRows;
    }

    data = getData()
    data.then((r) => {
        console.log('got the registered events', r);
        res.send(r);
    }).catch(e => {
        console.log('get registered event error', e);
    })
})

app.get('/getAppliedJobs', function (req, res) {
    console.log('inside get get applied jobs');

    async function getData() {

        const connection = await mysql.createConnection({ host: 'handshakedb.clco8f6rhzmw.us-east-1.rds.amazonaws.com', user: 'admin', password: 'admin123', database: 'handshake_clone', port: 3306 });
        const [upadatedRows, fields1] = await connection.execute('SELECT Job.title, Job.location, Job.salary, Job.company, JobRegistry.status FROM Job inner join JobRegistry on Job.ID = JobRegistry.JID where JobRegistry.SID = ?', [req.query.SID]);
        await connection.end();
        return upadatedRows;
    }

    data = getData()
    data.then((r) => {
        console.log('got the applied jobs', r);
        res.send(r);
    }).catch(e => {
        console.log('get registered event error', e);
    })
})

app.get('/getStudents', function (req, res) {
    console.log('inside get get students');

    async function getData() {

        const connection = await mysql.createConnection({ host: 'handshakedb.clco8f6rhzmw.us-east-1.rds.amazonaws.com', user: 'admin', password: 'admin123', database: 'handshake_clone', port: 3306 });
        const [upadatedRows, fields1] = await connection.execute('SELECT * from Student where ID <> ?', [req.query.SID]);
        await connection.end();
        return upadatedRows;
    }

    data = getData()
    data.then((r) => {
        console.log('got the registered events', r);
        res.send(r);
    }).catch(e => {
        console.log('get registered event error', e);
    })
})

app.get('/getCompanyDetails', function (req, res) {
    console.log('inside get get company details');
    // let ID = localStorage.getItem("ID");

    async function getData() {

        const connection = await mysql.createConnection({ host: 'handshakedb.clco8f6rhzmw.us-east-1.rds.amazonaws.com', user: 'admin', password: 'admin123', database: 'handshake_clone', port: 3306 });
        const [upadatedRows, fields1] = await connection.execute('SELECT * from Company where ID=?', [req.query.CID]);
        await connection.end();
        return upadatedRows;
    }

    data = getData()
    data.then((r) => {
        console.log('got the company details', r);
        res.send(r);
    }).catch(e => {
        console.log('get company details error', e);
    })
})

app.post("/updateCompanyContact", function (req, res) {
    console.log('inside post update company contact');
    console.log("req body", req.body);
    let hash = bcrypt.hashSync(req.body.password, salt);

    async function register() {

        const connection = await mysql.createConnection({ host: 'handshakedb.clco8f6rhzmw.us-east-1.rds.amazonaws.com', user: 'admin', password: 'admin123', database: 'handshake_clone', port: 3306 });
        const [rows, fields] = await connection.execute('UPDATE Company SET email=?, phone=?, password=? WHERE ID=? ', [req.body.email, req.body.phone, hash, req.body.CID]);
        await connection.end();
    }

    register()
        .then(() => {
            console.log('update contact successfully');
            res.end();
        }).catch(e => {
            console.log(e)
            console.log('error aavi')
        })
})

app.post("/updateCompanyDetails", function (req, res) {
    console.log('inside post update company details');
    console.log("req body", req.body);
    async function register() {

        const connection = await mysql.createConnection({ host: 'handshakedb.clco8f6rhzmw.us-east-1.rds.amazonaws.com', user: 'admin', password: 'admin123', database: 'handshake_clone', port: 3306 });
        const [rows, fields] = await connection.execute('UPDATE Company SET companyName=?, location=?, description=? WHERE ID=? ', [req.body.companyName, req.body.location, req.body.description, req.body.CID]);
        await connection.end();
    }

    register()
        .then(() => {
            console.log('update company details successfully');
            res.end();
        }).catch(e => {
            console.log(e)
            console.log('error aavi')
        })
})

app.get('/getEventOfCompany', function (req, res) {
    console.log('inside get get events');

    async function getData() {

        const connection = await mysql.createConnection({ host: 'handshakedb.clco8f6rhzmw.us-east-1.rds.amazonaws.com', user: 'admin', password: 'admin123', database: 'handshake_clone', port: 3306 });
        const [upadatedRows, fields1] = await connection.execute('select * from Event where companyID=? ORDER BY date ASC ', [req.query.CID]);
        await connection.end();
        return upadatedRows;
    }

    data = getData()
    data.then((r) => {
        console.log('got the events of a company', r);
        res.send(r);
    }).catch(e => {
        console.log('get event error', e);
    })
})

app.post("/postEvent", function (req, res) {
    console.log('inside post event');
    console.log("req body", req.body);

    async function post() {

        const connection = await mysql.createConnection({ host: 'handshakedb.clco8f6rhzmw.us-east-1.rds.amazonaws.com', user: 'admin', password: 'admin123', database: 'handshake_clone', port: 3306 });
        const [rows, fields] = await connection.execute('INSERT INTO Event (name,location,description,time,date, eligibility,company, companyID) VALUES (?, ?, ?, ?, ?, ?, ?,?)', [req.body.name, req.body.location, req.body.description, req.body.time, req.body.date, req.body.eligibility, req.body.company, req.body.CID]);
        await connection.end();
    }

    post()
        .then(() => {
            console.log('posted event successfully');
            res.end();
        }).catch(e => {
            console.log(e)
            console.log('error aavi')
        })
})

app.get('/getRegisteredStudents', function (req, res) {
    console.log('inside get get registered students');

    async function getData() {

        const connection = await mysql.createConnection({ host: 'handshakedb.clco8f6rhzmw.us-east-1.rds.amazonaws.com', user: 'admin', password: 'admin123', database: 'handshake_clone', port: 3306 });
        const [upadatedRows, fields1] = await connection.execute('SELECT * FROM Student where ID IN (select SID from EventRegistry where EID = ?)', [req.query.ID]);
        await connection.end();
        return upadatedRows;
    }

    data = getData()
    data.then((r) => {
        console.log('got the registered students', r);
        res.send(r);
    }).catch(e => {
        console.log('get registered students error', e);
    })
})

app.get('/getAppliedStudents', function (req, res) {
    console.log('inside get get applied students');

    async function getData() {

        const connection = await mysql.createConnection({ host: 'handshakedb.clco8f6rhzmw.us-east-1.rds.amazonaws.com', user: 'admin', password: 'admin123', database: 'handshake_clone', port: 3306 });
        const [upadatedRows, fields1] = await connection.execute('SELECT * FROM Student inner join JobRegistry on JobRegistry.SID = Student.ID where JobRegistry.JID = ?', [req.query.ID]);
        await connection.end();
        return upadatedRows;
    }

    data = getData()
    data.then((r) => {
        console.log('got the applied students', r);
        res.send(r);
    }).catch(e => {
        console.log('get applied students error', e);
    })
})

app.get('/getAllStudents', function (req, res) {
    console.log('inside get get all students');

    async function getData() {

        const connection = await mysql.createConnection({ host: 'handshakedb.clco8f6rhzmw.us-east-1.rds.amazonaws.com', user: 'admin', password: 'admin123', database: 'handshake_clone', port: 3306 });
        const [upadatedRows, fields1] = await connection.execute('SELECT Student.ID, Student.name,Student.email, Student.school,Student.profilePicUrl, Student.passingYear,Student.phone,Student.careerObjective, group_concat(Skill.skill) as skills FROM Student left join Skill on Skill.SID = Student.ID group by Student.ID;');
        await connection.end();
        return upadatedRows;
    }

    data = getData()
    data.then((r) => {
        console.log('got all students', r);
        res.send(r);
    }).catch(e => {
        console.log('get all students error', e);
    })
})


//start your server on port 3001
app.listen(3001);
console.log("Server Listening on port 3001");
