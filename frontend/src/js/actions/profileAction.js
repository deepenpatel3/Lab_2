import { STUDENT_GET_BASIC_DETAILS, STUDENT_UPDATE_BASIC_DETAILS, STUDENT_GET_CONTACT_INFO, STUDENT_UPDATE_CONTACT_INFO, STUDENT_GET_CAREER_OBJECTIVE, STUDENT_UPDATE_CAREER_OBJECTIVE, STUDENT_GET_SKILLS } from '../constants/action-types';
import cookie from "react-cookies";
import axios from 'axios';

export const studentGetBasicDetails = () => dispatch => {
    console.log("insdie get basic details action")
    let data = {
        SID: cookie.load("SID")
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
            // console.log("student basic details", response.data);
            return dispatch({ type: STUDENT_GET_BASIC_DETAILS, payload: response.data.token });
        })
}

export const studentUpdateBasicDetails = (formData) => dispatch => {
    console.log("inside update details action");
    axios({
        url: 'http://localhost:3001/student/profile/updateBasicDetails',
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': cookie.load("token")
        },
        data: formData
    })
        .then(response => {
            // console.log("response", response);
            return dispatch({ type: STUDENT_UPDATE_BASIC_DETAILS, payload: response.data.token });
        })
}

export const studentGetContactInfo = () => dispatch => {
    console.log("inside student get contact info")
    let data = {
        SID: cookie.load("SID")
    }
    axios({
        url: 'http://localhost:3001/student/profile/getContactInfo',
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': cookie.load("token")
        },
        params: data
    })
        .then(response => {
            // console.log("student basic details", response.data);
            return dispatch({ type: STUDENT_GET_CONTACT_INFO, payload: response.data.token });
        })
}

export const studentUpdateContactInfo = (formData) => dispatch => {
    console.log("inside student update contact info")
    axios({
        url: 'http://localhost:3001/student/profile/updateContactInfo',
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': cookie.load("token")
        },
        data: formData
    })
        .then(response => {
            // console.log("student updated contact info", response.data);
            return dispatch({ type: STUDENT_UPDATE_CONTACT_INFO, payload: response.data.token });
        })
}

export const studentGetCareerObjective = () => dispatch => {
    console.log("inside student get career objective action")
    let data = {
        SID: cookie.load("SID")
    }
    axios({
        url: 'http://localhost:3001/student/profile/getCareerObjective',
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': cookie.load("token")
        },
        params: data
    })
        .then(response => {
            // console.log("student updated contact info", response.data);
            return dispatch({ type: STUDENT_GET_CAREER_OBJECTIVE, payload: response.data.token });
        })
}

export const studentUpdateCareerObjective = (formData) => dispatch => {
    console.log("inside student update career objective action")
    axios({
        url: 'http://localhost:3001/student/profile/updateCareerObjective',
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': cookie.load("token")
        },
        data: formData
    })
        .then(response => {
            // console.log("student updated contact info", response.data);
            return dispatch({ type: STUDENT_UPDATE_CAREER_OBJECTIVE, payload: response.data.token });
        })
}

export const studentGetSkills = () => dispatch => {
    console.log("inside student get skills action")
    let data = {
        SID: cookie.load("SID")
    }
    axios({
        url: 'http://localhost:3001/student/profile/getSkills',
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': cookie.load("token")
        },
        params: data
    })
        .then(response => {
            // console.log("student updated contact info", response.data);
            return dispatch({ type: STUDENT_GET_SKILLS, payload: response.data.token });
        })
}