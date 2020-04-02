"use strict";
const express = require("express");
const router = express.Router();
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

router.post("/signIn", function (req, res) {
    console.log('inside company sign IN');
    let email = req.body.email;
    let password = req.body.password;
    console.log('req body', req.body);

    async function doSignIn() {
        const connection = await mysql.createConnection({ host: 'handshakedb.clco8f6rhzmw.us-east-1.rds.amazonaws.com', user: 'admin', password: 'admin123', database: 'handshake_clone', port: 3306 });
        const [upadatedRows, fields1] = await connection.execute('SELECT companyName, ID, password FROM `Company` WHERE email=(?)', [email]);
        await connection.end();
        console.log('user found', upadatedRows);
        if (upadatedRows.length) {
            if (bcrypt.compareSync(password, upadatedRows[0].password)) {
                console.log("password match");
                console.log('company found', upadatedRows[0])
                res.end(JSON.stringify({ CID: upadatedRows[0].ID, company: upadatedRows[0].companyName, signInSuccess: true }));
            } else {
                console.log("password doesnt match")
                res.end(JSON.stringify({ signInSuccess: false }))
            }
        } else {
            console.log("user doesnt exist")
            res.end(JSON.stringify({ signInSuccess: false }))
        }
    }
    doSignIn()
        .catch(e => {
            console.log('company sign in error', e)
        })
});

router.post("/companySignUp", function (req, res) {
    console.log('inside company sign up');
    let companyName = req.body.companyName;
    let email = req.body.email;
    let password = req.body.password;
    let location = req.body.location;
    let hash = bcrypt.hashSync(password, salt);

    async function storeData() {

        const connection = await mysql.createConnection({ host: 'handshakedb.clco8f6rhzmw.us-east-1.rds.amazonaws.com', user: 'admin', password: 'admin123', database: 'handshake_clone', port: 3306 });
        const [rows, fields] = await connection.execute('INSERT INTO `Company` (companyName, email, password, location) VALUES (?,?,?,?)', [companyName, email, hash, location]);
        await connection.end();
    }

    storeData()
        .then(() => {
            res.end();
        }).catch(e => {
            console.log(e)
            console.log('error aavi')
        })
})
module.exports = router;