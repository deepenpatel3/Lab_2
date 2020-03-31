var assert = require("assert");
var supertest = require("supertest");
var should = require("should");

var server = supertest.agent("http://localhost:3001");

//Unit Test begin
describe("MochaTest", function () {

    //company sign in
    it("should login company", function (done) {
        server
            .post("/companySignIn")
            .send({ email: "shipt@shipt.com", password: "Aa123456" })
            .expect(200)
            .end(function (err, res) {
                console.log("Status: ", res.status);
                res.status.should.equal(200);
                done();

            });
    });

    //student sign in
    it("should login student", function (done) {
        server
            .post("/studentSignIn")
            .send({
                email: "ronald@sjsu.edu",
                password: "Dd123456"
            })
            .expect(200)
            .end(function (err, res) {
                console.log("Status: ", res.status);
                res.status.should.equal(200);
                done();
            });
    });


    //company sign up
    it("Should sign up company", function (done) {
        server
            .post("/companySignUp")
            .send({
                companyName: "Amazon", email: "amazon@amazon.com", password: "Aa123456", location: "San Jose"
            })
            .expect(200)
            .end(function (err, res) {
                console.log("Status: ", res.status);
                res.status.should.equal(200);
                done();
            });
    });


    //student sign up
    it("Should sign up student", function (done) {
        server
            .post("/studentSignUp")
            .send({
                name: "Darshit", email: "Darshit@gmail.com", password: "Dd123456", city: "San Jose", school: "SJSU"
            })
            .expect(200)
            .end(function (err, res) {
                console.log("Status: ", res.status);
                res.status.should.equal(200);
                done();
            });
    });

    //Education details
    it("should get edu details", function (done) {
        server
            .get("/getEducationDetails")
            .query({ ID: 3 })
            .expect(200)
            .end(function (err, res) {
                console.log("Status: ", res.status);
                res.status.should.equal(200);
                done();
            });
    });


});
