var connection = new require('./kafka/Connection');
const Students = require("./Models/studentModel");
//topics files
var login = require('./services/login');
var studentProfile = require("./services/studentProfile");
const mongoose = require('mongoose');
const { mongoDB } = require("./Utils/config");

var options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    poolSize: 500,
    bufferMaxEntries: 0
};

mongoose.connect(mongoDB, options, (err) => {
    if (err) {
        console.log("MONGODB connection error", err);
        console.log(`MongoDB Connection Failed`);
    } else {
        console.log(`MongoDB Connected`);
    }
});
// mongoose.set('useFindAndModify', false);

// Students.find({}, (err, result) => {
//     if (err) {
//         console.log("error", err)
//     }
//     else {
//         console.log("result-", result);
//     }
// })
var collections = mongoose.connections[0].collections;
var names = [];

Object.keys(collections).forEach(function (k) {
    names.push(k);
});

console.log("collections- ", names);

function handleTopicRequest(topic_name) {
    var consumer = connection.getConsumer(topic_name);
    var producer = connection.getProducer();
    console.log('server is running ');
    consumer.on('message', function (message) {
        console.log('message received for ' + topic_name);
        // console.log(JSON.stringify(message.value));
        var data = JSON.parse(message.value);

        switch (topic_name) {
            case "login":
                login.serve(data.data, function (err, res) {
                    response(data, res, producer);
                    return;
                })
            case "student_profile":
                studentProfile.serve(data.data, function (err, res) {
                    response(data, res, producer);
                    return;
                })
        }
    });
}

function response(data, res, producer) {
    console.log('after handle', res);
    var payloads = [
        {
            topic: data.replyTo,
            messages: JSON.stringify({
                correlationId: data.correlationId,
                data: res
            }),
            partition: 0
        }
    ];
    producer.send(payloads, function (err, data) {
        console.log('producer send', data);
    });
    return;
}

// Add your TOPICs here
//first argument is topic name
//second argument is a function that will handle this topic request
handleTopicRequest("login");
handleTopicRequest("student_profile");

