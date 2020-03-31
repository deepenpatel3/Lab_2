import { LOG_IN } from '../constants/action-types';
import axios from 'axios';
import cookie from 'react-cookies';
const fetch = require('node-fetch');

export const login = (data) => dispatch => {
    axios.post('http://localhost:3001/studentSignIn', data)
        .then(response => {
            console.log('response', response.data)
            if (response.data.signInSuccess) {
                cookie.save("SID", response.data.SID);
                cookie.save("name", response.data.name);
            }
            return dispatch({ type: LOG_IN, payload: response.data.signInSuccess });
        })
}