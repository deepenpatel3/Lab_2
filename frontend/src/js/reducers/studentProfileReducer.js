import { STUDENT_GET_BASIC_DETAILS } from '../constants/action-types';
const jwt_decode = require('jwt-decode')

const initialState = {
    name: "",
    school: "",
    profilePicURL: "",
    city: ""
}

export default function studentProfileReducer(state = initialState, action) {
    switch (action.type) {
        case STUDENT_GET_BASIC_DETAILS:
            console.log("inside student get basic details reducer");
            var decoded = jwt_decode(action.payload.split(' ')[1]);
            return Object.assign({}, state, {
                name: decoded.name,
                school: decoded.school,
                city: decoded.city,
                profilePicURL: decoded.profilePicURL
            });
        default:
            return state;
    }
}