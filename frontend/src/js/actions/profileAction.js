import { STUDENT_GET_BASIC_DETAILS } from '../constants/action-types';
import cookie from "react-cookies";
import axios from 'axios';


export const studentGetBasicDetails = () => dispatch => {
    let data = {
        SID: cookie.load("SID"),
        name: cookie.load("name")
    }
    axios({
        url: 'http://localhost:3001/student/profile/getBasicDetails',
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': cookie.load("token")
        },
        params: data
    })
        .then(response => {
            console.log("student basic details", response.data);
            return dispatch({ type: STUDENT_GET_BASIC_DETAILS, payload: response.data.token });
        })
}