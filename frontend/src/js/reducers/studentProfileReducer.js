import { STUDENT_GET_BASIC_DETAILS, STUDENT_UPDATE_BASIC_DETAILS, STUDENT_GET_CONTACT_INFO, STUDENT_UPDATE_CONTACT_INFO, STUDENT_GET_CAREER_OBJECTIVE, STUDENT_UPDATE_CAREER_OBJECTIVE, STUDENT_GET_SKILLS } from '../constants/action-types';
const jwt_decode = require('jwt-decode')

const initialState = {
    name: "",
    school: "",
    city: "",
    email: "",
    phone: "",
    careerObjective: "",
    skills: []
}

export default function studentProfileReducer(state = initialState, action) {
    switch (action.type) {
        case STUDENT_GET_BASIC_DETAILS:
            console.log("inside student get basic details reducer");
            var decoded = jwt_decode(action.payload.split(' ')[1]);
            return Object.assign({}, state, {
                name: decoded.name,
                school: decoded.school,
                city: decoded.city
            });
        case STUDENT_UPDATE_BASIC_DETAILS:
            console.log("inside student update basic details reducer");
            var decoded = jwt_decode(action.payload.split(' ')[1]);
            return Object.assign({}, state, {
                name: decoded.name,
                school: decoded.school,
                city: decoded.city
            });
        case STUDENT_GET_CONTACT_INFO:
            console.log("inside student get contact info reducer")
            var decoded = jwt_decode(action.payload.split(' ')[1]);
            console.log('contact info', decoded)
            return Object.assign({}, state, {
                email: decoded.email,
                phone: decoded.phone
            });
        case STUDENT_UPDATE_CONTACT_INFO:
            // console.log("inside student update contact info reducer")
            var decoded = jwt_decode(action.payload.split(' ')[1]);
            return Object.assign({}, state, {
                email: decoded.email,
                phone: decoded.phone
            });
        case STUDENT_GET_CAREER_OBJECTIVE:
            // console.log("inside student get career objective")
            var decoded = jwt_decode(action.payload.split(' ')[1]);
            return Object.assign({}, state, {
                careerObjective: decoded.careerObjective
            });
        case STUDENT_UPDATE_CAREER_OBJECTIVE:
            var decoded = jwt_decode(action.payload.split(' ')[1]);
            return Object.assign({}, state, {
                careerObjective: decoded.careerObjective
            });
        case STUDENT_GET_SKILLS:
            var decoded = jwt_decode(action.payload.split(' ')[1]);
            return Object.assign({}, state, {
                skills: decoded.skills
            });
        default:
            return state;
    }
}