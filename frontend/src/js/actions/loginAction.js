import { STUDENT_LOG_IN, COMPANY_LOG_IN, STUDENT_SIGN_UP } from '../constants/action-types';
import cookie from 'react-cookies';
const fetch = require('node-fetch');
const jwt_decode = require('jwt-decode');

export const studentLogin = (loginData) => dispatch => {
    fetch('http://localhost:3001/student/account/signIn', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(loginData)
    })
        .then(response => response.json())
        .then(response => {
            console.log("login resp0nse", response)
            var decoded = jwt_decode(response.token.split(' ')[1]);
            console.log("decoded", decoded)
            if (decoded.signInSuccess) {
                cookie.save("token", response.token);
                cookie.save("SID", decoded.SID);
                cookie.save("name", decoded.name);
            }
            return dispatch({ type: STUDENT_LOG_IN, payload: decoded.signInSuccess });
        })
}

export const companyLogin = (loginData) => dispatch => {
    fetch('http://localhost:3001/company/account/signIn', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
    })
        .then(response => response.json())
        .then(response => {
            if (response.signInSuccess) {
                cookie.save("CID", response.CID);
                cookie.save("company", response.company);
            }
            return dispatch({ type: COMPANY_LOG_IN, payload: response.signInSuccess });
        })
}

export const studentSignup = (Data) => dispatch => {
    fetch('http://localhost:3001/student/account/signUp', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(Data)
    })
        .then(response => response.json())
        .then(response => {
            if (response.signUpSuccess) {
                cookie.save("SID", response.SID);
                cookie.save("name", response.name);
            }
            return dispatch({ type: STUDENT_SIGN_UP, payload: response.signUpSuccess });
        })
}